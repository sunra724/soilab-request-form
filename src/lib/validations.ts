import { z } from "zod";

// ===== 세션 스키마 =====
const sessionSchema = z.object({
  date: z.string().min(1, "날짜를 입력해주세요"),
  startTime: z.string().min(1, "시작 시간을 입력해주세요"),
  endTime: z.string().min(1, "종료 시간을 입력해주세요"),
  durationMinutes: z.number().min(30, "최소 30분 이상이어야 합니다"),
});

// ===== 의뢰자 정보 스키마 =====
const requesterSchema = z.object({
  name: z.string().min(1, "담당자명을 입력해주세요"),
  organization: z.string().min(1, "기관/단체명을 입력해주세요"),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^[0-9\-+\s]+$/, "올바른 전화번호 형식을 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  role: z.string().optional(),
});

// ===== 장소 스키마 =====
const venueSchema = z.object({
  type: z.enum(["provided", "online", "soilab", "tbd"]),
  address: z.string().optional(),
  platform: z.string().optional(),
  notes: z.string().optional(),
});

// ===== 예산 스키마 =====
const budgetSchema = z.object({
  hasEstimate: z.boolean(),
  amount: z.number().min(0).optional(),
  includesTax: z.boolean(),
  paymentTiming: z.enum(["before", "after", "split"]).optional(),
  notes: z.string().optional(),
});

// ===== 메인 폼 스키마 =====
export const requestFormSchema = z.object({
  requester: requesterSchema,
  lectureType: z.enum(["lecture", "workshop", "seminar", "consulting", "training", "other"]),
  topicArea: z.enum(["cooperative", "community", "environment", "democracy", "media", "creativity", "leadership", "other"]),
  topicDetail: z.string().min(10, "세부 주제를 10자 이상 입력해주세요"),
  audienceType: z.enum(["elementary", "middle", "high", "university", "adult", "senior", "employee", "teacher", "mixed", "other"]),
  audienceCount: z.number().min(1, "참여 인원을 입력해주세요").max(1000),
  isMultiSession: z.boolean(),
  sessions: z.array(sessionSchema).min(1, "최소 1개의 세션을 입력해주세요"),
  venue: venueSchema,
  budget: budgetSchema,
  additionalRequests: z.string().optional(),
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, "개인정보 수집 및 이용에 동의해주세요"),
});

export type RequestFormSchema = z.infer<typeof requestFormSchema>;
