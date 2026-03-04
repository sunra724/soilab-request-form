import type { EstimateResult } from "@/types/request-form";
import type { RequestFormSchema } from "@/lib/validations";
import { formatKRW } from "@/lib/estimate";

// ===== 레이블 매핑 =====
const LECTURE_TYPE_LABELS: Record<string, string> = {
  lecture: "강의 (일방향)",
  workshop: "워크숍 (참여형)",
  seminar: "세미나",
  consulting: "컨설팅",
  training: "교육훈련",
  other: "기타",
};

const AUDIENCE_LABELS: Record<string, string> = {
  elementary: "초등학생",
  middle: "중학생",
  high: "고등학생",
  university: "대학생",
  adult: "성인 일반",
  senior: "시니어",
  employee: "직장인",
  teacher: "교사/강사",
  mixed: "혼합",
  other: "기타",
};

const VENUE_TYPE_LABELS: Record<string, string> = {
  provided: "의뢰처 제공 장소",
  online: "온라인",
  soilab: "소이랩 공간",
  tbd: "미정",
};

// 세션 일정 텍스트 생성
function formatSessions(formData: RequestFormSchema): string {
  return formData.sessions
    .map(
      (s, i) =>
        `  ${formData.isMultiSession ? `${i + 1}회차: ` : ""}${s.date} ${s.startTime}~${s.endTime} (${Math.floor(s.durationMinutes / 60)}시간 ${s.durationMinutes % 60}분)`
    )
    .join("\n");
}

// ===== 의뢰자용 이메일 템플릿 =====
export function buildRequesterEmailHtml(
  formData: RequestFormSchema,
  estimate: EstimateResult
): string {
  // TODO: 실제 HTML 이메일 템플릿으로 구현 예정
  return `<p>의뢰서 수신 확인 이메일 (구현 예정)</p>`;
}

export function buildRequesterEmailText(
  formData: RequestFormSchema,
  estimate: EstimateResult
): string {
  return `
[소이랩 강의 의뢰서 접수 확인]

안녕하세요, ${formData.requester.name}님.
소이랩에 강의를 의뢰해 주셔서 감사합니다.
아래 내용으로 의뢰서가 접수되었습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 의뢰자 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
담당자: ${formData.requester.name}
기관명: ${formData.requester.organization}
연락처: ${formData.requester.phone}
이메일: ${formData.requester.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 강의 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
강의 유형: ${LECTURE_TYPE_LABELS[formData.lectureType] ?? formData.lectureType}
세부 주제: ${formData.topicDetail}
대상: ${AUDIENCE_LABELS[formData.audienceType] ?? formData.audienceType} ${formData.audienceCount}명
장소: ${VENUE_TYPE_LABELS[formData.venue.type] ?? formData.venue.type}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 일정
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatSessions(formData)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 예상 견적 (참고용)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
주강사료: ${formatKRW(estimate.mainFee)}
보조강사료: ${formatKRW(estimate.assistantFee)}
소계: ${formatKRW(estimate.subtotal)}
${estimate.taxOrDeductionLabel}: ${formatKRW(estimate.taxOrDeduction)}
최종 금액: ${formatKRW(estimate.total)}

* 최종 견적은 담당자 확인 후 별도 안내드립니다.
${estimate.breakdown.split("\n").map((n) => `* ${n}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
담당자가 3일 이내에 연락드리겠습니다.
문의: soilab@example.com

협동조합 소이랩 드림
  `.trim();
}

// ===== 소이랩 담당자용 알림 이메일 =====
export function buildAdminEmailText(
  formData: RequestFormSchema,
  estimate: EstimateResult
): string {
  return `
[새 강의 의뢰 접수 알림]

새로운 강의 의뢰가 접수되었습니다.

의뢰자: ${formData.requester.name} (${formData.requester.organization})
연락처: ${formData.requester.phone} / ${formData.requester.email}
강의 유형: ${LECTURE_TYPE_LABELS[formData.lectureType] ?? formData.lectureType}
주제: ${formData.topicDetail}
대상: ${AUDIENCE_LABELS[formData.audienceType] ?? formData.audienceType} ${formData.audienceCount}명
일정:
${formatSessions(formData)}
예상 견적: ${formatKRW(estimate.total)}

추가 요청사항:
${formData.additionalRequests ?? "없음"}
  `.trim();
}
