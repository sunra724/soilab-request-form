# 소이랩 강의의뢰서 웹폼

협동조합 소이랩의 강의·워크숍 의뢰 접수 웹폼입니다.
의뢰자가 양식을 작성·제출하면 담당자와 의뢰자 이메일로 사본이 자동 발송됩니다.

**Tech Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Hook Form · Zod

---

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 파일 생성

```bash
cp .env.local.example .env.local
```

`.env.local`을 열어 아래 환경변수 목록을 참고해 실제 값을 입력합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

### 4. 프로덕션 빌드 확인

```bash
npm run build
npm start
```

---

## EmailJS 설정 방법

이 프로젝트는 서버리스 환경에서의 이메일 발송을 위해 **EmailJS** 사용을 전제합니다.
현재 API Route(`src/app/api/send-email/route.ts`)는 이메일 내용을 콘솔에만 출력하며,
실제 발송 연동은 아래 절차로 설정 후 구현합니다.

### Step 1 — EmailJS 계정 및 서비스 생성

1. [https://emailjs.com](https://emailjs.com) 에서 무료 계정 생성
2. **Email Services** 탭 → **Add New Service** 클릭
3. Gmail 또는 원하는 메일 서비스 선택 후 연동
4. 생성된 **Service ID** 복사 → `.env.local`의 `NEXT_PUBLIC_EMAILJS_SERVICE_ID`에 입력

### Step 2 — 이메일 템플릿 2개 생성

**템플릿 1: 의뢰자 사본 (template_to_requester)**

- **To email:** `{{to_email}}`
- **Subject:** `[소이랩] 강의 의뢰서 접수 확인 - {{receipt_number}}`
- **Body:** 접수 확인 안내 문구 + 의뢰 내용 요약

**템플릿 2: 관리자 알림 (template_to_admin)**

- **To email:** `{{to_email}}` (소이랩 이메일로 고정)
- **Subject:** `[새 의뢰 접수] {{contact_name}} / {{organization}}`
- **Body:** 전체 의뢰 내용

각 템플릿 생성 후 **Template ID** 복사 → `.env.local`에 입력

### Step 3 — Public Key 확인

**Account** → **General** 탭 → **Public Key** 복사 → `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`에 입력

---

## Vercel 배포 방법

### Step 1 — GitHub 레포지토리 생성 및 푸시

```bash
git init
git add .
git commit -m "feat: 소이랩 강의의뢰서 웹폼 초기 배포"
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

### Step 2 — Vercel 프로젝트 연결

1. [https://vercel.com/new](https://vercel.com/new) 접속
2. GitHub 레포지토리 선택 → **Import**
3. Framework Preset: **Next.js** (자동 감지됨)
4. **Deploy** 클릭

### Step 3 — 환경변수 등록

Vercel 대시보드 → **Settings** → **Environment Variables** 에서
아래 환경변수 목록의 모든 항목을 입력합니다.

> `.env.local` 파일은 `.gitignore`에 의해 Git에 포함되지 않으므로,
> Vercel에는 반드시 직접 환경변수를 등록해야 합니다.

### Step 4 — 재배포

환경변수 등록 후 **Deployments** 탭 → 최신 배포 → **Redeploy**

---

## 환경변수 목록

| 변수명 | 설명 | 예시 |
|---|---|---|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS 서비스 ID | `service_xxxxxxx` |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS Public Key | `aBcDeFgHiJkLmNoPq` |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_REQUESTER` | 의뢰자 사본 발송용 템플릿 ID | `template_xxxxxxx` |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN` | 관리자 알림용 템플릿 ID | `template_yyyyyyy` |
| `NEXT_PUBLIC_ADMIN_EMAIL` | 관리자 이메일 (클라이언트 참조용) | `soilabcoop@gmail.com` |
| `ADMIN_EMAIL` | 관리자 이메일 (서버 API Route용) | `soilabcoop@gmail.com` |

> `NEXT_PUBLIC_` 접두사가 있는 변수는 브라우저에서도 접근 가능합니다.
> `ADMIN_EMAIL`은 서버 전용이며 클라이언트에 노출되지 않습니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 의뢰서 폼 페이지
│   ├── complete/page.tsx     # 접수 완료 페이지
│   ├── api/send-email/       # 이메일 발송 API Route
│   └── globals.css           # 소이랩 브랜드 색상 + Tailwind v4 테마
├── components/
│   ├── RequestForm.tsx        # 메인 폼 컴포넌트
│   ├── EstimateCalculator.tsx # 실시간 견적 계산기
│   ├── FormSection.tsx        # 폼 섹션 레이아웃
│   └── fields/               # 개별 폼 필드 컴포넌트
├── lib/
│   ├── validations.ts         # Zod 스키마
│   ├── estimate.ts            # 견적 계산 로직
│   ├── email-templates.ts     # 이메일 본문 템플릿
│   └── emailjs.ts             # EmailJS 발송 헬퍼
└── types/
    ├── form.ts                # 견적 계산 관련 타입
    └── request-form.ts        # 폼 데이터 타입 정의
```

---

협동조합 소이랩 · soilabcoop@gmail.com · 053-941-9003
