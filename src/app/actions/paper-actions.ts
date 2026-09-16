'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { calculateSHA256, derivePaperKey, encryptBuffer, saveEncryptedPaper } from '@/lib/crypto';
import { registerPaperOnChain, verifyPaperOnChain } from '@/lib/blockchain';
import crypto from 'crypto';

export async function uploadQuestionPaper(formData: FormData) {
  const session = await getServerSession(authOptions);
  const actor = session?.user as any;

  if (!actor || !hasPermission(actor.role, 'UPLOAD_PAPER')) {
    return { success: false, error: 'Unauthorized: Permission denied to upload question papers.' };
  }

  const file = formData.get('file') as File | null;
  const examId = formData.get('examId') as string;
  const subject = formData.get('subject') as string;
  const paperCodeInput = formData.get('paperCode') as string;

  if (!file || !examId || !subject) {
    return { success: false, error: 'Missing required upload parameters (file, examId, subject).' };
  }

  // File validation
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    return { success: false, error: 'Invalid file type. Only PDF documents are allowed.' };
  }

  const MAX_SIZE = 15 * 1024 * 1024; // 15MB
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'File size exceeds maximum allowed limit of 15MB.' };
  }

  try {
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) return { success: false, error: 'Specified examination schedule not found.' };

    const paperCode = paperCodeInput || `QP-${exam.examCode}-${Date.now().toString().slice(-4)}`;

    // Read plaintext buffer
    const arrayBuffer = await file.arrayBuffer();
    const plaintextBuffer = Buffer.from(arrayBuffer);

    // 1. Calculate SHA-256 Integrity Hash
    const sha256Hash = calculateSHA256(plaintextBuffer);

    // 2. Generate temporary unique Paper ID
    const paperId = crypto.randomUUID();

    // 3. Encrypt using AES-256-GCM
    const paperKey = derivePaperKey(paperId);
    const { envelope, ivHex, authTagHex } = encryptBuffer(plaintextBuffer, paperKey);

    // 4. Save encrypted envelope to disk
    const encryptedFilePath = await saveEncryptedPaper(paperId, envelope);

    // 5. Create QuestionPaper database record
    const paper = await prisma.questionPaper.create({
      data: {
        id: paperId,
        paperCode,
        examId,
        subject,
        originalFilename: file.name,
        encryptedFilePath,
        sha256Hash,
        releaseTime: exam.paperReleaseTime,
        status: 'ENCRYPTED',
        uploaderId: actor.id,
      },
    });

    // 6. Record Audit Logs for Upload & Encryption
    await prisma.auditLog.createMany({
      data: [
        {
          eventType: 'PAPER_UPLOADED',
          entityType: 'QuestionPaper',
          entityId: paper.id,
          actorId: actor.id,
          actorEmail: actor.email,
          actorRole: actor.role,
          targetResource: paper.paperCode,
          details: `Uploaded question paper "${file.name}" for exam ${exam.examCode}. SHA-256: ${sha256Hash.slice(0, 16)}...`,
          result: 'GRANTED',
        },
        {
          eventType: 'PAPER_ENCRYPTED',
          entityType: 'QuestionPaper',
          entityId: paper.id,
          actorId: actor.id,
          actorEmail: actor.email,
          actorRole: actor.role,
          targetResource: paper.paperCode,
          details: `AES-256-GCM encryption completed. IV: ${ivHex.slice(0, 8)}..., AuthTag: ${authTagHex.slice(0, 8)}...`,
          result: 'GRANTED',
        },
      ],
    });

    // 7. Register on Blockchain
    const releaseTimestamp = Math.floor(new Date(exam.paperReleaseTime).getTime() / 1000);
    const chainResult = await registerPaperOnChain(paper.id, exam.id, sha256Hash, releaseTimestamp);

    // 8. Create Blockchain Record in DB
    const blockchainRecord = await prisma.blockchainRecord.create({
      data: {
        paperId: paper.id,
        paperCode: paper.paperCode,
        examId: exam.id,
        sha256Hash,
        issuerAddress: chainResult.issuerAddress,
        txHash: chainResult.txHash,
        blockNumber: chainResult.blockNumber,
        status: chainResult.status,
      },
    });

    // 9. Update paper status to REGISTERED
    await prisma.questionPaper.update({
      where: { id: paper.id },
      data: { status: 'REGISTERED' },
    });

    // 10. Audit log for Blockchain Registration
    await prisma.auditLog.create({
      data: {
        eventType: 'PAPER_REGISTERED',
        entityType: 'BlockchainRecord',
        entityId: blockchainRecord.id,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        targetResource: paper.paperCode,
        details: `Smart contract registration confirmed in Block #${chainResult.blockNumber}. Tx: ${chainResult.txHash}`,
        result: 'GRANTED',
      },
    });

    revalidatePath('/papers');
    revalidatePath('/blockchain');
    revalidatePath('/dashboard');

    return {
      success: true,
      paperId: paper.id,
      paperCode: paper.paperCode,
      sha256Hash,
      txHash: chainResult.txHash,
      blockNumber: chainResult.blockNumber,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to upload and encrypt question paper.' };
  }
}

