interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  step?: number;
}

export default function FormSection({
  title,
  description,
  children,
  step,
}: FormSectionProps) {
  return (
    <section
      className="rounded-2xl border bg-white p-6"
      style={{ borderColor: "var(--gray-border)" }}
    >
      {/* 섹션 헤더 */}
      <div className="mb-5 flex items-center gap-3">
        {step !== undefined && (
          <span
            className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: "var(--green-main)" }}
          >
            {step}
          </span>
        )}
        <div>
          <h2 className="text-base font-bold text-gray-800">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs" style={{ color: "var(--gray-label)" }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* 섹션 내용 */}
      <div>{children}</div>
    </section>
  );
}
