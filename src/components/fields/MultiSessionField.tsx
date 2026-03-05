"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { RequestFormSchema } from "@/lib/validations";
import DateTimeField from "./DateTimeField";

export default function MultiSessionField() {
  const { control, watch } = useFormContext<RequestFormSchema>();
  const isMultiSession = watch("isMultiSession");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sessions",
  });

  const addSession = () => {
    append({ date: "", startTime: "", endTime: "", durationMinutes: 120 });
  };

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-lg border p-4"
          style={{ borderColor: "var(--gray-border)" }}
        >
          {isMultiSession && (
            <div className="mb-3 flex items-center justify-between">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--green-main)" }}
              >
                {index + 1}회차
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded-md px-2 py-1 text-xs transition-colors hover:bg-red-50"
                  style={{ color: "var(--error)" }}
                >
                  삭제
                </button>
              )}
            </div>
          )}
          <DateTimeField sessionIndex={index} />
        </div>
      ))}

      {isMultiSession && (
        <button
          type="button"
          onClick={addSession}
          className="w-full rounded-lg border-2 border-dashed py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: "var(--gray-border)", color: "var(--gray-label)" }}
        >
          + 회차 추가
        </button>
      )}
    </div>
  );
}