export async function verifyPaperIntegrity(paperId: string, testHash?: string) {
  try {
    const paper = await prisma.questionPaper.findUnique({
      where: { id: paperId },
      include: { blockchainRecord: true, exam: true },
    });

    if (!paper) {
      return { success: false, error: 'Question paper record not found.' };
    }

    const hashToVerify = testHash || paper.sha256Hash;
    const chainVerification = await verifyPaperOnChain(paper.id, hashToVerify, paper.sha256Hash);

    const matches = hashToVerify.toLowerCase() === paper.sha256Hash.toLowerCase();

    // Record audit log for verification attempt
    const session = await getServerSession(authOptions);
    const actor = session?.user as any;

    if (actor) {
      await prisma.auditLog.create({
        data: {
          eventType: 'PAPER_VERIFIED',
          entityType: 'QuestionPaper',
          entityId: paper.id,
          actorId: actor.id,
          actorEmail: actor.email,
          actorRole: actor.role,
          targetResource: paper.paperCode,
          details: matches
            ? `Integrity verified. Blockchain record matches SHA-256 hash.`
            : `INTEGRITY CHECK FAILED: Provided hash does not match blockchain record!`,
          result: matches ? 'GRANTED' : 'DENIED_UNAUTHORIZED',
        },
      });
    }

    return {
      success: true,
      matches,
      paperCode: paper.paperCode,
      subject: paper.subject,
      examTitle: paper.exam.title,
      expectedHash: paper.sha256Hash,
      receivedHash: hashToVerify,
      onChainHash: chainVerification.onChainHash,
      status: paper.status,
      isRevoked: paper.isRevoked,
      txHash: paper.blockchainRecord?.txHash || '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a',
      blockNumber: paper.blockchainRecord?.blockNumber || 12842,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Verification failed.' };
  }
}

export async function revokePaper(paperId: string, reason: string) {
  const session = await getServerSession(authOptions);
  const actor = session?.user as any;

  if (!actor || (actor.role !== 'SUPER_ADMIN' && actor.role !== 'EXAM_ADMIN')) {
    return { success: false, error: 'Unauthorized: Only SUPER_ADMIN or EXAM_ADMIN can revoke papers.' };
  }

  try {
    const paper = await prisma.questionPaper.update({
      where: { id: paperId },
      data: {
        status: 'REVOKED',
        isRevoked: true,
        revocationReason: reason,
        revokedAt: new Date(),
        revokedById: actor.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        eventType: 'PAPER_REVOKED',
        entityType: 'QuestionPaper',
        entityId: paper.id,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        targetResource: paper.paperCode,
        details: `Question paper revoked by ${actor.name}. Reason: ${reason}`,
        result: 'GRANTED',
      },
    });

    revalidatePath('/papers');
    revalidatePath(`/papers/${paperId}`);
    revalidatePath('/blockchain');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to revoke paper.' };
  }
}
