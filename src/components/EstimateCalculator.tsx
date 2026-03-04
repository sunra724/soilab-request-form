"use client";

import { useEffect, useRef, useState } from "react";
import type { EstimateResult, RequestFormData } from "@/types/form";

// ===== 공통 상수 =====
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
const LECTURE_LABEL: Record<RequestFormData["lectureType"], string> = {
  special: "특강",
  workshop: "워크숍",
  facilitation: "퍼실리테이션",
  course: "양성과정",
};

// ===== 금액 변경 시 색상 flash 애니메이션 =====
function AnimatedAmount({ value, bold }: { value: number; bold?: boolean }) {
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setFlash(true);
      prevRef.current = value;
      const t = setTimeout(() => setFlash(false), 500);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={`tabular-nums transition-colors duration-400 ${bold ? "font-bold text-base" : "text-sm"}`}
      style={{ color: flash ? "var(--green-main)" : "inherit" }}
    >
      ₩{value.toLocaleString("ko-KR")}
    </span>
  );
}

// ===== 테이블 행 =====
function Row({
  label,
  formula,
  value,
  dim,
}: {
  label: string;
  formula?: string;
  value: number;
  dim?: boolean;
}) {
  return (
    <tr className={dim ? "opacity-40" : ""}>
      <td className="py-2 text-sm text-gray-700 align-top">{label}</td>
      <td className="py-2 text-xs text-gray-400 align-top px-2">{formula ?? ""}</td>
      <td className="py-2 text-right align-top">
        <AnimatedAmount value={value} />
      </td>
    </tr>
  );
}

// ===== Props =====
export interface EstimateCalculatorProps {
  estimate: EstimateResult | null;
  lectureType?: RequestFormData["lectureType"];
  durationHours?: number;
  assistantCount?: number;
  sessionCount?: number;
}

// ===== 컴포넌트 =====
export default function EstimateCalculator({
  estimate,
  lectureType,
  durationHours = 2,
  assistantCount = 0,
  sessionCount = 1,
}: EstimateCalculatorProps) {
  // 계산식 문자열 생성
  const mainFormula = (() => {
    if (!lectureType) return "—";
    const base = BASE_FEE[lectureType];
    const extra = durationHours > 2 ? durationHours - 2 : 0;
    const extraRate = EXTRA_HOURLY[lectureType];
    const label = LECTURE_LABEL[lectureType];
    if (sessionCount > 1) {
      return extra > 0
        ? `${label} (₩${(base + extra * extraRate).toLocaleString()}) × ${sessionCount}회차`
        : `${label} 기준 × ${sessionCount}회차`;
    }
    return extra > 0
      ? `${label} 2h + ${extra}h 추가`
      : `${label} 2h 기준`;
  })();

  const assistantFormula =
    assistantCount > 0
      ? `₩150,000 × ${assistantCount}인 × ${sessionCount}회차`
      : "0인";

  return (
    <div
      className="bg-white rounded-2xl border p-5 lg:sticky lg:top-6"
      style={{ borderColor: "var(--gray-border)" }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-gray-800">예상 견적</h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full border"
          style={{
            backgroundColor: "var(--green-bg)",
            color: "var(--green-main)",
            borderColor: "var(--green-light)",
          }}
        >
          참고용
        </span>
      </div>

      {/* 빈 상태 */}
      {!estimate ? (
        <div className="py-10 text-center">
          <div className="text-4xl mb-3 opacity-30">₩</div>
          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
            {"강의 유형과 시간을 입력하면\n예상 견적이 표시됩니다"}
          </p>
        </div>
      ) : (
        <>
          {/* 견적 테이블 */}
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--gray-border)" }}>
                <th className="text-left text-xs text-gray-400 font-medium pb-2 w-[32%]">항목</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2 px-2">계산식</th>
                <th className="text-right text-xs text-gray-400 font-medium pb-2">금액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <Row label="메인 강사료" formula={mainFormula} value={estimate.mainFee} />
              <Row
                label="보조강사료"
                formula={assistantFormula}
                value={estimate.assistantFee}
                dim={assistantCount === 0}
              />
            </tbody>

            {/* 소계 구분선 */}
            <tbody>
              <tr>
                <td colSpan={3} className="pt-3 pb-1">
                  <div className="border-t" style={{ borderColor: "var(--gray-border)" }} />
                </td>
              </tr>
              <tr>
                <td className="pb-2 text-sm font-medium text-gray-600" colSpan={2}>
                  소계
                </td>
                <td className="pb-2 text-right">
                  <AnimatedAmount value={estimate.subtotal} />
                </td>
              </tr>
              <tr>
                <td className="pb-3 text-xs text-gray-400" colSpan={2}>
                  {estimate.taxOrDeductionLabel}
                </td>
                <td className="pb-3 text-right text-xs text-gray-400">
                  <span className="tabular-nums">
                    {estimate.taxOrDeductionLabel.includes("원천징수") ? "−" : "+"}₩
                    {estimate.taxOrDeduction.toLocaleString("ko-KR")}
                  </span>
                </td>
              </tr>
            </tbody>

            {/* 총액 이중선 */}
            <tfoot>
              <tr>
                <td colSpan={3} className="pb-0">
                  <div
                    className="border-t-[3px] border-double"
                    style={{ borderColor: "var(--green-main)" }}
                  />
                </td>
              </tr>
              <tr>
                <td
                  className="pt-3 font-bold text-base"
                  style={{ color: "var(--green-main)" }}
                  colSpan={2}
                >
                  총 견적
                </td>
                <td className="pt-3 text-right" style={{ color: "var(--green-main)" }}>
                  <AnimatedAmount value={estimate.total} bold />
                </td>
              </tr>
              {/* 원천징수 실수령액 안내 */}
              {estimate.taxOrDeductionLabel.includes("원천징수") && (
                <tr>
                  <td colSpan={3} className="pt-1">
                    <p className="text-xs text-gray-400">* 원천징수 3.3% 공제 후 실수령액</p>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </>
      )}

      {/* 안내 소자 */}
      <p
        className="mt-4 pt-3 text-xs text-gray-400 leading-relaxed border-t"
        style={{ borderColor: "var(--gray-border)" }}
      >
        실제 견적은 담당자 협의 후 확정됩니다.
      </p>
    </div>
  );
}
