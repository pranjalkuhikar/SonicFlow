import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Music2, ShieldCheck, UserRound } from "lucide-react";
import {
  authApi,
  useLogoutMutation,
  useProfileQuery,
} from "../services/authApi";
import {
  useCreateArtistPlayListMutation,
  useCreateUserPlayListMutation,
} from "../services/songApi";
import SidebarLayout from "../components/SidebarLayout";
import { resetAvatarColor } from "../features/ui/uiSlice";

const CreatePlaylist = () => {
  const { data: user } = useProfileQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const isArtist = user?.user?.role === "artist";

  const defaultType = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("type") === "artist" ? "artist" : "user";
  }, [location.search]);

  const [playlistType, setPlaylistType] = useState(defaultType);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const [createUserPlaylist, { isLoading: creatingUser }] =
    useCreateUserPlayListMutation();
  const [createArtistPlaylist, { isLoading: creatingArtist }] =
    useCreateArtistPlayListMutation();

  useEffect(() => {
    if (isArtist) {
      setPlaylistType("artist");
    } else {
      setPlaylistType("user");
    }
  }, [isArtist]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setStatus("Please log in to create a playlist.");
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      setStatus("Please provide a playlist name.");
      return;
    }
    try {
      if (playlistType === "artist" && user?.user?.role === "artist") {
        await createArtistPlaylist({
          name: trimmed,
          artistName: `${user.user.firstName} ${user.user.lastName ?? ""}`.trim(),
        }).unwrap();
        setStatus("Artist playlist created and visible to everyone.");
      } else {
        await createUserPlaylist({ name: trimmed }).unwrap();
        setStatus("Private playlist created for your account.");
      }
      setName("");
      setTimeout(() => navigate("/library"), 500);
    } catch (err) {
      setStatus(err?.data?.message || "Unable to create playlist.");
    }
  };

  const gridCols = "md:grid-cols-1";

  return (
    <SidebarLayout
      user={user}
      onLogout={handleLogout}
      title="Create playlist"
      subtitle="Artist playlists are public; user playlists are private to your account."
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-neutral-950/70 p-6 shadow-lg"
      >
        {!user && (
          <div className="mb-4 rounded-lg border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            You need to log in before creating a playlist.
          </div>
        )}
        <div className={`grid gap-4 ${gridCols}`}>
          {!isArtist && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <input
                type="radio"
                className="mt-1"
                name="playlistType"
                value="user"
                checked={playlistType === "user"}
                onChange={() => setPlaylistType("user")}
              />
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <UserRound className="h-4 w-4" />
                  User playlist
                </div>
                <p className="mt-1 text-xs text-white/70">
                  Private playlists tied to your login. Only you can see them.
                </p>
              </div>
            </label>
          )}

          {isArtist && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <input
                type="radio"
                className="mt-1"
                name="playlistType"
                value="artist"
                checked={playlistType === "artist"}
                onChange={() => setPlaylistType("artist")}
              />
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Artist playlist
                </div>
                <p className="mt-1 text-xs text-white/70">
                  Public playlists under your artist profile. Visible to all
                  listeners.
                </p>
              </div>
            </label>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-semibold">Playlist name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Chill evenings, Road trip vibes…"
            className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/60 focus:border-white/60"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-neutral-200"
            disabled={creatingUser || creatingArtist}
          >
            <Music2 className="h-4 w-4" />
            {creatingUser || creatingArtist ? "Creating..." : "Create playlist"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/library")}
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
          >
            Cancel
          </button>
          {status && <span className="text-xs text-white/70">{status}</span>}
        </div>
      </form>
    </SidebarLayout>
  );
};

export default CreatePlaylist;
