import { Link } from "react-router-dom";

const gradients = [
  "linear-gradient(135deg, #F59E0B, #EF4444 60%, #111111)",
  "linear-gradient(135deg, #22D3EE, #6366F1 60%, #111111)",
  "linear-gradient(135deg, #34D399, #10B981 60%, #111111)",
  "linear-gradient(135deg, #F472B6, #A855F7 60%, #111111)",
  "linear-gradient(135deg, #FB7185, #F43F5E 60%, #111111)",
  "linear-gradient(135deg, #FDE68A, #F59E0B 60%, #111111)",
];

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="relative min-h-screen"
        style={{
          background: "radial-gradient(ellipse 0% 100% at 50% 0%)",
        }}
      >
        <header className="px-6 md:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-white" />
            <span className="text-sm font-medium">SonicFlow</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
            >
              Register
            </Link>
          </nav>
        </header>

        <section className="px-6 md:px-10 pt-6 md:pt-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-semibold">
              Feel the Flow
            </h1>
            <p className="mt-3 text-neutral-300">
              Discover playlists and albums curated for every mood.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-5">
            {gradients.map((bg, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-white/10"
                style={{ backgroundImage: bg }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative p-4 flex flex-col justify-end h-40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">
                        Featured Mix {idx + 1}
                      </div>
                      <div className="text-xs text-white/70">12 tracks</div>
                    </div>
                    <button
                      type="button"
                      className="flex items-center justify-center size-9 rounded-full bg-white text-black group-hover:scale-105 transition"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-6 flex justify-center px-6">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-neutral-950/90 backdrop-blur p-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg border border-white/10 bg-linear-to-tr from-fuchsia-500 to-purple-700" />
              <div className="flex-1">
                <div className="text-sm">SonicFlow Preview</div>
                <div className="text-xs text-white/60">Artist Name</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="size-9 rounded-full border border-white/20 bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/80">
                    <path d="M15 18l-6-6 6-6v12z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="size-10 rounded-full bg-white text-black font-semibold"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="size-9 rounded-full border border-white/20 bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/80">
                    <path d="M9 18l6-6-6-6v12z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
