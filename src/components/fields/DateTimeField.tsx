"use client";

import { useFormContext } from "react-hook-form";
import type { RequestFormSchema } from "@/lib/validations";

interface DateTimeFieldProps {
  sessionIndex?: number; // 다회차일 때 인덱스
}

export default function DateTimeField({ sessionIndex = 0 }: DateTimeFieldProps) {
  const { register, formState: { errors } } = useFormContext<RequestFormSchema>();

  const prefix = `sessions.${sessionIndex}` as const;

  // TODO: 스타일링 및 날짜 피커 구현 예정
  return (
    <div>
      <div>
        <label>날짜</label>
        <input type="date" {...register(`${prefix}.date`)} />
        {errors.sessions?.[sessionIndex]?.date && (
          <span>{errors.sessions[sessionIndex]?.date?.message}</span>
        )}
      </div>
      <div>
        <label>시작 시간</label>
        <input type="time" {...register(`${prefix}.startTime`)} />
      </div>
      <div>
        <label>종료 시간</label>
        <input type="time" {...register(`${prefix}.endTime`)} />
      </div>
    </div>
  );
}
