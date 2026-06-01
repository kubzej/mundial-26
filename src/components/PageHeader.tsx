interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: () => void;
  right?: React.ReactNode;
}

export function PageHeader({ title, subtitle, back, right }: PageHeaderProps) {
  return (
    <div
      className="sticky top-0 z-10"
      style={{
        background: 'rgba(245,245,247,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex items-center gap-3 px-4 h-14">
        {back && (
          <button
            onClick={back}
            className="p-1 -ml-1"
            style={{ color: 'var(--color-green)' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1
            className="text-[17px] font-bold leading-tight truncate"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-xs leading-none mt-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  );
}
