import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Colleges
  const pict = await prisma.college.upsert({
    where: { code: 'COL-PICT-01' },
    update: {},
    create: {
      code: 'COL-PICT-01',
      name: 'Pune Institute of Computer Technology (PICT)',
      address: 'Dhankawadi, Pune, Maharashtra 411043',
      contactEmail: 'examcell@pict.edu',
      status: 'ACTIVE',
    },
  });

  const coep = await prisma.college.upsert({
    where: { code: 'COL-COEP-02' },
    update: {},
    create: {
      code: 'COL-COEP-02',
      name: 'College of Engineering Pune (COEP Technological University)',
      address: 'Wellesley Rd, Shivajinagar, Pune 411005',
      contactEmail: 'controller@coep.ac.in',
      status: 'ACTIVE',
    },
  });

  const vit = await prisma.college.upsert({
    where: { code: 'COL-VIT-03' },
    update: {},
    create: {
      code: 'COL-VIT-03',
      name: 'Vishwakarma Institute of Technology (VIT)',
      address: 'Bibwewadi, Pune, Maharashtra 411037',
      contactEmail: 'exams@vit.edu',
      status: 'ACTIVE',
    },
  });

  // 2. Seed Users
  const users = [
    {
      email: 'admin@secureexam.demo',
      name: 'Harsh Wagh',
      role: 'SUPER_ADMIN',
      googleId: 'goog-super-admin',
      isGoogleVerified: true,
      collegeId: pict.id,
    },
    {
      email: 'exam.admin@secureexam.demo',
      name: 'Prof. Rajesh Kumar',
      role: 'EXAM_ADMIN',
      googleId: 'goog-exam-admin',
      isGoogleVerified: true,
      collegeId: pict.id,
    },
    {
      email: 'setter@secureexam.demo',
      name: 'Dr. Ananya Sharma',
      role: 'QUESTION_SETTER',
      googleId: 'goog-question-setter',
      isGoogleVerified: true,
      collegeId: coep.id,
    },
    {
      email: 'college@secureexam.demo',
      name: 'Principal V. S. Patil',
      role: 'COLLEGE_ADMIN',
      googleId: 'goog-college-admin',
      isGoogleVerified: true,
      collegeId: pict.id,
    },
    {
      email: 'invigilator@secureexam.demo',
      name: 'Prof. Suresh Mehta',
      role: 'INVIGILATOR',
      googleId: 'goog-invigilator',
      isGoogleVerified: true,
      collegeId: pict.id,
    },
    {
      email: 'auditor@secureexam.demo',
      name: 'Vikramaditya Rao',
      role: 'AUDITOR',
      googleId: 'goog-auditor',
      isGoogleVerified: true,
    },
    {
      email: 'pending@secureexam.demo',
      name: 'New Faculty Applicant',
      role: 'PENDING',
      googleId: 'goog-pending-user',
      isGoogleVerified: true,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role },
      create: u,
    });
  }

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
