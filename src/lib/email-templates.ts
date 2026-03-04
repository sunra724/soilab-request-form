import type { EstimateResult } from "@/types/request-form";
import type { RequestFormSchema } from "@/lib/validations";
import { formatKRW } from "@/lib/estimate";

// 세션 일정 텍스트 생성
function formatSessions(formData: RequestFormSchema): string {
  return formData.sessions
    .map(
      (s, i) =>
        `  ${formData.isMultiSession ? `${i + 1}회차: ` : ""}${s.date} ${s.startTime}~${s.endTime} (${Math.floor(s.durationMinutes / 60)}시간 ${s.durationMinutes % 60}분)`
    )
    .join("\n");
}

// 장소 텍스트 생성
function formatVenue(formData: RequestFormSchema): string {
  if (formData.locationType === "online") {
    return `비대면 (${formData.onlinePlatform || "플랫폼 미입력"})`;
  }
  return `대면 (${formData.address || "주소 미입력"})`;
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

소이랩에 강의를 의뢰해 주셔서 감사합니다.
아래 내용으로 의뢰서가 접수되었습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 의뢰자 연락처
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
사무실 전화: ${formData.officePhone || "-"}
휴대폰: ${formData.mobilePhone}
이메일: ${formData.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 강의 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
교육/워크숍명: ${formData.workshopName}
교육 목표: ${formData.goal}
전체 프로그램명: ${formData.programName || "-"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 교육 대상 및 규모
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
참가 인원: ${formData.participantCount}명
메인 강사: ${formData.mainInstructorCount}명
보조강사: ${formData.assistantInstructorCount}명

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 일정
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatSessions(formData)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 장소
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatVenue(formData)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 예상 견적 (참고용)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
주강사료: ${formatKRW(estimate.mainFee)}
보조강사료: ${formatKRW(estimate.assistantFee)}
소계: ${formatKRW(estimate.subtotal)}
${estimate.taxOrDeductionLabel}: ${formatKRW(estimate.taxOrDeduction)}
최종 금액: ${formatKRW(estimate.total)}

* 최종 견적은 담당자 확인 후 별도 안내드립니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
담당자가 2영업일 내에 연락드리겠습니다.
문의: soilabcoop@gmail.com

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

연락처: ${formData.mobilePhone} / ${formData.email}${formData.officePhone ? ` / 사무실 ${formData.officePhone}` : ""}
교육/워크숍명: ${formData.workshopName}
교육 목표: ${formData.goal}
전체 프로그램명: ${formData.programName || "-"}
참가 인원: ${formData.participantCount}명 (메인 ${formData.mainInstructorCount}명 / 보조 ${formData.assistantInstructorCount}명)
장소: ${formatVenue(formData)}
일정:
${formatSessions(formData)}
예상 견적: ${formatKRW(estimate.total)}

추가 요청사항:
${formData.additionalRequests || "없음"}
  `.trim();
}
