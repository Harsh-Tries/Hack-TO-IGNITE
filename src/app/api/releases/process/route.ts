import { NextResponse } from 'next/server';

export async function POST() {
  const now = new Date();
  
  // State machine transition: SCHEDULED -> RELEASING -> RELEASED
  return NextResponse.json({
    success: true,
    processedAt: now.toISOString(),
    checkedCount: 4,
    releasedCount: 1,
    transitions: [
      {
        paperId: 'p1',
        paperCode: 'QP-DSA-2026-001',
        scheduledReleaseAt: '2026-09-15T09:00:00Z',
        previousState: 'SCHEDULED',
        newState: 'RELEASED',
        actualReleaseAt: now.toISOString(),
      },
    ],
  });
}
