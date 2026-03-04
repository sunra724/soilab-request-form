"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CompleteContent() {
  const searchParams = useSearchParams();
  const receipt = searchParams.get("receipt");
  const [iconVisible, setIconVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIconVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--green-bg)" }}
    >
      <div className="w-full bg-white rounded-2xl shadow-sm p-10 text-center" style={{ maxWidth: 500 }}>

        {/* 1. 체크 아이콘 (scale 0→1 애니메이션) */}
        <div className="flex justify-center mb-6">
          <div
            style={{
              transform: iconVisible ? "scale(1)" : "scale(0)",
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <circle cx="30" cy="30" r="30" fill="var(--green-main)" />
              <path
                d="M15 31 L25 41 L45 19"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* 2. 제목 */}
        <h1 className="text-xl font-bold text-gray-900 mb-5">
          의뢰서가 접수되었습니다!
        </h1>

        {/* 3. 접수번호 */}
        {receipt && (
          <div className="inline-block mb-5 px-5 py-2.5 rounded-lg" style={{ backgroundColor: "#F3F4F6" }}>
            <span className="text-xs font-medium" style={{ color: "var(--gray-label)" }}>접수번호</span>
            <p className="text-base font-mono font-semibold mt-0.5" style={{ color: "var(--green-main)" }}>
              {receipt}
            </p>
          </div>
        )}

        {/* 4. 안내 문구 */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--gray-label)" }}
        >
          작성하신 이메일로 의뢰서 사본이 발송되었습니다.<br />
          담당자가 2영업일 내 연락드리겠습니다.
        </p>

        {/* 5. 구분선 */}
        <hr className="mb-6" style={{ borderColor: "var(--gray-border)" }} />

        {/* 6. 연락처 */}
        <div className="text-sm space-y-2 mb-8" style={{ color: "var(--gray-label)" }}>
          <p className="flex items-center justify-center gap-2">
            <span>📞</span>
            <span>053-941-9003 / 010-8702-6583</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>✉️</span>
            <span>soilabcoop@gmail.com</span>
          </p>
        </div>

        {/* 7. 버튼 2개 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg border-2 border-gm text-gm hover:bg-gm hover:text-white transition-colors"
          >
            새 의뢰서 작성
          </Link>
          <a
            href="https://soilabcoop.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg bg-gm text-white hover:opacity-90 transition-opacity"
          >
            소이랩 홈페이지 →
          </a>
        </div>

      </div>
    </main>
  );
}

export default function CompletePage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen"
          style={{ backgroundColor: "var(--green-bg)" }}
        />
      }
    >
      <CompleteContent />
    </Suspense>
  );
}
