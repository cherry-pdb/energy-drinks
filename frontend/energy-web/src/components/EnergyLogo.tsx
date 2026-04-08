export function EnergyLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width="32"
      height="32"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="energy-can-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb347" />
          <stop offset="45%" stopColor="#ff9f1c" />
          <stop offset="100%" stopColor="#ff4d00" />
        </linearGradient>
        <linearGradient id="energy-can-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#energy-can-fill)"
        d="M18 14c0-2.2 1.8-4 4-4h20c2.2 0 4 1.8 4 4v2h4c1.1 0 2 .9 2 2v34c0 2.2-1.8 4-4 4H16c-2.2 0-4-1.8-4-4V18c0-1.1.9-2 2-2h4v-2z"
      />
      <path
        fill="url(#energy-can-shine)"
        d="M22 16h20v8H22z"
      />
      <path
        fill="#1a1208"
        fillOpacity="0.18"
        d="M20 12h24v4H20z"
      />
      <path
        fill="#1a1208"
        fillOpacity="0.92"
        d="M34 22L26 36h6l-2 12 12-18h-7l3-8z"
      />
      <path
        fill="#fff5e6"
        fillOpacity="0.9"
        d="M33 24l-5 10h4.2l-1.2 8.5L40 28h-5.5l1.5-4z"
      />
    </svg>
  );
}
