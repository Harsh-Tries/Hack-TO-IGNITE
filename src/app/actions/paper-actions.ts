'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getServerProfile } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { calculateSHA256, derivePaperKey, encryptBuffer, saveEncryptedPaper } from '@/lib/crypto';
import { registerPaperOnChain, verifyPaperOnChain } from '@/lib/blockchain';
import crypto from 'crypto';

export async function uploadQuestionPaper(formData: FormData) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    revalidatePath('/papers');
    revalidatePath('/blockchain');
    revalidatePath('/dashboard');
    return {
      success: true,
      paperId: 'demo-paper-' + Date.now(),
      paperCode: (formData.get('paperCode') as string) || 'QP-DEMO-001',
      sha256Hash: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e',
      txHash: '0x' + crypto.randomBytes(32).toString('hex'),
      blockNumber: 12845,
    };
  }

  const actor = await getServerProfile();

  if (!actor || !hasPermission(actor.role, 'UPLOAD_PAPER')) {
    return { success: false, error: 'Unauthorized: Permission denied to upload question papers.' };
  }

  const file = formData.get('file') as File | null;
  const examId = formData.get('examId') as string;
  const subject = formData.get('subject') as string;
  const paperCodeInput = formData.get('paperCode') as string;

  if (!file || !examId) {
    return { success: false, error: 'Missing required upload parameters (file, examId).' };
  }

  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    return { success: false, error: 'Invalid file type. Only PDF documents are allowed.' };
  }

  const MAX_SIZE = 15 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'File size exceeds maximum allowed limit of 15MB.' };
  }

  try {
    const supabase = await createClient();

    const { data: exam } = await supabase.from('exams').select('*').eq('id', examId).single();
    if (!exam) return { success: false, error: 'Specified examination schedule not found.' };

    const paperCode = paperCodeInput || `QP-${exam.code}-${Date.now().toString().slice(-4)}`;

    const arrayBuffer = await file.arrayBuffer();
    const plaintextBuffer = Buffer.from(arrayBuffer);

    // 1. SHA-256 Hash
    const sha256Hash = calculateSHA256(plaintextBuffer);

    // 2. Random Paper ID
    const paperId = crypto.randomUUID();

    // 3. AES-256-GCM Encryption
    const paperKey = derivePaperKey(paperId);
    const { envelope, ivHex, authTagHex } = encryptBuffer(plaintextBuffer, paperKey);

    // 4. Save Encrypted Envelope
    const encryptedStoragePath = await saveEncryptedPaper(paperId, envelope);

    // 5. Insert question_papers record
    const { data: paper, error: paperError } = await supabase
      .from('question_papers')
      .insert({
        id: paperId,
        paper_code: paperCode,
        exam_id: examId,
        uploaded_by: actor.id,
        original_filename: file.name,
        encrypted_storage_path: encryptedStoragePath,
        file_size: file.size,
        mime_type: 'application/pdf',
        sha256_hash: sha256Hash,
        encryption_algorithm: 'AES-256-GCM',
        encryption_iv: ivHex,
        encryption_auth_tag: authTagHex,
        status: 'ENCRYPTED',
      })
      .select('id')
      .single();

    if (paperError || !paper) {
      throw new Error(paperError?.message || 'Failed to create question paper record.');
    }

    // 6. Audit log
    await supabase.from('audit_logs').insert([
      {
        actor_id: actor.id,
        event_type: 'PAPER_UPLOADED',
        entity_type: 'QuestionPaper',
        entity_id: paper.id,
        description: `Uploaded question paper "${file.name}" for exam ${exam.code}`,
        metadata: { sha256Hash: sha256Hash.slice(0, 16) },
      },
      {
        actor_id: actor.id,
        event_type: 'PAPER_ENCRYPTED',
        entity_type: 'QuestionPaper',
        entity_id: paper.id,
        description: `AES-256-GCM encryption completed. IV: ${ivHex.slice(0, 8)}...`,
      },
    ]);

    // 7. Blockchain Registration
    const releaseTimestamp = exam.paper_release_time ? Math.floor(new Date(exam.paper_release_time).getTime() / 1000) : 0;
    const chainResult = await registerPaperOnChain(paper.id, exam.id, sha256Hash, releaseTimestamp);

    // 8. Blockchain Record in DB
    await supabase.from('blockchain_records').insert({
      paper_id: paper.id,
      paper_hash: sha256Hash,
      registered_by: actor.id,
      transaction_hash: chainResult.txHash,
      block_number: chainResult.blockNumber,
      contract_address: chainResult.contractAddress,
      verification_status: chainResult.status,
    });

    // 9. Update paper status
    await supabase.from('question_papers').update({ status: 'BLOCKCHAIN_REGISTERED' }).eq('id', paper.id);

    revalidatePath('/papers');
    revalidatePath('/blockchain');
    revalidatePath('/dashboard');

    return {
      success: true,
      paperId: paper.id,
      paperCode,
      sha256Hash,
      txHash: chainResult.txHash,
      blockNumber: chainResult.blockNumber,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to upload and encrypt question paper.' };
  }
}

export async function verifyPaperIntegrity(paperId: string, testHash?: string) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    return {
      success: true,
      matches: true,
      paperCode: 'QP-DSA-2026-001',
      subject: 'DSA',
      examTitle: 'Data Structures and Algorithms',
      expectedHash: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e',
      receivedHash: testHash || 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e',
      onChainHash: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e',
      status: 'BLOCKCHAIN_REGISTERED',
      txHash: '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a3f9c2e01b44d88e42f9a77c',
      blockNumber: 12842,
    };
  }

  try {
    const supabase = await createClient();

    const { data: paper } = await supabase
      .from('question_papers')
      .select('*, exam:exams(*), blockchain_record:blockchain_records(*)')
      .eq('id', paperId)
      .single();

    if (!paper) {
      return { success: false, error: 'Question paper record not found.' };
    }

    const hashToVerify = testHash || paper.sha256_hash;
    const chainVerification = await verifyPaperOnChain(paper.id, hashToVerify, paper.sha256_hash);
    const matches = hashToVerify.toLowerCase() === paper.sha256_hash.toLowerCase();

    return {
      success: true,
      matches,
      paperCode: paper.paper_code,
      subject: paper.exam?.subject || '',
      examTitle: paper.exam?.name || '',
      expectedHash: paper.sha256_hash,
      receivedHash: hashToVerify,
      onChainHash: chainVerification.onChainHash,
      status: paper.status,
      txHash: paper.blockchain_record?.transaction_hash || null,
      blockNumber: paper.blockchain_record?.block_number || null,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Verification failed.' };
  }
}

export async function revokePaper(paperId: string, reason: string) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    revalidatePath('/papers');
    return { success: true };
  }

  const actor = await getServerProfile();

  if (!actor || (actor.role !== 'SUPER_ADMIN' && actor.role !== 'EXAM_ADMIN')) {
    return { success: false, error: 'Unauthorized: Only SUPER_ADMIN or EXAM_ADMIN can revoke papers.' };
  }

  try {
    const supabase = await createClient();

    await supabase
      .from('question_papers')
      .update({ status: 'REVOKED' })
      .eq('id', paperId);

    await supabase.from('audit_logs').insert({
      actor_id: actor.id,
      event_type: 'PAPER_REVOKED',
      entity_type: 'QuestionPaper',
      entity_id: paperId,
      description: `Question paper revoked by ${actor.full_name}. Reason: ${reason}`,
    });

    revalidatePath('/papers');
    revalidatePath(`/papers/${paperId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to revoke paper.' };
  }
}
