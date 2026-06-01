interface TeamLogoProps {
  logo: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export function TeamLogo({
  logo,
  name,
  size = 'md',
  className = '',
}: TeamLogoProps) {
  return (
    <img
      src={logo}
      alt={name}
      className={`${sizes[size]} object-contain ${className}`}
      onError={(e) => {
        const target = e.currentTarget;
        target.style.opacity = '0.3';
      }}
    />
  );
}
