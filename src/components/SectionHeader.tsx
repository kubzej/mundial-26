interface SectionHeaderProps {
  title: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function SectionHeader({
  title,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      <h2
        className="text-[15px] font-semibold"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
      </h2>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs font-medium"
          style={{ color: 'var(--color-green)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
