interface FortunaLogoProps {
  className?: string;
  showText?: boolean;
  lightMode?: boolean; // true si se ubica en header/footer oscuro
}

export function FortunaLogo({
  className = "h-12 w-auto",
  showText = true,
  lightMode = false,
}: FortunaLogoProps) {
  const textColor = lightMode ? "#FAF6F0" : "#2E241E";

  return (
    <div className="inline-flex flex-col items-center justify-center select-none gap-2">
      <svg
        viewBox="0 0 100 82"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          {/* Degradado fiel al logo original: cobre oscuro a ámbar dorado */}
          <linearGradient id="fortuna-original-grad" x1="0%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#A43B22" />
            <stop offset="45%" stopColor="#C95F38" />
            <stop offset="85%" stopColor="#E08B5D" />
            <stop offset="100%" stopColor="#EB9E67" />
          </linearGradient>
        </defs>

        {/* 1. Curva Parabólica (Arco tipo campana / distribución normal) */}
        <path
          d="M 16 76 C 25 32, 40 6, 50 6 C 60 6, 75 32, 84 76"
          stroke="url(#fortuna-original-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* 2. Travesaño horizontal que cruza ambas curvas de extremo a extremo */}
        <line
          x1="12"
          y1="49"
          x2="88"
          y2="49"
          stroke="url(#fortuna-original-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* 3. Tallo vertical central descendente */}
        <line
          x1="50"
          y1="49"
          x2="50"
          y2="71"
          stroke="url(#fortuna-original-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <span
          style={{ color: textColor }}
          className="font-sans tracking-[0.3em] text-[0.68rem] sm:text-xs font-normal uppercase whitespace-nowrap"
        >
          Fortuna Connect
        </span>
      )}
    </div>
  );
}