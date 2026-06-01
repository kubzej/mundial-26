interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon && <div className="text-4xl mb-3">{icon}</div>}
      <p
        className="text-[15px] font-semibold"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
      </p>
      {subtitle && (
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
