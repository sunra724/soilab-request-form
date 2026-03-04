export interface Session {
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  location: string;    // 이 회차 장소
}

export interface RequestFormData {
  // 연락처
  contactOffice: string;
  contactMobile: string;   // 필수
  contactEmail: string;    // 필수

  // 교육 일정
  isMultiSession: boolean;
  sessions: Session[];     // 단발이면 sessions[0] 하나만
  locationType: "onsite" | "online";
  onlineplatform: string;  // 비대면일 때

  // 교육 정보
  programName: string;     // 전체 프로그램명 (선택)
  workshopName: string;    // 필수
  goal: string;            // 교육 목표

  // 강사/인원
  mainInstructorCount: number;
  assistantInstructorCount: number;
  participantCount: number;

  // 견적/예산
  executionType: "individual" | "contract";
  assistantSupport: "available" | "unavailable";
  assistantSupportCount: number;
  budget: string;

  // 견적 계산용
  lectureType: "special" | "workshop" | "facilitation" | "course";
  durationHours: number;
}

export interface EstimateResult {
  mainFee: number;
  assistantFee: number;
  subtotal: number;
  taxOrDeduction: number;
  taxOrDeductionLabel: string;
  total: number;
  breakdown: string;   // 계산 근거 설명
}
