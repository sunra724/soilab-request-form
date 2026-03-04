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
  // TODO: 스타일링 구현 예정
  return (
    <section>
      <div>
        {step !== undefined && <span>{step}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}
