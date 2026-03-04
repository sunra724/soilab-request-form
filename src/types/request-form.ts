// ===== 세션 일정 =====
export interface SessionSchedule {
  date: string;           // YYYY-MM-DD
  startTime: string;      // HH:mm
  endTime: string;        // HH:mm
  durationMinutes: number;
}

// ===== 예산 정보 =====
export interface BudgetInfo {
  hasEstimate: boolean;
  amount?: number;
  includesTax: boolean;
  paymentTiming?: "before" | "after" | "split";
  notes?: string;
}

// ===== 견적 계산 결과 (estimate.ts 반환 구조와 일치) =====
export interface EstimateResult {
  mainFee: number;              // 주강사료 합계
  assistantFee: number;         // 보조강사료 합계
  subtotal: number;             // 소계 (주+보조)
  taxOrDeduction: number;       // 부가세(+) 또는 원천징수(-) 금액
  taxOrDeductionLabel: string;  // 세금 항목 레이블
  total: number;                // 최종 금액
  breakdown: string;            // 계산 근거 설명
}

// ===== 메인 폼 데이터 (validations.ts RequestFormSchema 와 동일 구조) =====
export interface RequestFormData {
  // ① 의뢰자 정보
  officePhone?: string;         // 사무실 전화 (선택)
  mobilePhone: string;          // 휴대폰 (필수)
  email: string;                // 이메일 (필수)

  // ② 강의 정보
  workshopName: string;         // 교육/워크숍명 (필수)
  goal: string;                 // 교육 목표 (필수)
  programName?: string;         // 전체 프로그램명 (선택)

  // ③ 교육 대상 및 규모
  participantCount: number;     // 참가 인원
  mainInstructorCount: number;  // 메인 강사 인원
  assistantInstructorCount: number; // 보조강사 인원

  // ④ 강의 일정
  isMultiSession: boolean;
  sessions: SessionSchedule[];

  // ⑤ 장소
  locationType: "onsite" | "online";
  address?: string;
  onlinePlatform?: string;

  // ⑥ 예산
  budget: BudgetInfo;

  // ⑦ 추가 요청사항
  additionalRequests?: string;

  // 개인정보 동의
  privacyConsent: boolean;
}

// ===== 폼 제출 상태 =====
export type FormStatus = "idle" | "submitting" | "success" | "error";

// ===== API 요청/응답 =====
export interface SendEmailRequest {
  formData: RequestFormData;
  estimate: EstimateResult;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
}
