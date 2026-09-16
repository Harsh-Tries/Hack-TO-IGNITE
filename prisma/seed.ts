import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SECUREEXAM database with Phase 1-5 demo data...');

  // Clear existing
  await prisma.blockchainRecord.deleteMany({});
  await prisma.questionPaper.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.examCenterAssignment.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.college.deleteMany({});

  // 1. Seed Colleges
  const pict = await prisma.college.create({
    data: {
      code: 'COL-PICT-01',
      name: 'Pune Institute of Computer Technology (PICT)',
      address: 'Dhankawadi, Katraj-Hadapsar Bypass Rd',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411043',
      contactName: 'Dr. P. T. Kulkarni',
      contactEmail: 'examcontroller@pict.edu',
      contactPhone: '+91 20 2437 1101',
      status: 'ACTIVE',
    },
  });

  const coep = await prisma.college.create({
    data: {
      code: 'COL-COEP-02',
      name: 'College of Engineering Pune (COEP Tech)',
      address: 'Wellesley Rd, Shivajinagar',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411005',
      contactName: 'Prof. S. B. Patil',
      contactEmail: 'coepexams@coep.ac.in',
      contactPhone: '+91 20 2550 7000',
      status: 'ACTIVE',
    },
  });

  const vit = await prisma.college.create({
    data: {
      code: 'COL-VIT-03',
      name: 'Vishwakarma Institute of Technology (VIT)',
      address: '666, Upper Indiranagar, Bibwewadi',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411037',
      contactName: 'Dr. Vivek Deshpande',
      contactEmail: 'controller@vit.edu',
      contactPhone: '+91 20 2428 3001',
      status: 'ACTIVE',
    },
  });

  const cummins = await prisma.college.create({
    data: {
      code: 'COL-CUMMINS-04',
      name: 'Cummins College of Engineering for Women',
      address: 'Karve Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411052',
      contactName: 'Dr. Madhuri Khambete',
      contactEmail: 'exams@cumminscollege.in',
      contactPhone: '+91 20 2531 1000',
      status: 'ACTIVE',
    },
  });

  const mit = await prisma.college.create({
    data: {
      code: 'COL-MIT-05',
      name: 'MIT World Peace University (MIT-WPU)',
      address: 'Paud Rd, Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411038',
      contactName: 'Prof. Milind Pande',
      contactEmail: 'exams@mitwpu.edu.in',
      contactPhone: '+91 20 7117 7104',
      status: 'ACTIVE',
    },
  });

  // 2. Seed Users across all 7 roles
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@secureexam.demo',
      name: 'Harsh Wagh',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      googleId: 'goog-super-admin',
      isGoogleVerified: true,
      collegeId: pict.id,
    },
  });

  const examAdmin = await prisma.user.create({
    data: {
      email: 'exam.admin@secureexam.demo',
      name: 'Prof. Rajesh Kumar',
      role: 'EXAM_ADMIN',
      status: 'ACTIVE',
      googleId: 'goog-exam-admin',
      isGoogleVerified: true,
      collegeId: pict.id,
    },
  });

  const setter1 = await prisma.user.create({
    data: {
      email: 'setter@secureexam.demo',
      name: 'Dr. Ananya Sharma',
      role: 'QUESTION_SETTER',
      status: 'ACTIVE',
      googleId: 'goog-setter-01',
      isGoogleVerified: true,
      collegeId: coep.id,
    },
  });

  const collegeAdmin = await prisma.user.create({
    data: {
      email: 'college@secureexam.demo',
      name: 'Principal V. S. Patil',
      role: 'COLLEGE_ADMIN',
      status: 'ACTIVE',
      googleId: 'goog-college-admin',
      isGoogleVerified: true,
      collegeId: pict.id,
    },
  });

  const invigilator = await prisma.user.create({
    data: {
      email: 'invigilator@secureexam.demo',
      name: 'Prof. Suresh Mehta',
      role: 'INVIGILATOR',
      status: 'ACTIVE',
      googleId: 'goog-invigilator',
      isGoogleVerified: true,
      collegeId: pict.id,
    },
  });

  const auditor = await prisma.user.create({
    data: {
      email: 'auditor@secureexam.demo',
      name: 'Vikramaditya Rao',
      role: 'AUDITOR',
      status: 'ACTIVE',
      googleId: 'goog-auditor',
      isGoogleVerified: true,
    },
  });

  const pendingUser = await prisma.user.create({
    data: {
      email: 'pending@secureexam.demo',
      name: 'New Faculty Applicant',
      role: 'PENDING',
      status: 'PENDING',
      googleId: 'goog-pending-01',
      isGoogleVerified: true,
    },
  });

  // 3. Seed Exams
  const exam1 = await prisma.exam.create({
    data: {
      examCode: 'DSA-2026-001',
      title: 'Data Structures & Algorithms Final',
      description: 'End Semester University Examination for Computer Engineering VI Semester.',
      academicYear: '2026-2027',
      semester: 'Semester VI',
      department: 'Computer Engineering',
      subject: 'Data Structures & Algorithms',
      examDate: new Date('2026-09-25T09:00:00Z'),
      startTime: '09:00 AM',
      durationMinutes: 180,
      paperReleaseTime: new Date('2026-09-25T08:30:00Z'),
      status: 'SCHEDULED',
      createdById: examAdmin.id,
    },
  });

  const exam2 = await prisma.exam.create({
    data: {
      examCode: 'MAT-2026-002',
      title: 'Engineering Mathematics III',
      description: 'Comprehensive evaluation for 3rd semester engineering students.',
      academicYear: '2026-2027',
      semester: 'Semester III',
      department: 'Applied Sciences',
      subject: 'Engineering Mathematics III',
      examDate: new Date('2026-09-27T10:00:00Z'),
      startTime: '10:00 AM',
      durationMinutes: 180,
      paperReleaseTime: new Date('2026-09-27T09:30:00Z'),
      status: 'SCHEDULED',
      createdById: examAdmin.id,
    },
  });

  const exam3 = await prisma.exam.create({
    data: {
      examCode: 'ECE-2026-003',
      title: 'Digital Signal Processing',
      description: 'Theory examination for Electronics and Telecommunication.',
      academicYear: '2026-2027',
      semester: 'Semester V',
      department: 'Electronics & Telecom',
      subject: 'Digital Signal Processing',
      examDate: new Date('2026-10-02T14:00:00Z'),
      startTime: '02:00 PM',
      durationMinutes: 150,
      paperReleaseTime: new Date('2026-10-02T13:30:00Z'),
      status: 'DRAFT',
      createdById: superAdmin.id,
    },
  });

  // 4. Assign Colleges to Exams
  await prisma.examCenterAssignment.createMany({
    data: [
      { examId: exam1.id, collegeId: pict.id, assignedById: examAdmin.id, status: 'ASSIGNED' },
      { examId: exam1.id, collegeId: coep.id, assignedById: examAdmin.id, status: 'ASSIGNED' },
      { examId: exam1.id, collegeId: vit.id, assignedById: examAdmin.id, status: 'ASSIGNED' },
      { examId: exam2.id, collegeId: pict.id, assignedById: examAdmin.id, status: 'ASSIGNED' },
      { examId: exam2.id, collegeId: cummins.id, assignedById: examAdmin.id, status: 'ASSIGNED' },
      { examId: exam2.id, collegeId: mit.id, assignedById: examAdmin.id, status: 'ASSIGNED' },
    ],
  });

  // 5. Seed Question Papers (Phase 4)
  const paper1 = await prisma.questionPaper.create({
    data: {
      paperCode: 'QP-DSA-2026-001',
      examId: exam1.id,
      subject: 'Data Structures & Algorithms',
      originalFilename: 'DSA_Final_Exam_2026_Official.pdf',
      encryptedFilePath: 'storage/encrypted_papers/qp-dsa-2026-001.enc',
      sha256Hash: '8a7f9b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcd',
      releaseTime: exam1.paperReleaseTime,
      status: 'REGISTERED',
      uploaderId: setter1.id,
    },
  });

  const paper2 = await prisma.questionPaper.create({
    data: {
      paperCode: 'QP-MAT-2026-002',
      examId: exam2.id,
      subject: 'Engineering Mathematics III',
      originalFilename: 'Engg_Maths_III_Final.pdf',
      encryptedFilePath: 'storage/encrypted_papers/qp-mat-2026-002.enc',
      sha256Hash: '4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
      releaseTime: exam2.paperReleaseTime,
      status: 'REGISTERED',
      uploaderId: setter1.id,
    },
  });

  // 6. Seed Blockchain Records (Phase 5)
  await prisma.blockchainRecord.createMany({
    data: [
      {
        paperId: paper1.id,
        paperCode: paper1.paperCode,
        examId: exam1.id,
        sha256Hash: paper1.sha256Hash,
        issuerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        txHash: '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a8d43ef119c32a10b45fe9812',
        blockNumber: 12843,
        status: 'CONFIRMED',
      },
      {
        paperId: paper2.id,
        paperCode: paper2.paperCode,
        examId: exam2.id,
        sha256Hash: paper2.sha256Hash,
        issuerAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        txHash: '0x3c2a10b45fe98127a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a8d43ef119',
        blockNumber: 12844,
        status: 'CONFIRMED',
      },
    ],
  });

  // 7. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        eventType: 'PAPER_UPLOADED',
        entityType: 'QuestionPaper',
        entityId: paper1.id,
        actorId: setter1.id,
        actorEmail: setter1.email,
        actorRole: 'QUESTION_SETTER',
        targetResource: paper1.paperCode,
        details: `Question paper ${paper1.originalFilename} uploaded and validated.`,
        result: 'GRANTED',
      },
      {
        eventType: 'PAPER_ENCRYPTED',
        entityType: 'QuestionPaper',
        entityId: paper1.id,
        actorId: setter1.id,
        actorEmail: setter1.email,
        actorRole: 'QUESTION_SETTER',
        targetResource: paper1.paperCode,
        details: `AES-256-GCM symmetric cipher encryption completed.`,
        result: 'GRANTED',
      },
      {
        eventType: 'PAPER_REGISTERED',
        entityType: 'BlockchainRecord',
        actorId: setter1.id,
        actorEmail: setter1.email,
        actorRole: 'QUESTION_SETTER',
        targetResource: paper1.paperCode,
        details: `SHA-256 hash registered on Hardhat smart contract in Block #12843.`,
        result: 'GRANTED',
      },
    ],
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
