import type { RequestFormData, EstimateResult } from "@/types/form";

// ===== 요율 테이블 =====
const BASE_FEE: Record<RequestFormData["lectureType"], number> = {
  special: 300_000,
  workshop: 400_000,
  facilitation: 500_000,
  course: 350_000,
};

const EXTRA_HOURLY: Record<RequestFormData["lectureType"], number> = {
  special: 80_000,
  workshop: 100_000,
  facilitation: 120_000,
  course: 90_000,
};

const LECTURE_TYPE_LABEL: Record<RequestFormData["lectureType"], string> = {
  special: "특강",
  workshop: "워크숍",
  facilitation: "퍼실리테이션",
  course: "양성과정",
};

const ASSISTANT_FEE_PER_SESSION = 150_000;

// ===== 견적 계산 =====
export function calculateEstimate(
  data: Partial<RequestFormData>,
  sessionCount: number
): EstimateResult {
  const lectureType = data.lectureType ?? "workshop";
  const durationHours = data.durationHours ?? 2;
  const assistantCount = data.assistantInstructorCount ?? 0;
  const executionType = data.executionType ?? "individual";

  // 회차당 주강사료
  const basePerSession =
    BASE_FEE[lectureType] +
    (durationHours > 2 ? (durationHours - 2) * EXTRA_HOURLY[lectureType] : 0);

  // 회차당 보조강사료
  const assistantPerSession = assistantCount * ASSISTANT_FEE_PER_SESSION;

  // 전체 회차 합산
  const mainFee = basePerSession * sessionCount;
  const assistantFee = assistantPerSession * sessionCount;
  const subtotal = mainFee + assistantFee;

  // 집행방식별 세금/공제
  let taxOrDeduction: number;
  let taxOrDeductionLabel: string;
  let total: number;

  if (executionType === "individual") {
    // 개인수당: 원천징수 3.3% 차감
    taxOrDeduction = Math.round(subtotal * 0.033);
    taxOrDeductionLabel = "원천징수 (3.3%)";
    total = subtotal - taxOrDeduction;
  } else {
    // 세금계산서: 부가세 10% 추가
    taxOrDeduction = Math.round(subtotal * 0.1);
    taxOrDeductionLabel = "부가세 (10%)";
    total = subtotal + taxOrDeduction;
  }

  const breakdown = buildBreakdown({
    lectureType,
    durationHours,
    basePerSession,
    assistantCount,
    assistantPerSession,
    sessionCount,
    mainFee,
    assistantFee,
    subtotal,
    taxOrDeduction,
    taxOrDeductionLabel,
    total,
    executionType,
  });

  return { mainFee, assistantFee, subtotal, taxOrDeduction, taxOrDeductionLabel, total, breakdown };
}

// ===== 계산 근거 문자열 =====
function buildBreakdown(p: {
  lectureType: RequestFormData["lectureType"];
  durationHours: number;
  basePerSession: number;
  assistantCount: number;
  assistantPerSession: number;
  sessionCount: number;
  mainFee: number;
  assistantFee: number;
  subtotal: number;
  taxOrDeduction: number;
  taxOrDeductionLabel: string;
  total: number;
  executionType: RequestFormData["executionType"];
}): string {
  const fmt = (n: number) => n.toLocaleString("ko-KR");
  const lines: string[] = [
    `[강의 유형] ${LECTURE_TYPE_LABEL[p.lectureType]}`,
    `[진행 시간] ${p.durationHours}시간`,
    ``,
    `주강사료 (${fmt(p.basePerSession)}원 × ${p.sessionCount}회차) = ${fmt(p.mainFee)}원`,
  ];

  if (p.assistantCount > 0) {
    lines.push(
      `보조강사료 (${fmt(ASSISTANT_FEE_PER_SESSION)}원 × ${p.assistantCount}인 × ${p.sessionCount}회차) = ${fmt(p.assistantFee)}원`
    );
  }

  lines.push(`소계: ${fmt(p.subtotal)}원`);

  if (p.executionType === "individual") {
    lines.push(`${p.taxOrDeductionLabel} 차감: -${fmt(p.taxOrDeduction)}원`);
    lines.push(`실수령액: ${fmt(p.total)}원`);
  } else {
    lines.push(`${p.taxOrDeductionLabel} 추가: +${fmt(p.taxOrDeduction)}원`);
    lines.push(`청구금액 (VAT 포함): ${fmt(p.total)}원`);
  }

  return lines.join("\n");
}

// ===== 금액 포맷 헬퍼 =====
export function formatKRW(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}
