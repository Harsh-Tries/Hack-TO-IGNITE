import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS } from '@/lib/demo-data';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.userEmail || 'admin@secureexam.demo';
    const reason = body.reason || 'Security policy violation emergency revocation.';
    const user = DEMO_USERS[email] || DEMO_USERS['admin@secureexam.demo'];

    if (user.role !== 'SUPER_ADMIN' && user.role !== 'EXAM_ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Only SUPER_ADMIN or EXAM_ADMIN can revoke papers.',
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      paperId: params.id,
      status: 'REVOKED',
      revokedBy: user.full_name,
      revokedAt: new Date().toISOString(),
      reason,
      auditLogId: 'al-revoked-' + Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Revocation failed' }, { status: 500 });
  }
}
