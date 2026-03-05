"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { requestFormSchema, type RequestFormSchema } from "@/lib/validations";
import { calculateEstimate } from "@/lib/estimate";
import { sendFormEmails } from "@/lib/emailjs";
import type { EstimateResult } from "@/types/form";

import FormSection from "@/components/FormSection";
import EstimateCalculator from "@/components/EstimateCalculator";
import MultiSessionField from "@/components/fields/MultiSessionField";
import BudgetField from "@/components/fields/BudgetField";

// ===== 공통 스타일 =====
const inputCls =
  "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-400 transition-colors duration-150";

// ===== 헬퍼: 필드 레이블 =====
function Label({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium"
      style={{ color: "var(--gray-label)" }}
    >
      {children}
      {required && (
        <span className="ml-0.5" style={{ color: "var(--error)" }}>
          *
        </span>
      )}
    </label>
  );
}

// ===== 헬퍼: 에러 메시지 =====
function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--error)" }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
        <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeLinecap="round" />
      </svg>
      {msg}
    </p>
  );
}

// ===== 헬퍼: number 인풋 + "명" 접미사 =====
function CountInput({
  id,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        className={inputCls}
        style={{ borderColor: error ? "var(--error)" : "var(--gray-border)", paddingRight: "2.5rem" }}
        {...props}
      />
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: "var(--gray-label)" }}
      >
        명
      </span>
    </div>
  );
}

// ===== 기본값 =====
const DEFAULT_VALUES: Partial<RequestFormSchema> = {
  contactName: "",
  officePhone: "",
  mobilePhone: "",
  email: "",
  workshopName: "",
  goal: "",
  programName: "",
  participantCount: 20,
  mainInstructorCount: 1,
  assistantInstructorCount: 0,
  isMultiSession: false,
  sessions: [{ date: "", startTime: "", endTime: "", durationMinutes: 120 }],
  locationType: "onsite",
  address: "",
  onlinePlatform: "",
  budget: { hasEstimate: false, includesTax: true },
  additionalRequests: "",
  privacyConsent: false,
};

