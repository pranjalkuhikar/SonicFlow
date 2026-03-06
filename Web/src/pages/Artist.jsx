import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import {
  authApi,
  useLogoutMutation,
  useProfileQuery,
} from "../services/authApi";
import {
  useAddSongMutation,
  useGetSongsQuery,
  useDeleteSongMutation,
  useGetArtistPlayListQuery,
} from "../services/songApi";
import AddSongModal from "../components/AddSongModal";
import SidebarLayout from "../components/SidebarLayout";
import { resetAvatarColor } from "../features/ui/uiSlice";

const Artist = () => {
  const { data: user, isFetching, isError } = useProfileQuery();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const [addSong] = useAddSongMutation();
  const { data } = useGetSongsQuery(user?.user?._id, {
    skip: !user?.user?._id,
  });
  const [deleteSong] = useDeleteSongMutation();
  const { data: artistPlaylists, refetch: refetchArtistPlaylists } =
    useGetArtistPlayListQuery(user?.user?._id, {
      skip: !user?.user?._id,
    });

  const [playingSongId, setPlayingSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

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
    if (isFetching) return;
    if (!user || user.user.role !== "artist") {
      navigate("/");
    }
  }, [user, isFetching, navigate]);

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <span className="text-xs uppercase tracking-[0.3em]">
          Checking access…
        </span>
      </div>
    );
  }

  if (isError || !user || user.user.role !== "artist") {
    return null;
  }

  return (
    <SidebarLayout
      user={user}
      onLogout={handleLogout}
      title="Artist Dashboard"
      subtitle="Upload tracks, manage releases, and curate public playlists."
      headerExtras={
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Add Song
        </button>
      }
    >
      <AddSongModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSongSubmit}
      />

      <section>
        <h2 className="text-xl font-semibold">Your Songs</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                      className="size-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{song.title}</div>
                    <div className="text-xs text-white/60">{song.artist}</div>
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
                <div className="text-xs text-white/60">
                  {song?.plays ?? "—"} plays
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteSong(song._id)}
                    className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(data?.songs ?? []).length === 0 && (
            <div className="col-span-full rounded-xl border border-white/10 bg-neutral-950/70 p-6 text-sm text-white/60">
              You have not uploaded songs yet.
            </div>
          )}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Your Playlists</h2>
            <p className="text-xs text-white/60">
              Public playlists that any listener can see.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/playlists/new?type=artist")}
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
          >
            Create Playlist
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {(artistPlaylists?.playLists ?? []).map((playlist) => (
            <div
              key={playlist._id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/40 p-4"
            >
              <div className="flex h-full flex-col justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{playlist.name}</div>
                  <div className="text-xs text-white/60">
                    {playlist.songs?.length ?? 0} tracks
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/60">
                  <span>Public</span>
                  <button
                    type="button"
                    onClick={() => refetchArtistPlaylists()}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold hover:bg-white/20"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(artistPlaylists?.playLists ?? []).length === 0 && (
            <div className="col-span-full rounded-xl border border-white/10 bg-neutral-950/70 p-6 text-sm text-white/60">
              No playlists yet. Create one to showcase your releases.
            </div>
          )}
        </div>
      </section>
    </SidebarLayout>
  );
};

export default Artist;
