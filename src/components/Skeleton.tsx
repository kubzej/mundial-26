interface SkeletonProps {
  className?: string;
  height?: number | string;
  rounded?: string;
}

export function Skeleton({
  className = '',
  height = 20,
  rounded = 'var(--radius-sm)',
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        height,
        borderRadius: rounded,
        background:
          'linear-gradient(90deg, #f0f2f5 25%, #e8ebef 50%, #f0f2f5 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}

export function MatchCardSkeleton() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        padding: '14px 16px',
      }}
    >
      <Skeleton height={10} className="w-24 mb-3" />
      <div className="flex items-center gap-3">
        <Skeleton height={24} className="w-6 rounded-full" rounded="50%" />
        <Skeleton height={14} className="flex-1" />
        <Skeleton height={28} className="w-16" rounded="var(--radius-sm)" />
        <Skeleton height={14} className="flex-1" />
        <Skeleton height={24} className="w-6 rounded-full" rounded="50%" />
      </div>
    </div>
  );
}

// Add keyframe to page via style injection
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
}
