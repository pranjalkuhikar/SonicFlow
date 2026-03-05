import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import {
  authApi,
  useLogoutMutation,
  useProfileQuery,
} from "../services/authApi";
import { useGetSongsQuery } from "../services/songApi";
import HeaderActions from "../components/HeaderActions";
import Navbar from "../components/Navbar";
import { resetAvatarColor } from "../features/ui/uiSlice";

const Song = () => {
  const { data: user } = useProfileQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const { id } = useParams();
  const { data: songsData, isFetching, isError } = useGetSongsQuery();
  const song = songsData?.songs?.find((track) => track._id === id);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(authApi.util.resetApiState());
      dispatch(resetAvatarColor());
      navigate("/");
    } catch (err) {
      console.error(err);
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

  useEffect(() => {
    if (!song) {
      if (playingSong) {
        setPlayingSong(null);
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      audioRef.current?.pause();
    }
  }, [song, playingSong]);

  const handlePlayPause = (track) => {
    const audio = audioRef.current;
    if (!track || !audio) return;

    const isSameSong = playingSong?._id === track._id;
    if (isSameSong && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (!isSameSong) {
      audio.pause();
      setCurrentTime(0);
      setDuration(0);
      audio.src = track.audioFile.url;
      audio.currentTime = 0;
    }

    audio
      .play()
      .then(() => {
        setPlayingSong(track);
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Playback failed", err);
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
    <div className="min-h-screen pb-20 bg-black text-white border-2 border-white/10">
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-6">
        <Navbar>
          <HeaderActions user={user} onLogout={handleLogout} />
        </Navbar>

        <main className="mx-auto w-full max-w-6xl px-0 py-10">
          {isFetching ? (
            <div className="rounded-2xl border border-white/10 bg-neutral-950/60 p-6 text-center text-sm text-white/60">
              Loading track…
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-white/10 bg-neutral-950/60 p-6 text-center text-sm text-white/60">
              Something went wrong. Try refreshing or returning to{" "}
              <Link to="/" className="text-white underline">
                All Music
              </Link>
              .
            </div>
          ) : !song ? (
            <div className="rounded-2xl border border-white/10 bg-neutral-950/60 p-6 text-center text-sm text-white/60">
              Song not found.
              <div className="mt-3">
                <Link
                  to="/"
                  className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold hover:border-white/60"
                >
                  Back to All Music
                </Link>
              </div>
            </div>
          ) : (
            <section className="grid gap-8 lg:grid-cols-[280px_1fr]">
              <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={song.coverImage.url}
                    alt={song.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.5em] text-white/50">
                    Song
                  </p>
                  <h1 className="text-4xl font-semibold">{song.title}</h1>
                  <p className="text-lg text-white/60">{song.artist}</p>
                </div>
                <div className="space-y-3 text-sm text-white/60">
                  <p>
                    Stream and share this track with your friends, discover new
                    vibes, and drop it into your favorite playlist.
                  </p>
                  <p>Published by SonicFlow creators.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handlePlayPause(song)}
                    className="flex items-center w-40 gap-2 rounded-full border border-white/30 px-6 py-2 text-sm font-semibold hover:border-white/70"
                  >
                    {isPlaying && playingSong?._id === song._id ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                    <span>
                      {isPlaying && playingSong?._id === song._id
                        ? "Pause"
                        : "Play"}{" "}
                      track
                    </span>
                  </button>
                  <Link
                    to="/"
                    className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold hover:border-white/70"
                  >
                    Back to All Music
                  </Link>
                  <Link
                    to="/"
                    className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black"
                  >
                    Explore all songs
                  </Link>
                </div>
              </div>
            </section>
          )}
        </main>
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
    </div>
  );
};

export default Song;
