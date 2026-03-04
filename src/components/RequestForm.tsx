"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { requestFormSchema, type RequestFormSchema } from "@/lib/validations";
import { calculateEstimate } from "@/lib/estimate";
import type { EstimateResult } from "@/types/form";

import FormSection from "@/components/FormSection";
import EstimateCalculator from "@/components/EstimateCalculator";
import MultiSessionField from "@/components/fields/MultiSessionField";
import BudgetField from "@/components/fields/BudgetField";

const DEFAULT_VALUES: Partial<RequestFormSchema> = {
  lectureType: "workshop",
  audienceCount: 20,
  isMultiSession: false,
  sessions: [{ date: "", startTime: "", endTime: "", durationMinutes: 120 }],
  venue: { type: "provided" },
  budget: { hasEstimate: false, includesTax: true },
  privacyConsent: true,
};

export default function RequestForm() {
  const router = useRouter();
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<RequestFormSchema>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const { watch, handleSubmit, formState: { errors } } = methods;

  // 폼 값 변경 시 견적 자동 계산
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        const sessionCount = values.sessions?.length ?? 1;
        // TODO: RequestForm을 새 RequestFormData 타입으로 재구성 후 직접 연결
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = calculateEstimate(values as any, sessionCount);
        setEstimate(result);
      } catch {
        setEstimate(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: RequestFormSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: data, estimate }),
      });

      if (!response.ok) throw new Error("이메일 발송 실패");

      router.push("/complete");
    } catch (error) {
      console.error("제출 오류:", error);
      alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO: 전체 UI 스타일링 구현 예정
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* 섹션 1: 의뢰자 정보 */}
        <FormSection title="의뢰자 정보" step={1}>
          {/* TODO: 의뢰자 정보 필드 구현 예정 */}
          <p>의뢰자 정보 필드 (구현 예정)</p>
        </FormSection>

        {/* 섹션 2: 강의 정보 */}
        <FormSection title="강의 정보" step={2}>
          {/* TODO: 강의 유형, 주제 필드 구현 예정 */}
          <p>강의 정보 필드 (구현 예정)</p>
        </FormSection>

        {/* 섹션 3: 대상 및 규모 */}
        <FormSection title="교육 대상 및 규모" step={3}>
          {/* TODO: 대상/인원 필드 구현 예정 */}
          <p>대상 및 규모 필드 (구현 예정)</p>
        </FormSection>

        {/* 섹션 4: 일정 */}
        <FormSection title="강의 일정" step={4}>
          <MultiSessionField />
        </FormSection>

        {/* 섹션 5: 장소 */}
        <FormSection title="장소" step={5}>
          {/* TODO: 장소 필드 구현 예정 */}
          <p>장소 필드 (구현 예정)</p>
        </FormSection>

        {/* 섹션 6: 예산 */}
        <FormSection title="예산" step={6}>
          <BudgetField />
        </FormSection>

        {/* 섹션 7: 추가 요청사항 */}
        <FormSection title="추가 요청사항" step={7}>
          {/* TODO: 구현 예정 */}
          <p>추가 요청사항 필드 (구현 예정)</p>
        </FormSection>

        {/* 예상 견적 */}
        <EstimateCalculator estimate={estimate} />

        {/* 개인정보 동의 */}
        <div>
          {/* TODO: 개인정보 동의 구현 예정 */}
          <p>개인정보 동의 (구현 예정)</p>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "제출 중..." : "의뢰서 제출하기"}
        </button>
      </form>
    </FormProvider>
  );
}
