import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits
const MASTER_SECRET = process.env.ENCRYPTION_MASTER_KEY || 'secure-exam-master-key-32-bytes-long!!';

// Derives a deterministic 256-bit key for a given paper using HKDF
export function derivePaperKey(paperId: string): Buffer {
  const rawKey = crypto.hkdfSync('sha256', MASTER_SECRET, 'secureexam-salt', paperId, 32);
  return Buffer.from(rawKey);
}

// Calculate SHA-256 hash of a buffer
export function calculateSHA256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Encrypt file buffer with AES-256-GCM
export function encryptBuffer(buffer: Buffer, key: Buffer): { envelope: Buffer; ivHex: string; authTagHex: string } {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Envelope format: [IV (12B)] [AuthTag (16B)] [Encrypted Data]
  const envelope = Buffer.concat([iv, authTag, encrypted]);

  return {
    envelope,
    ivHex: iv.toString('hex'),
    authTagHex: authTag.toString('hex'),
  };
}

// Decrypt file buffer with AES-256-GCM
export function decryptEnvelope(envelope: Buffer, key: Buffer): Buffer {
  if (envelope.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid encrypted envelope: payload too short');
  }

  const iv = envelope.subarray(0, IV_LENGTH);
  const authTag = envelope.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encryptedData = envelope.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}

// Save encrypted envelope to Supabase Storage or local disk fallback
export async function saveEncryptedPaper(paperId: string, envelope: Buffer): Promise<string> {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (!isDemoMode && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin');
      const admin = createAdminClient();
      const storagePath = `${paperId}.enc`;

      const { error } = await admin.storage
        .from('encrypted-papers')
        .upload(storagePath, envelope, {
          contentType: 'application/octet-stream',
          upsert: true,
        });

      if (!error) {
        return storagePath;
      }
      console.warn('Supabase storage upload failed, falling back to disk storage:', error.message);
    } catch (err) {
      console.warn('Supabase client error, falling back to disk storage:', err);
    }
  }

  // Local filesystem fallback
  const storageDir = path.join(process.cwd(), 'storage', 'encrypted_papers');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const filePath = path.join(storageDir, `${paperId}.enc`);
  await fs.promises.writeFile(filePath, envelope);
  return filePath;
}

// Read and decrypt paper on server
export async function loadAndDecryptPaper(paperId: string, storagePath?: string): Promise<Buffer> {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const targetPath = storagePath || `${paperId}.enc`;

  if (!isDemoMode && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin');
      const admin = createAdminClient();

      const { data, error } = await admin.storage
        .from('encrypted-papers')
        .download(targetPath);

      if (!error && data) {
        const arrayBuffer = await data.arrayBuffer();
        const envelope = Buffer.from(arrayBuffer);
        const key = derivePaperKey(paperId);
        return decryptEnvelope(envelope, key);
      }
    } catch (err) {
      console.warn('Supabase storage download failed, checking disk storage:', err);
    }
  }

  const filePath = path.join(process.cwd(), 'storage', 'encrypted_papers', `${paperId}.enc`);
  if (!fs.existsSync(filePath)) {
    throw new Error('Encrypted paper file not found on server');
  }

  const envelope = await fs.promises.readFile(filePath);
  const key = derivePaperKey(paperId);
  return decryptEnvelope(envelope, key);
}
