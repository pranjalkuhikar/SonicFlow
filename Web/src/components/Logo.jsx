import { Link } from "react-router-dom";

const Logo = () => {
  const bars = [3, 6, 10, 14, 10, 7, 12, 9, 5, 8, 13, 7, 4, 9, 11];

  return (
    <Link to={"/"} className="flex items-center gap-3">
      {/* Icon */}
      <div className="relative size-9 rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/[0.07] shadow-[0_0_20px_rgba(139,92,246,0.35)]">
        {/* Glow blob */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,rgba(139,92,246,0.4)_0%,rgba(6,182,212,0.15)_50%,transparent_70%)]" />

        {/* Animated waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-0.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full"
              style={{
                height: `${(h / 14) * 58}%`,
                background:
                  i === 4 || i === 9
                    ? "linear-gradient(to top, #06B6D4, #8B5CF6)"
                    : "linear-gradient(to top, rgba(139,92,246,0.9), rgba(6,182,212,0.7))",
                animation: `sonicBar 1.4s ease-in-out ${(i * 0.07).toFixed(2)}s infinite alternate`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes sonicBar {
            0%   { transform: scaleY(1);    opacity: 0.6; }
            100% { transform: scaleY(0.4);  opacity: 1;   }
          }
        `}</style>
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-[17px] font-extrabold tracking-tight">
          <span className="text-white">Sonic</span>
          <span
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Flow
          </span>
        </span>
        <span className="text-[7px] font-bold tracking-[0.22em] uppercase text-violet-500/60 mt-0.75">
          music
        </span>
      </div>
    </Link>
  );
};

export default Logo;
