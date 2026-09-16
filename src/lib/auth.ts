import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from '@/types';

export const DEMO_USERS: Record<string, { id: string; name: string; email: string; role: UserRole; avatarUrl: string; collegeName?: string }> = {
  'admin@secureexam.demo': {
    id: 'user-super-admin-01',
    name: 'Harsh Wagh',
    email: 'admin@secureexam.demo',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    collegeName: 'Central Examination Authority',
  },
  'exam.admin@secureexam.demo': {
    id: 'user-exam-admin-01',
    name: 'Prof. Rajesh Kumar',
    email: 'exam.admin@secureexam.demo',
    role: 'EXAM_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    collegeName: 'University Exam Controller Board',
  },
  'setter@secureexam.demo': {
    id: 'user-setter-01',
    name: 'Dr. Ananya Sharma',
    email: 'setter@secureexam.demo',
    role: 'QUESTION_SETTER',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    collegeName: 'Department of Computer Science',
  },
  'college@secureexam.demo': {
    id: 'user-college-admin-01',
    name: 'Principal V. S. Patil',
    email: 'college@secureexam.demo',
    role: 'COLLEGE_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    collegeName: 'Pune Institute of Computer Technology (PICT)',
  },
  'invigilator@secureexam.demo': {
    id: 'user-invigilator-01',
    name: 'Prof. Suresh Mehta',
    email: 'invigilator@secureexam.demo',
    role: 'INVIGILATOR',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    collegeName: 'PICT Exam Center 04',
  },
  'auditor@secureexam.demo': {
    id: 'user-auditor-01',
    name: 'Vikramaditya Rao',
    email: 'auditor@secureexam.demo',
    role: 'AUDITOR',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    collegeName: 'Independent Security Audit Directorate',
  },
  'pending@secureexam.demo': {
    id: 'user-pending-01',
    name: 'New Faculty User',
    email: 'pending@secureexam.demo',
    role: 'PENDING',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      id: 'demo-credentials',
      name: 'Demo Login Bridge',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const demoUser = DEMO_USERS[credentials.email];
        if (demoUser) {
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            image: demoUser.avatarUrl,
            role: demoUser.role,
            isGoogleVerified: true,
            collegeName: demoUser.collegeName,
          };
        }
        // Fallback for new Google OAuth sign-in simulation
        return {
          id: 'user-' + Date.now(),
          name: credentials.email.split('@')[0],
          email: credentials.email,
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
          role: 'PENDING',
          isGoogleVerified: true,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'PENDING';
        token.isGoogleVerified = (user as any).isGoogleVerified ?? true;
        token.collegeName = (user as any).collegeName;
      }
      if (trigger === 'update' && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || 'PENDING';
        (session.user as any).isGoogleVerified = token.isGoogleVerified ?? true;
        (session.user as any).collegeName = token.collegeName;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'secure-exam-super-secret-key-change-in-prod-2026',
};
