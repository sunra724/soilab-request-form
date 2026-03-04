import { NextRequest, NextResponse } from "next/server";
import type { SendEmailRequest, SendEmailResponse } from "@/types/request-form";
import {
  buildRequesterEmailText,
  buildAdminEmailText,
} from "@/lib/email-templates";

// 소이랩 담당자 이메일 (환경변수로 관리)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "soilab@example.com";

export async function POST(request: NextRequest): Promise<NextResponse<SendEmailResponse>> {
  try {
    const body: SendEmailRequest = await request.json();
    const { formData, estimate } = body;

    // TODO: 실제 이메일 발송 서비스 연동 예정 (EmailJS / Resend / Nodemailer 등)
    const requesterEmailText = buildRequesterEmailText(formData, estimate);
    const adminEmailText = buildAdminEmailText(formData, estimate);

    console.log("=== 의뢰자 이메일 (발송 예정) ===");
    console.log("수신:", formData.requester.email);
    console.log(requesterEmailText);

    console.log("=== 담당자 알림 이메일 (발송 예정) ===");
    console.log("수신:", ADMIN_EMAIL);
    console.log(adminEmailText);

    // TODO: 이메일 발송 로직 구현
    // await sendEmail({ to: formData.requester.email, ... });
    // await sendEmail({ to: ADMIN_EMAIL, ... });

    return NextResponse.json({ success: true, message: "의뢰서가 성공적으로 접수되었습니다." });
  } catch (error) {
    console.error("이메일 발송 오류:", error);
    return NextResponse.json(
      { success: false, message: "처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
