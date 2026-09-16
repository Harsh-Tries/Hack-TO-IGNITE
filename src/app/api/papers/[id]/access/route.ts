import { NextRequest, NextResponse } from 'next/server';
import { canAccessPaper } from '@/lib/time-lock';
import { DEMO_USERS } from '@/lib/demo-data';

// Demo lookup map for offline standalone testing
const DEMO_PAPERS_DB: Record<string, any> = {
  p1: {
    paperId: 'p1',
    paperCode: 'QP-DSA-2026-001',
    examId: 'e1',
    examCode: 'UE-CSE-2026-001',
    sha256Hash: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e',
    scheduledReleaseAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago (RELEASED)
    paperStatus: 'BLOCKCHAIN_REGISTERED',
    assignedCollegeIds: ['c1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002'],
  },
  p2: {
    paperId: 'p2',
    paperCode: 'QP-DBMS-2026-001',
    examId: 'e2',
    examCode: 'UE-CSE-2026-002',
    sha256Hash: 'b4f9e0d3f8c25a617e03d9b2f41c6a8e0d3f8c25a617e03d9b2f41c6a8e0d3f',
    scheduledReleaseAt: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // In 2 hours (LOCKED)
    paperStatus: 'ENCRYPTED',
    assignedCollegeIds: ['c1000000-0000-0000-0000-000000000001'],
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.userEmail || 'admin@secureexam.demo';
    const user = DEMO_USERS[email] || DEMO_USERS['admin@secureexam.demo'];
    const paper = DEMO_PAPERS_DB[params.id] || DEMO_PAPERS_DB['p1'];

    const decision = await canAccessPaper({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      userStatus: user.status || 'ACTIVE',
      userCollegeId: user.college_id,
      paperId: paper.paperId,
      paperCode: paper.paperCode,
      examId: paper.examId,
      paperStatus: paper.paperStatus,
      sha256Hash: paper.sha256Hash,
      scheduledReleaseAt: paper.scheduledReleaseAt,
      assignedCollegeIds: paper.assignedCollegeIds,
    });

    if (!decision.allowed) {
      return NextResponse.json({
        success: false,
        code: decision.code,
        error: decision.reason,
        serverTime: decision.serverTime,
        scheduledReleaseAt: decision.scheduledReleaseAt,
        secondsRemaining: decision.secondsRemaining,
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      code: 'ALLOWED',
      message: 'Access granted. Paper decrypted and pre-signed authorization token generated.',
      paperCode: paper.paperCode,
      sha256Hash: paper.sha256Hash,
      downloadUrl: `/api/papers/${params.id}/download?token=${Date.now()}`,
      serverTime: decision.serverTime,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Access check error' }, { status: 500 });
  }
}
