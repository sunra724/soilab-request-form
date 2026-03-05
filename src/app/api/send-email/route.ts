import { NextResponse } from "next/server";

// 이메일 발송은 클라이언트에서 EmailJS로 직접 처리됩니다.
export async function POST() {
  return NextResponse.json({ success: true });
}
