import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Pause, Play } from "lucide-react";
import {
  authApi,
  useLogoutMutation,
  useProfileQuery,
} from "../services/authApi";
import { useGetSongsQuery } from "../services/songApi";
import SidebarLayout from "../components/SidebarLayout";
import { resetAvatarColor } from "../features/ui/uiSlice";

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
      dispatch(resetAvatarColor());
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
    <SidebarLayout
      user={user}
      onLogout={handleLogout}
      title="Feel the Flow"
      subtitle="Discover playlists and albums curated for every mood."
      showSearch
      headerExtras={
        <button
          type="button"
          onClick={() => refetchSongs()}
          className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/20"
        >
          Refresh
        </button>
      }
    >
      <section className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        {gradients.map((bg, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-white/10"
            style={{ backgroundImage: bg }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative flex h-40 flex-col justify-end p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">
                    Featured Mix {idx + 1}
                  </div>
                  <div className="text-xs text-white/70">12 tracks</div>
                </div>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-full bg-white text-black transition group-hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">All Music</h2>
            <p className="text-xs text-white/60">
              Browse every approved upload from artists across SonicFlow.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/song/${song._id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/song/${song._id}`);
                  }
                }}
                className="cursor-pointer rounded-2xl border border-white/10 bg-neutral-950 p-4 shadow-lg transition hover:border-white/30"
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
                    <div className="text-sm font-semibold">{song.title}</div>
                    <div className="text-xs text-white/60">{song.artist}</div>
                  </div>
                  <span className="relative text-xs uppercase tracking-wider text-white/40">
                    <div className="absolute -bottom-5 right-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handlePlayPause(song);
                        }}
                        className="rounded-full border border-white/30 bg-black/80 p-2 text-white"
                      >
                        {playingSong?._id === song._id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {playingSong && (
        <div className="fixed bottom-6 left-1/2 w-full max-w-7xl -translate-x-1/2 px-4 xl:ml-4">
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
                  <div className="text-sm font-semibold">{playingSong.title}</div>
                  <div className="text-xs text-white/60">{playingSong.artist}</div>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2 text-xs text-white/60 md:flex-row md:items-center md:text-right">
                <span className="text-[11px] md:order-1">{formatTime(currentTime)}</span>
                <div className="order-3 h-1 w-full overflow-hidden rounded-full bg-white/10 md:order-2 md:mx-3">
                  <div
                    className="h-full bg-linear-to-r from-white to-transparent"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                </div>
                <span className="order-3 text-[10px] uppercase tracking-wider">
                  {duration ? formatTime(duration) : "00:00"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handlePlayPause(playingSong)}
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
};

export default Home;
