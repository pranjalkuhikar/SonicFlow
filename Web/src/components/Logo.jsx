const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-7 rounded-md overflow-hidden bg-black">
        <svg viewBox="0 0 64 64" className="absolute inset-0">
          <defs>
            <linearGradient id="sf-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="64" height="64" rx="8" fill="#0B0B0B" />
          <path
            d="M6,40 C14,28 22,36 30,24 C38,12 46,20 54,8"
            stroke="url(#sf-grad)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="54" cy="8" r="4" fill="url(#sf-grad)" />
        </svg>
      </div>
      <span className="text-sm font-semibold tracking-wide">SonicFlow</span>
    </div>
  );
};

export default Logo;
