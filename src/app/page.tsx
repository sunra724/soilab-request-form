import RequestForm from "@/components/RequestForm";

export default function Home() {
  return (
    <main className="min-h-screen py-10 px-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-[1100px] mx-auto">
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
            style={{ color: "var(--green-main)" }}
          >
            soilab · 협동조합 소이랩
          </p>
          <h1 className="text-2xl font-bold text-gray-900">강의 / 워크숍 의뢰서</h1>
          <p className="mt-2 text-sm text-gray-500">
            작성하신 내용은 담당자와 의뢰자 이메일로 사본이 발송됩니다.
          </p>
        </header>

        <RequestForm />
      </div>
    </main>
  );
}
