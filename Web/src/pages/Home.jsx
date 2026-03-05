import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Pause, Play } from "lucide-react";
import Search from "../components/Search";
import {
  authApi,
  useProfileQuery,
  useLogoutMutation,
} from "../services/authApi";
import { useGetSongsQuery } from "../services/songApi";
import AvatarMenu from "../components/AvatarMenu";
import Navbar from "../components/Navbar";

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
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
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

  const {
    data: songsData,
    isFetching: isLoadingSongs,
    refetch: refetchSongs,
  } = useGetSongsQuery();
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(authApi.util.resetApiState());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const audio = new Audio();
    const handleEnded = () => {
      setIsPlaying(false);
      setPlayingSong(null);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const handlePlayPause = (song) => {
    const audio = audioRef.current;
    if (!audio) return;

    const isSameSong = playingSong?._id === song._id;
    if (isSameSong && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (!isSameSong) {
      audio.pause();
      setCurrentTime(0);
      setDuration(0);
      audio.src = song.audioFile.url;
      audio.currentTime = 0;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setPlayingSong(song);
      })
      .catch((err) => {
        console.error("Failed to play song", err);
      });
  };

  const formatTime = (value) => {
    if (!value || Number.isNaN(value)) {
      return "00:00";
    }
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen pb-40 bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div
          className="relative min-h-screen"
          style={{
            background: "radial-gradient(ellipse 0% 100% at 50% 0%)",
          }}
        >
          <Navbar>
            <div className="justify-end gap-4 py-4 md:py-0 hidden md:flex">
              {user?.user?.role === "artist" && (
                <button
                  type="button"
                  onClick={() => navigate("/artist")}
                  className="rounded-lg bg-white active:scale-95 text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
                >
                  Artist Dashboard
                </button>
              )}
            </div>
            {user ? (
              <AvatarMenu
                user={user.user}
                color={avatarColor}
                onLogout={handleLogout}
              />
            ) : (
              <nav className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-lg border active:scale-95 border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-white active:scale-95 text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
                >
                  Register
                </Link>
              </nav>
            )}
          </Navbar>

          <section className="px-2 md:px-6">
            <div className="flex justify-between items-center gap-4 pb-4 md:py-0 md:hidden">
              <Search />
              {user?.user?.role === "artist" && (
                <button
                  type="button"
                  onClick={() => navigate("/artist")}
                  className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
                >
                  Artist Dashboard
                </button>
              )}
            </div>

            <div className="max-w-7xl mx-auto">
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

          <section className="px-4 md:px-6 mt-14">
            <div className="mx-auto w-full max-w-7xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">All Music</h2>
                  <p className="text-xs text-white/60">
                    Browse every approved upload from artists across SonicFlow.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => refetchSongs()}
                  className="self-start rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/20"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingSongs ? (
                  <div className="col-span-full rounded-2xl border border-white/10 bg-neutral-950/60 p-6 text-center text-sm text-white/60">
                    Fetching songs...
                  </div>
                ) : (songsData?.songs ?? []).length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-white/10 bg-neutral-950/60 p-6 text-center text-sm text-white/60">
                    No songs published yet.
                  </div>
                ) : (
                  (songsData?.songs ?? []).slice(0, 6).map((song) => (
                    <div
                      key={song._id}
                      className="rounded-2xl border border-white/10 bg-neutral-950 p-4 shadow-lg transition hover:border-white/30"
                    >
                      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/5">
                        <img
                          src={song.coverImage.url}
                          alt={song.title}
                          className="h-72 w-full object-cover"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">
                            {song.title}
                          </div>
                          <div className="text-xs text-white/60">
                            {song.artist}
                          </div>
                        </div>
                        <span className="relative text-xs uppercase tracking-wider text-white/40">
                          <div className="absolute -bottom-5 right-3">
                            <button
                              type="button"
                              onClick={() => handlePlayPause(song)}
                              className="rounded-full border border-white/30 bg-black/80 p-2 text-white"
                            >
                              {playingSong?._id === song._id && isPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      {playingSong && (
        <div className="fixed bottom-6 left-1/2 xl:ml-4 w-full max-w-7xl -translate-x-1/2 px-4">
          <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-12 h-12 w-12 overflow-hidden rounded-xl border border-white/20">
                  <img
                    src={playingSong.coverImage.url}
                    alt={playingSong.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {playingSong.title}
                  </div>
                  <div className="text-xs text-white/60">
                    {playingSong.artist}
                  </div>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2 text-xs text-white/60 md:flex-row md:items-center md:text-right">
                <span className="text-[11px] md:order-1">
                  {formatTime(currentTime)}
                </span>
                <div className="order-3 h-1 w-full overflow-hidden rounded-full bg-white/10 md:order-2 md:mx-3">
                  <div
                    className="h-full bg-linear-to-r from-white to-transparent"
                    style={{
                      width: duration
                        ? `${(currentTime / duration) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-wider order-3">
                  {duration ? formatTime(duration) : "00:00"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handlePlayPause(playingSong)}
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
