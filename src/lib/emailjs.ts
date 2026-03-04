import emailjs from "@emailjs/browser";
import type { RequestFormData, EstimateResult } from "@/types/form";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_REQUESTER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REQUESTER!;
const TEMPLATE_ADMIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "soilabcoop@gmail.com";

// ===== 견적 내용을 이메일용 문자열로 변환 =====
function formatEstimateText(estimate: EstimateResult): string {
  const fmt = (n: number) => n.toLocaleString("ko-KR");
  const lines = [
    `주강사료: ${fmt(estimate.mainFee)}원`,
  ];
  if (estimate.assistantFee > 0) {
    lines.push(`보조강사료: ${fmt(estimate.assistantFee)}원`);
  }
  lines.push(
    `소계: ${fmt(estimate.subtotal)}원`,
    `${estimate.taxOrDeductionLabel}: ${fmt(estimate.taxOrDeduction)}원`,
    `최종금액: ${fmt(estimate.total)}원`,
    ``,
    `[계산 근거]`,
    estimate.breakdown
  );
  return lines.join("\n");
}

// ===== 세션 일정 텍스트 변환 =====
function formatSessionsText(data: RequestFormData): string {
  return data.sessions
    .map(
      (s, i) =>
        `${data.isMultiSession ? `${i + 1}회차 ` : ""}${s.date} ${s.startTime}~${s.endTime} / ${s.location}`
    )
    .join("\n");
}

// ===== 의뢰자용 이메일 파라미터 =====
function buildRequesterParams(
  data: RequestFormData,
  estimate: EstimateResult,
  receiptNumber: string
) {
  return {
    receipt_number: receiptNumber,
    to_email: data.contactEmail,
    contact_office: data.contactOffice || "-",
    contact_mobile: data.contactMobile,
    contact_email: data.contactEmail,
    program_name: data.programName || "-",
    workshop_name: data.workshopName,
    goal: data.goal || "-",
    location_type: data.locationType === "online" ? "온라인" : "오프라인",
    online_platform: data.locationType === "online" ? data.onlineplatform : "-",
    sessions: formatSessionsText(data),
    participant_count: String(data.participantCount),
    main_instructor_count: String(data.mainInstructorCount),
    assistant_instructor_count: String(data.assistantInstructorCount),
    execution_type:
      data.executionType === "individual" ? "개인수당 지급" : "세금계산서",
    budget: data.budget || "-",
    견적내용: formatEstimateText(estimate),
  };
}

// ===== 관리자용 이메일 파라미터 =====
function buildAdminParams(
  data: RequestFormData,
  estimate: EstimateResult,
  receiptNumber: string
) {
  return {
    ...buildRequesterParams(data, estimate, receiptNumber),
    to_email: ADMIN_EMAIL,
  };
}

// ===== 이메일 발송 메인 함수 =====
export async function sendFormEmails(
  data: RequestFormData,
  estimate: EstimateResult,
  receiptNumber: string
): Promise<void> {
  const requesterParams = buildRequesterParams(data, estimate, receiptNumber);
  const adminParams = buildAdminParams(data, estimate, receiptNumber);

  // 의뢰자에게 사본 발송
  await emailjs.send(SERVICE_ID, TEMPLATE_REQUESTER, requesterParams, {
    publicKey: PUBLIC_KEY,
  });

  // 관리자(소이랩)에게 알림 발송
  await emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, adminParams, {
    publicKey: PUBLIC_KEY,
  });
}
