"use client";

import { useFormContext } from "react-hook-form";
import type { RequestFormSchema } from "@/lib/validations";

const EXECUTION_OPTIONS = [
  { value: "individual", label: "개인수당 지급", desc: "원천징수 3.3% 차감" },
  { value: "contract", label: "세금계산서", desc: "부가세 10% 별도" },
] as const;

const PAYMENT_OPTIONS = [
  { value: "before", label: "강의 전", desc: "사전 지급" },
  { value: "after", label: "강의 후", desc: "완료 후 지급" },
  { value: "split", label: "분할 지급", desc: "전·후 나누어 지급" },
] as const;

const inputCls =
  "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-400 transition-colors duration-150";

export default function BudgetField() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RequestFormSchema>();

  const hasEstimate = watch("budget.hasEstimate");
  const paymentTiming = watch("budget.paymentTiming");
  const executionType = watch("executionType");

  return (
    <div className="space-y-4">
      {/* 집행 방식 */}
      <div
        className="rounded-xl border-2 p-4"
        style={{ borderColor: "var(--green-main)", backgroundColor: "var(--green-bg)" }}
      >
        <p className="mb-3 text-sm font-semibold" style={{ color: "var(--green-main)" }}>
          집행 방식 <span style={{ color: "var(--error)" }}>*</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {EXECUTION_OPTIONS.map(({ value, label, desc }) => {
            const isSelected = executionType === value;
            return (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  className="sr-only"
                  {...register("executionType")}
                />
                <div
                  className="rounded-lg border-2 p-3 text-center transition-all duration-150"
                  style={{
                    borderColor: isSelected ? "var(--green-main)" : "var(--gray-border)",
                    backgroundColor: isSelected ? "white" : "transparent",
                  }}
                >
                  <div
                    className="text-sm font-semibold"
                    style={{ color: isSelected ? "var(--green-main)" : "var(--gray-label)" }}
                  >
                    {label}
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--gray-label)" }}>
                    {desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 예산 확정 여부 */}
      <label className="inline-flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          className="h-4 w-4 rounded"
          style={{ accentColor: "var(--green-main)" }}
          {...register("budget.hasEstimate")}
        />
        <span className="text-sm font-medium" style={{ color: "var(--gray-label)" }}>
          예산이 정해져 있음
        </span>
      </label>

      {/* 예산 금액 (hasEstimate일 때만) */}
      {hasEstimate && (
        <div className="space-y-3 rounded-lg border p-3" style={{ borderColor: "var(--gray-border)" }}>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--gray-label)" }}>
              예산 금액
            </label>
            <div className="relative">
              <input
                type="number"
                className={inputCls}
                style={{
                  borderColor: errors.budget?.amount ? "var(--error)" : "var(--gray-border)",
                  paddingRight: "2.5rem",
                }}
                placeholder="예: 500000"
                {...register("budget.amount", { valueAsNumber: true })}
              />
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: "var(--gray-label)" }}
              >
                원
              </span>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              style={{ accentColor: "var(--green-main)" }}
              {...register("budget.includesTax")}
            />
            <span className="text-sm" style={{ color: "var(--gray-label)" }}>
              VAT 포함 금액
            </span>
          </label>
        </div>
      )}

      {/* 지급 시기 - 강조 표시 */}
      <div
        className="rounded-xl border-2 p-4"
        style={{ borderColor: "var(--green-main)", backgroundColor: "var(--green-bg)" }}
      >
        <p className="mb-3 text-sm font-semibold" style={{ color: "var(--green-main)" }}>
          지급 시기
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_OPTIONS.map(({ value, label, desc }) => {
            const isSelected = paymentTiming === value;
            return (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  className="sr-only"
                  {...register("budget.paymentTiming")}
                />
                <div
                  className="rounded-lg border-2 p-3 text-center transition-all duration-150"
                  style={{
                    borderColor: isSelected ? "var(--green-main)" : "var(--gray-border)",
                    backgroundColor: isSelected ? "white" : "transparent",
                  }}
                >
                  <div
                    className="text-sm font-semibold"
                    style={{ color: isSelected ? "var(--green-main)" : "var(--gray-label)" }}
                  >
                    {label}
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--gray-label)" }}>
                    {desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 예산 관련 메모 */}
      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--gray-label)" }}>
          예산 관련 메모
        </label>
        <textarea
          rows={2}
          className={inputCls}
          style={{ borderColor: "var(--gray-border)", resize: "vertical" }}
          placeholder="예산 관련 특이사항을 입력해주세요"
          {...register("budget.notes")}
        />
      </div>
    </div>
  );
}
