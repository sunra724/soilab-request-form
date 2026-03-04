// ===== 의뢰자 정보 =====
export interface RequesterInfo {
  name: string;           // 담당자명
  organization: string;  // 기관/단체명
  phone: string;          // 연락처
  email: string;          // 이메일
  role?: string;          // 직책/역할
}

// ===== 강의 대상 =====
export type AudienceType =
  | "elementary"    // 초등학생
  | "middle"        // 중학생
  | "high"          // 고등학생
  | "university"    // 대학생
  | "adult"         // 성인 일반
  | "senior"        // 시니어
  | "employee"      // 직장인
  | "teacher"       // 교사/강사
  | "mixed"         // 혼합
  | "other";        // 기타

// ===== 강의 유형 =====
export type LectureType =
  | "lecture"       // 강의 (일방향)
  | "workshop"      // 워크숍 (참여형)
  | "seminar"       // 세미나
  | "consulting"    // 컨설팅
  | "training"      // 교육훈련
  | "other";        // 기타

// ===== 강의 주제 영역 =====
export type TopicArea =
  | "cooperative"   // 협동조합/사회적경제
  | "community"     // 마을/공동체
  | "environment"   // 환경/지속가능성
  | "democracy"     // 민주주의/시민교육
  | "media"         // 미디어/디지털 리터러시
  | "creativity"    // 창의/예술
  | "leadership"    // 리더십/조직문화
  | "other";        // 기타

// ===== 단일 세션 일정 =====
export interface SessionSchedule {
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  durationMinutes: number;
}

// ===== 장소 정보 =====
export interface VenueInfo {
  type: "provided" | "online" | "soilab" | "tbd"; // 장소 제공 방식
  address?: string;       // 주소 (오프라인일 경우)
  platform?: string;      // 플랫폼 (온라인일 경우, e.g. Zoom, Google Meet)
  notes?: string;         // 장소 관련 메모
}

// ===== 예산 정보 =====
export interface BudgetInfo {
  hasEstimate: boolean;         // 예산이 정해져 있는지
  amount?: number;              // 예산 금액 (원)
  includesTax: boolean;         // VAT 포함 여부
  paymentTiming?: "before" | "after" | "split"; // 지급 시기
  notes?: string;               // 예산 관련 메모
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

// ===== 메인 폼 데이터 =====
export interface RequestFormData {
  // 1. 의뢰자 정보
  requester: RequesterInfo;

  // 2. 강의 기본 정보
  lectureType: LectureType;
  topicArea: TopicArea;
  topicDetail: string;          // 세부 주제/내용 설명

  // 3. 대상 및 규모
  audienceType: AudienceType;
  audienceCount: number;        // 참여 인원

  // 4. 일정
  isMultiSession: boolean;      // 다회차 여부
  sessions: SessionSchedule[];  // 세션 일정 (1개 이상)

  // 5. 장소
  venue: VenueInfo;

  // 6. 예산
  budget: BudgetInfo;

  // 7. 추가 요청사항
  additionalRequests?: string;

  // 8. 개인정보 동의
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
