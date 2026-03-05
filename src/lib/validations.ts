import { z } from "zod";

// ===== 세션 스키마 (변경 없음) =====
const sessionSchema = z.object({
  date: z.string().min(1, "날짜를 입력해주세요"),
  startTime: z.string().min(1, "시작 시간을 입력해주세요"),
  endTime: z.string().min(1, "종료 시간을 입력해주세요"),
  durationMinutes: z.number().min(30, "최소 30분 이상이어야 합니다"),
});

// ===== 예산 스키마 (변경 없음) =====
const budgetSchema = z.object({
  hasEstimate: z.boolean(),
  amount: z.number().min(0).optional(),
  includesTax: z.boolean(),
  paymentTiming: z.enum(["before", "after", "split"]).optional(),
  notes: z.string().optional(),
});

// ===== 메인 폼 스키마 =====
export const requestFormSchema = z.object({
  // ① 의뢰자 정보
  contactName: z.string().min(1, "담당자명을 입력해주세요"),
  officePhone: z.string().optional(),
  mobilePhone: z
    .string()
    .min(1, "휴대폰 번호를 입력해주세요")
    .regex(/^[0-9\-+\s]+$/, "올바른 전화번호 형식을 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),

  // ② 강의 정보
  workshopName: z.string().min(1, "교육/워크숍명을 입력해주세요"),
  goal: z.string().min(1, "교육 목표를 입력해주세요"),
  programName: z.string().optional(),

  // ③ 교육 대상 및 규모
  participantCount: z
    .number({ error: "숫자를 입력해주세요" })
    .min(1, "참가 인원을 입력해주세요"),
  mainInstructorCount: z
    .number({ error: "숫자를 입력해주세요" })
    .min(1, "최소 1명 이상 입력해주세요"),
  assistantInstructorCount: z
    .number({ error: "숫자를 입력해주세요" })
    .min(0, "0 이상의 숫자를 입력해주세요"),

  // ④ 강의 일정
  isMultiSession: z.boolean(),
  sessions: z.array(sessionSchema).min(1, "최소 1개의 세션을 입력해주세요"),

  // ⑤ 장소
  locationType: z.enum(["onsite", "online"] as const, {
    error: "진행 방식을 선택해주세요",
  }),
  address: z.string().optional(),
  onlinePlatform: z.string().optional(),

  // ⑥ 예산
  budget: budgetSchema,

  // ⑦ 추가 요청사항
  additionalRequests: z.string().optional(),

  // 개인정보 동의
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, "개인정보 수집 및 이용에 동의해주세요"),
});

export type RequestFormSchema = z.infer<typeof requestFormSchema>;
