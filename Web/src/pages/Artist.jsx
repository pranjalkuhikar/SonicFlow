import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Pause, Play } from "lucide-react";
import {
  authApi,
  useProfileQuery,
  useLogoutMutation,
} from "../services/authApi";
import {
  useAddSongMutation,
  useGetSongsQuery,
  useDeleteSongMutation,
} from "../services/songApi";
import AddSongModal from "../components/AddSongModal";
import Navbar from "../components/Navbar";
import HeaderActions from "../components/HeaderActions";
import { useNavigate } from "react-router-dom";

const Artist = () => {
  const { data: user } = useProfileQuery();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const [addSong] = useAddSongMutation();
  const { data } = useGetSongsQuery();
  const [deleteSong] = useDeleteSongMutation();

  const [playingSongId, setPlayingSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(authApi.util.resetApiState());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSongSubmit = async (songData) => {
    const formData = new FormData();
    formData.append("title", songData.title);
    formData.append("artist", songData.artistName);
    if (songData.coverImage) {
      formData.append("coverImage", songData.coverImage);
    }
    if (songData.songFile) {
      formData.append("audioFile", songData.songFile);
    }

    try {
      await addSong(formData).unwrap();
      setShowModal(false);
      navigate("/artist");
    } catch (err) {
      console.error("Failed to add song", err);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await deleteSong(songId).unwrap();
    } catch (err) {
      console.error("Failed to delete song", err);
    }
  };

  useEffect(() => {
    const audio = new Audio();
    const handleEnded = () => {
      setIsPlaying(false);
      setPlayingSongId(null);
    };
    audio.addEventListener("ended", handleEnded);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handlePlayPause = (song) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingSongId === song._id && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (playingSongId !== song._id) {
      audio.src = song.audioFile.url;
      audio.currentTime = 0;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setPlayingSongId(song._id);
      })
      .catch((playError) => {
        console.error("Failed to play audio", playError);
      });
  };

  useEffect(() => {
    if (user && user.user.role !== "artist") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-red-400 text-white">
      <div className="max-w-7xl mx-auto">
        <Navbar>
          <HeaderActions
            user={user}
            onLogout={handleLogout}
            showArtistButton={false}
            showHomeButton
          />
        </Navbar>
        <AddSongModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSongSubmit}
        />

        <section className="px-6 md:px-10 py-2">
          <div className="max-w-7xl">
            <div className="flex items-between md:items-end flex-col md:flex-row justify-between py-4">
              <div>
                <h1 className="text-3xl font-semibold">Artist Dashboard</h1>
                <p className="mt-2 text-neutral-400">
                  Manage your songs and playlists.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="rounded-lg border active:scale-95 border-white/20 bg-white/10 px-4 py-2 mt-2 md:mt-0 text-sm hover:bg-white/20"
              >
                Add Song
              </button>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-semibold">Your Songs</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(data?.songs ?? []).map((song) => (
                  <div
                    key={song._id}
                    className="rounded-2xl border border-white/10 bg-neutral-950 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="size-16 rounded-lg border border-white/10 bg-white/10">
                          <img
                            src={song.coverImage.url}
                            alt={song.title}
                            className="size-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {song.title}
                          </div>
                          <div className="text-xs text-white/60">
                            {song.artist}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayPause(song)}
                        className="rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
                      >
                        {playingSongId === song._id && isPlaying ? (
                          <Pause className="text-lg" />
                        ) : (
                          <Play className="text-lg" />
                        )}
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-white/60">1,234 plays</div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteSong(song._id)}
                          className="rounded-md border active:scale-95 border-white/20 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-semibold">Your Playlists</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden border border-white/10"
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative p-4 flex flex-col justify-end h-40">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">
                            Playlist {idx + 1}
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Artist;