// ===== 메인 컴포넌트 =====
export default function RequestForm() {
  const router = useRouter();
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<RequestFormSchema>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const locationType = watch("locationType");

  // 폼 값 변경 시 견적 자동 계산
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        const sessionCount = values.sessions?.length ?? 1;
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
    if (!estimate) {
      alert("견적 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      const receiptNumber = `SL-${Date.now().toString(36).toUpperCase()}`;
      await sendFormEmails(data, estimate, receiptNumber);
      router.push(`/complete?receipt=${receiptNumber}`);
    } catch (error) {
      console.error("제출 오류:", error);
      alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        {/* ===== 섹션 1: 의뢰자 정보 ===== */}
        <FormSection title="의뢰자 정보" step={1}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* 담당자명 (필수) */}
            <div className="sm:col-span-2">
              <Label htmlFor="contactName" required>담당자명</Label>
              <input
                id="contactName"
                type="text"
                className={inputCls}
                style={{ borderColor: errors.contactName ? "var(--error)" : "var(--gray-border)" }}
                placeholder="홍길동"
                {...register("contactName")}
              />
              <Err msg={errors.contactName?.message} />
            </div>

            {/* 사무실 전화 (선택) */}
            <div>
              <Label htmlFor="officePhone">사무실 전화</Label>
              <input
                id="officePhone"
                type="tel"
                className={inputCls}
                style={{ borderColor: "var(--gray-border)" }}
                placeholder="053-000-0000"
                {...register("officePhone")}
              />
            </div>

            {/* 휴대폰 (필수) */}
            <div>
              <Label htmlFor="mobilePhone" required>휴대폰</Label>
              <input
                id="mobilePhone"
                type="tel"
                className={inputCls}
                style={{ borderColor: errors.mobilePhone ? "var(--error)" : "var(--gray-border)" }}
                placeholder="010-0000-0000"
                {...register("mobilePhone")}
              />
              <Err msg={errors.mobilePhone?.message} />
            </div>

            {/* 이메일 (필수) */}
            <div className="sm:col-span-2">
              <Label htmlFor="email" required>이메일</Label>
              <input
                id="email"
                type="email"
                className={inputCls}
                style={{ borderColor: errors.email ? "var(--error)" : "var(--gray-border)" }}
                placeholder="example@email.com"
                {...register("email")}
              />
              <Err msg={errors.email?.message} />
            </div>

          </div>
        </FormSection>

        {/* ===== 섹션 2: 강의 정보 ===== */}
        <FormSection title="강의 정보" step={2}>
          <div className="space-y-4">

            {/* 요청 교육/워크숍명 (필수) */}
            <div>
              <Label htmlFor="workshopName" required>요청 교육/워크숍명</Label>
              <input
                id="workshopName"
                type="text"
                className={inputCls}
                style={{ borderColor: errors.workshopName ? "var(--error)" : "var(--gray-border)" }}
                placeholder="예: 협동조합 기초 이해 워크숍"
                {...register("workshopName")}
              />
              <Err msg={errors.workshopName?.message} />
            </div>

            {/* 교육 목표 (필수) */}
            <div>
              <Label htmlFor="goal" required>교육 목표</Label>
              <textarea
                id="goal"
                rows={3}
                className={inputCls}
                style={{
                  borderColor: errors.goal ? "var(--error)" : "var(--gray-border)",
                  resize: "vertical",
                }}
                placeholder="이번 교육을 통해 기대하는 목표나 변화를 입력해주세요"
                {...register("goal")}
              />
              <Err msg={errors.goal?.message} />
            </div>

            {/* 전체 프로그램명 (선택) */}
            <div>
              <Label htmlFor="programName">전체 프로그램명</Label>
              <input
                id="programName"
                type="text"
                className={inputCls}
                style={{ borderColor: "var(--gray-border)" }}
                placeholder="다회차 프로그램일 경우 입력"
                {...register("programName")}
              />
            </div>

          </div>
        </FormSection>

        {/* ===== 섹션 3: 교육 대상 및 규모 ===== */}
        <FormSection title="교육 대상 및 규모" step={3}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* 교육 참가 인원 (필수) */}
            <div>
              <Label htmlFor="participantCount" required>교육 참가 인원</Label>
              <CountInput
                id="participantCount"
                min={1}
                error={!!errors.participantCount}
                {...register("participantCount", { valueAsNumber: true })}
              />
              <Err msg={errors.participantCount?.message} />
            </div>

            {/* 메인 강사 요청 인원 (기본값 1) */}
            <div>
              <Label htmlFor="mainInstructorCount">메인 강사 요청 인원</Label>
              <CountInput
                id="mainInstructorCount"
                min={1}
                error={!!errors.mainInstructorCount}
                {...register("mainInstructorCount", { valueAsNumber: true })}
              />
              <Err msg={errors.mainInstructorCount?.message} />
            </div>

            {/* 보조강사 인원 (기본값 0) */}
            <div>
              <Label htmlFor="assistantInstructorCount">보조강사 인원</Label>
              <CountInput
                id="assistantInstructorCount"
                min={0}
                error={!!errors.assistantInstructorCount}
                {...register("assistantInstructorCount", { valueAsNumber: true })}
              />
              <Err msg={errors.assistantInstructorCount?.message} />
            </div>

          </div>
        </FormSection>

        {/* ===== 섹션 4: 강의 일정 ===== */}
        <FormSection title="강의 일정" step={4}>
          <div className="space-y-4">
            {/* 다회차 토글 */}
            <label className="inline-flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                style={{ accentColor: "var(--green-main)" }}
                {...register("isMultiSession")}
              />
              <span className="text-sm font-medium" style={{ color: "var(--gray-label)" }}>
                다회차 교육
              </span>
            </label>
            <MultiSessionField />
          </div>
        </FormSection>

        {/* ===== 섹션 5: 장소 ===== */}
        <FormSection title="장소" step={5}>
          <div className="space-y-4">

            {/* 진행 방식 라디오 */}
            <div>
              <Label required>진행 방식</Label>
              <div className="flex gap-6">
                {(
                  [
                    { value: "onsite", label: "대면" },
                    { value: "online", label: "비대면" },
                  ] as const
                ).map(({ value, label }) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      value={value}
                      className="h-4 w-4"
                      style={{ accentColor: "var(--green-main)" }}
                      {...register("locationType")}
                    />
                    <span className="text-sm" style={{ color: "var(--gray-label)" }}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
              <Err msg={errors.locationType?.message} />
            </div>

            {/* 대면: 장소 주소 */}
            {locationType === "onsite" && (
              <div>
                <Label htmlFor="address">장소 주소</Label>
                <input
                  id="address"
                  type="text"
                  className={inputCls}
                  style={{ borderColor: "var(--gray-border)" }}
                  placeholder="예: 대구광역시 중구 공평로 88"
                  {...register("address")}
                />
              </div>
            )}

            {/* 비대면: 온라인 플랫폼 */}
            {locationType === "online" && (
              <div>
                <Label htmlFor="onlinePlatform">온라인 플랫폼</Label>
                <input
                  id="onlinePlatform"
                  type="text"
                  className={inputCls}
                  style={{ borderColor: "var(--gray-border)" }}
                  placeholder="예: Zoom, Google Meet"
                  {...register("onlinePlatform")}
                />
              </div>
            )}

          </div>
        </FormSection>

        {/* ===== 섹션 6: 예산 ===== */}
        <FormSection title="예산" step={6}>
          <BudgetField />
        </FormSection>

        {/* ===== 섹션 7: 추가 요청사항 ===== */}
        <FormSection title="추가 요청사항" step={7}>
          <textarea
            rows={3}
            className={inputCls}
            style={{ borderColor: "var(--gray-border)", resize: "vertical" }}
            placeholder="강의 방식, 특이 사항, 참고 자료 등 자유롭게 적어주세요"
            {...register("additionalRequests")}
          />
        </FormSection>

        {/* ===== 예상 견적 ===== */}
        <EstimateCalculator estimate={estimate} />

        {/* ===== 개인정보 동의 ===== */}
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--gray-border)", backgroundColor: "var(--green-bg)" }}
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded"
              style={{ accentColor: "var(--green-main)" }}
              {...register("privacyConsent")}
            />
            <span className="text-sm leading-relaxed" style={{ color: "var(--gray-label)" }}>
              <span className="font-semibold" style={{ color: "var(--green-main)" }}>
                개인정보 수집 및 이용에 동의합니다.
              </span>{" "}
              수집된 정보는 강의 의뢰 처리 목적으로만 사용됩니다.
            </span>
          </label>
          <Err msg={errors.privacyConsent?.message} />
        </div>

        {/* ===== 제출 버튼 ===== */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: "var(--green-main)" }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              제출 중...
            </span>
          ) : (
            "의뢰서 제출하기"
          )}
        </button>

      </form>
    </FormProvider>
  );
}
