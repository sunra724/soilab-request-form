"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { RequestFormSchema } from "@/lib/validations";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = [0, 15, 30, 45];
type Period = "AM" | "PM";

function toHHMM(period: Period, hour: number, minute: number): string {
  let h: number;
  if (period === "AM") {
    h = hour === 12 ? 0 : hour;
  } else {
    h = hour === 12 ? 12 : hour + 12;
  }
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function fromHHMM(time: string): { period: Period; hour: number; minute: number } {
  if (!time) return { period: "AM", hour: 9, minute: 0 };
  const [h, m] = time.split(":").map(Number);
  if (h === 0) return { period: "AM", hour: 12, minute: m };
  if (h < 12) return { period: "AM", hour: h, minute: m };
  if (h === 12) return { period: "PM", hour: 12, minute: m };
  return { period: "PM", hour: h - 12, minute: m };
}

const selectCls =
  "rounded-lg border px-2 py-2.5 text-sm text-gray-900 bg-white transition-colors duration-150 cursor-pointer focus:outline-none";

interface TimePickerProps {
  sessionIndex: number;
  field: "startTime" | "endTime";
  label: string;
  defaultPeriod?: Period;
  defaultHour?: number;
}

function TimePicker({
  sessionIndex,
  field,
  label,
  defaultPeriod = "AM",
  defaultHour = 9,
}: TimePickerProps) {
  const { setValue, watch } = useFormContext<RequestFormSchema>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawValue = (watch(`sessions.${sessionIndex}.${field}` as any) as string) ?? "";

  const initial = rawValue
    ? fromHHMM(rawValue)
    : { period: defaultPeriod, hour: defaultHour, minute: 0 };

  const [period, setPeriod] = useState<Period>(initial.period);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  useEffect(() => {
    if (!rawValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(`sessions.${sessionIndex}.${field}` as any, toHHMM(initial.period, initial.hour, 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (p: Period, h: number, m: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`sessions.${sessionIndex}.${field}` as any, toHHMM(p, h, m), {
      shouldValidate: true,
    });
  };

  return (
    <div>
      <label
        className="mb-1.5 block text-sm font-medium"
        style={{ color: "var(--gray-label)" }}
      >
        {label}
      </label>
      <div className="flex gap-1.5">
        <select
          value={period}
          onChange={(e) => {
            const p = e.target.value as Period;
            setPeriod(p);
            update(p, hour, minute);
          }}
          className={selectCls}
          style={{ borderColor: "var(--gray-border)" }}
        >
          <option value="AM">오전</option>
          <option value="PM">오후</option>
        </select>
        <select
          value={hour}
          onChange={(e) => {
            const h = Number(e.target.value);
            setHour(h);
            update(period, h, minute);
          }}
          className={selectCls}
          style={{ borderColor: "var(--gray-border)", minWidth: "4rem" }}
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}시
            </option>
          ))}
        </select>
        <select
          value={minute}
          onChange={(e) => {
            const m = Number(e.target.value);
            setMinute(m);
            update(period, hour, m);
          }}
          className={selectCls}
          style={{ borderColor: "var(--gray-border)", minWidth: "4rem" }}
        >
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, "0")}분
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface DateTimeFieldProps {
  sessionIndex?: number;
}

export default function DateTimeField({ sessionIndex = 0 }: DateTimeFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestFormSchema>();

  const prefix = `sessions.${sessionIndex}` as const;

  return (
    <div className="space-y-3">
      {/* 날짜 */}
      <div>
        <label
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--gray-label)" }}
        >
          날짜{" "}
          <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <input
          type="date"
          className="w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 bg-white transition-colors duration-150"
          style={{
            borderColor: errors.sessions?.[sessionIndex]?.date
              ? "var(--error)"
              : "var(--gray-border)",
          }}
          {...register(`${prefix}.date`)}
        />
        {errors.sessions?.[sessionIndex]?.date && (
          <p className="mt-1.5 text-xs" style={{ color: "var(--error)" }}>
            {errors.sessions[sessionIndex]?.date?.message}
          </p>
        )}
      </div>

      {/* 시작 / 종료 시간 */}
      <div className="grid grid-cols-2 gap-3">
        <TimePicker
          sessionIndex={sessionIndex}
          field="startTime"
          label="시작 시간"
          defaultPeriod="AM"
          defaultHour={9}
        />
        <TimePicker
          sessionIndex={sessionIndex}
          field="endTime"
          label="종료 시간"
          defaultPeriod="PM"
          defaultHour={1}
        />
      </div>
    </div>
  );
}
