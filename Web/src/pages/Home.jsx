import { useState } from "react";
import { Link } from "react-router-dom";
import { useProfileQuery, useLogoutMutation } from "../services/authApi";

const gradients = [
  "linear-gradient(135deg, #F59E0B, #EF4444 60%, #111111)",
  "linear-gradient(135deg, #22D3EE, #6366F1 60%, #111111)",
  "linear-gradient(135deg, #34D399, #10B981 60%, #111111)",
  "linear-gradient(135deg, #F472B6, #A855F7 60%, #111111)",
  "linear-gradient(135deg, #FB7185, #F43F5E 60%, #111111)",
  "linear-gradient(135deg, #FDE68A, #F59E0B 60%, #111111)",
];

const Home = () => {
  const { data: user } = useProfileQuery();
  const [logout] = useLogoutMutation();
  const colors = [
    "bg-pink-500",
    "bg-purple-600",
    "bg-indigo-500",
    "bg-blue-500",
    "bg-sky-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-emerald-500",
    "bg-lime-500",
    "bg-amber-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-fuchsia-500",
  ];
  const [avatarColor] = useState(
    () => colors[Math.floor(Math.random() * colors.length)],
  );

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto">
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
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2"
                    onClick={() => setProfileOpen((o) => !o)}
                  >
                    <div
                      className={`size-8 rounded-full ${avatarColor} flex items-center justify-center font-semibold`}
                    >
                      {user.user.firstName[0]}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm">
                        {user.user.firstName} {user.user.lastName}
                      </div>
                      <div className="text-xs text-white/60">
                        {user.user.email}
                      </div>
                    </div>
                  </button>
                  <div
                    className={`absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur shadow-2xl ${profileOpen ? "block" : "hidden"}`}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-full ${avatarColor} flex items-center justify-center font-semibold`}
                        >
                          {user.user.firstName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">
                            {user.user.firstName} {user.user.lastName}
                          </div>
                          <div className="text-xs text-white/60">
                            {user.user.email}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 h-px bg-white/10" />
                      <div className="mt-3">
                        <button
                          type="button"
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
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
    </div>
  );
};

export default Home;
