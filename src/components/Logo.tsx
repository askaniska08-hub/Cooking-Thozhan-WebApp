interface LogoProps {
  /** Rendered size (width = height) in pixels */
  size?: number;
  className?: string;
}

/**
 * Official Cooking Thozhan logo — a perfectly circular PNG of Chef Tara
 * (with transparent background outside the circle).
 *
 * The container clips to a circle via border-radius + overflow-hidden and
 * the image uses object-fit: cover so the artwork fills the badge with
 * zero empty padding, matching the shared .logo-container styles.
 */
export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <span
      className={`logo-container inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/images/tara-logo.png"
        alt="Cooking Thozhan logo"
        draggable={false}
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.dataset.fallback) {
            img.dataset.fallback = '1';
            img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#FF7A00"/><text x="50" y="62" font-size="44" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">T</text></svg>'
            );
          }
        }}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          borderRadius: '50%',
        }}
      />
    </span>
  );
}
