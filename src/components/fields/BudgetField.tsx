"use client";

import { useFormContext } from "react-hook-form";
import type { RequestFormSchema } from "@/lib/validations";

export default function BudgetField() {
  const { register, watch, formState: { errors } } = useFormContext<RequestFormSchema>();
  const hasEstimate = watch("budget.hasEstimate");

  // TODO: 스타일링 및 금액 포맷 마스킹 구현 예정
  return (
    <div>
      <div>
        <label>
          <input type="checkbox" {...register("budget.hasEstimate")} />
          예산이 정해져 있음
        </label>
      </div>

      {hasEstimate && (
        <div>
          <label>예산 금액 (원)</label>
          <input
            type="number"
            {...register("budget.amount", { valueAsNumber: true })}
            placeholder="예: 500000"
          />
          <label>
            <input type="checkbox" {...register("budget.includesTax")} />
            VAT 포함 금액
          </label>
        </div>
      )}

      <div>
        <label>지급 시기</label>
        <select {...register("budget.paymentTiming")}>
          <option value="">선택</option>
          <option value="before">강의 전</option>
          <option value="after">강의 후</option>
          <option value="split">분할 지급</option>
        </select>
      </div>

      <div>
        <label>예산 관련 메모</label>
        <textarea {...register("budget.notes")} placeholder="예산 관련 특이사항을 입력해주세요" />
      </div>
    </div>
  );
}
