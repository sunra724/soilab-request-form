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
    append({
      date: "",
      startTime: "",
      endTime: "",
      durationMinutes: 120,
    });
  };

  // TODO: 스타일링 구현 예정
  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          {isMultiSession && <span>{index + 1}회차</span>}
          <DateTimeField sessionIndex={index} />
          {isMultiSession && fields.length > 1 && (
            <button type="button" onClick={() => remove(index)}>
              삭제
            </button>
          )}
        </div>
      ))}
      {isMultiSession && (
        <button type="button" onClick={addSession}>
          + 회차 추가
        </button>
      )}
    </div>
  );
}
