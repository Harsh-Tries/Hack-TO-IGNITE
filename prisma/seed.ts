import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SECUREEXAM database with Phase 1-3 demo data...');

  // Clear existing
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

  // 5. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        eventType: 'LOGIN',
        actorId: superAdmin.id,
        actorEmail: superAdmin.email,
        actorRole: 'SUPER_ADMIN',
        targetResource: 'System Auth',
        details: 'User Harsh Wagh authenticated successfully via Google OAuth.',
        result: 'GRANTED',
      },
      {
        eventType: 'EXAM_CREATED',
        entityType: 'Exam',
        entityId: exam1.id,
        actorId: examAdmin.id,
        actorEmail: examAdmin.email,
        actorRole: 'EXAM_ADMIN',
        targetResource: 'DSA-2026-001',
        details: 'Created examination Data Structures & Algorithms Final.',
        result: 'GRANTED',
      },
      {
        eventType: 'EXAM_CENTER_ASSIGNED',
        entityType: 'ExamCenterAssignment',
        actorId: examAdmin.id,
        actorEmail: examAdmin.email,
        actorRole: 'EXAM_ADMIN',
        targetResource: 'PICT Center',
        details: 'Assigned examination DSA-2026-001 to Pune Institute of Computer Technology.',
        result: 'GRANTED',
      },
      {
        eventType: 'ROLE_CHANGED',
        entityType: 'User',
        entityId: setter1.id,
        actorId: superAdmin.id,
        actorEmail: superAdmin.email,
        actorRole: 'SUPER_ADMIN',
        targetResource: 'Dr. Ananya Sharma',
        details: 'Role updated from PENDING to QUESTION_SETTER.',
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
