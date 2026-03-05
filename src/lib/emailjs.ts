import emailjs from "@emailjs/browser";
import type { RequestFormSchema } from "@/lib/validations";
import type { EstimateResult } from "@/types/form";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_REQUESTER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REQUESTER!;
const TEMPLATE_ADMIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "soilabcoop@gmail.com";

// ===== 견적 내용을 이메일용 문자열로 변환 =====
function formatEstimateText(estimate: EstimateResult): string {
  const fmt = (n: number) => n.toLocaleString("ko-KR");
  const lines = [`주강사료: ${fmt(estimate.mainFee)}원`];
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
function formatSessionsText(data: RequestFormSchema): string {
  const locationStr =
    data.locationType === "online"
      ? data.onlinePlatform || "온라인"
      : data.address || "-";
  return data.sessions
    .map(
      (s, i) =>
        `${data.isMultiSession ? `${i + 1}회차 ` : ""}${s.date} ${s.startTime}~${s.endTime} / ${locationStr}`
    )
    .join("\n");
}

// ===== 예산 텍스트 변환 =====
function formatBudgetText(data: RequestFormSchema): string {
  if (!data.budget.hasEstimate) return "미정";
  const fmt = (n: number) => n.toLocaleString("ko-KR");
  let text = data.budget.amount ? `${fmt(data.budget.amount)}원` : "-";
  text += data.budget.includesTax ? " (세금 포함)" : " (세금 별도)";
  if (data.budget.paymentTiming) {
    const timingMap = { before: "선금", after: "후금", split: "분할" } as const;
    text += ` / ${timingMap[data.budget.paymentTiming]}`;
  }
  if (data.budget.notes) text += ` / ${data.budget.notes}`;
  return text;
}

// ===== 이메일 파라미터 빌드 =====
function buildParams(
  data: RequestFormSchema,
  estimate: EstimateResult,
  receiptNumber: string,
  recipientEmail: string
) {
  return {
    접수번호: receiptNumber,
    이메일: recipientEmail,
    사무실전화: data.officePhone || "-",
    휴대폰: data.mobilePhone,
    전체프로그램명: data.programName || "-",
    교육명: data.workshopName,
    교육목표: data.goal,
    장소유형: data.locationType === "online" ? "온라인" : "오프라인",
    online_platform:
      data.locationType === "online" ? data.onlinePlatform || "-" : "-",
    교육일시: formatSessionsText(data),
    참가인원: String(data.participantCount),
    메인강사수: String(data.mainInstructorCount),
    보조강사수: String(data.assistantInstructorCount),
    예산: formatBudgetText(data),
    추가요청사항: data.additionalRequests || "-",
    견적내용: formatEstimateText(estimate),
  };
}

// ===== 이메일 발송 메인 함수 =====
export async function sendFormEmails(
  data: RequestFormSchema,
  estimate: EstimateResult,
  receiptNumber: string
): Promise<void> {
  const requesterParams = buildParams(data, estimate, receiptNumber, data.email);
  const adminParams = buildParams(data, estimate, receiptNumber, ADMIN_EMAIL);

  await emailjs.send(SERVICE_ID, TEMPLATE_REQUESTER, requesterParams, {
    publicKey: PUBLIC_KEY,
  });

  await emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, adminParams, {
    publicKey: PUBLIC_KEY,
  });
}
