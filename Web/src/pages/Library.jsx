import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Library, ListMusic, LockKeyhole, Plus } from "lucide-react";
import {
  authApi,
  useLogoutMutation,
  useProfileQuery,
} from "../services/authApi";
import { resetAvatarColor } from "../features/ui/uiSlice";
import {
  useGetArtistPlayListQuery,
  useGetUserPlayListQuery,
} from "../services/songApi";
import SidebarLayout from "../components/SidebarLayout";

const LibraryPage = () => {
  const navigate = useNavigate();
  const { data: user } = useProfileQuery();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const {
    data: artistPlaylists,
    isFetching: loadingArtist,
    refetch: refetchArtist,
  } = useGetArtistPlayListQuery();

  const {
    data: userPlaylists,
    isFetching: loadingUser,
    refetch: refetchUser,
  } = useGetUserPlayListQuery(undefined, { skip: !user });

  const canCreateArtistPlaylist = user?.user?.role === "artist";
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

  return (
    <SidebarLayout
      user={user}
      onLogout={handleLogout}
      title="Library"
      subtitle="Explore public artist playlists and your own saved sets."
      headerExtras={
        <button
          type="button"
          onClick={() => navigate("/playlists/new")}
          className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
        >
          <Plus className="h-4 w-4" />
          New playlist
        </button>
      }
      showSearch
    >
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Library className="h-4 w-4 text-white/60" />
          <h2 className="text-lg font-semibold">Artist playlists (public)</h2>
        </div>
        {loadingArtist ? (
          <div className="rounded-xl border border-white/10 bg-neutral-950/70 p-4 text-sm text-white/60">
            Loading playlists…
          </div>
        ) : (artistPlaylists?.playLists ?? []).length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-neutral-950/70 p-4 text-sm text-white/60">
            No artist playlists published yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {artistPlaylists.playLists.map((playlist) => (
              <div
                key={playlist._id}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/40 p-4"
              >
                <div className="flex h-full flex-col justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{playlist.name}</div>
                    <div className="text-xs text-white/60">
                      {playlist.songs?.length ?? 0} tracks
                    </div>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50">
                    Public
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 text-xs text-white/60">
          <button
            type="button"
            onClick={() => refetchArtist()}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-1 hover:bg-white/20"
          >
            Refresh
          </button>
          {canCreateArtistPlaylist && (
            <button
              type="button"
              onClick={() => navigate("/playlists/new?type=artist")}
              className="rounded-md border border-white/20 bg-white/10 px-3 py-1 hover:bg-white/20"
            >
              Publish new (artist)
            </button>
          )}
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <div className="flex items-center gap-2">
          <ListMusic className="h-4 w-4 text-white/60" />
          <h2 className="text-lg font-semibold">My playlists</h2>
        </div>
        {!user && (
          <div className="rounded-xl border border-white/10 bg-neutral-950/70 p-4 text-sm text-white/70">
            Log in to see your private playlists.{" "}
            <Link to="/login" className="font-semibold underline">
              Go to login
            </Link>
            .
          </div>
        )}
        {user && loadingUser && (
          <div className="rounded-xl border border-white/10 bg-neutral-950/70 p-4 text-sm text-white/60">
            Loading your playlists…
          </div>
        )}
        {user && !loadingUser && (userPlaylists?.playLists ?? []).length === 0 && (
          <div className="rounded-xl border border-white/10 bg-neutral-950/70 p-4 text-sm text-white/70">
            You do not have any playlists yet. Create one to start saving songs.
          </div>
        )}
        {user && (userPlaylists?.playLists ?? []).length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {userPlaylists.playLists.map((playlist) => (
              <div
                key={playlist._id}
                className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4"
              >
                <div className="flex h-full flex-col justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{playlist.name}</div>
                    <div className="text-xs text-white/60">
                      {playlist.songs?.length ?? 0} tracks
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/50">
                    <LockKeyhole className="h-3 w-3" />
                    <span>Private to you</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {user && (
          <div className="flex gap-2 text-xs text-white/60">
            <button
              type="button"
              onClick={() => refetchUser()}
              className="rounded-md border border-white/20 bg-white/10 px-3 py-1 hover:bg-white/20"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => navigate("/playlists/new")}
              className="rounded-md border border-white/20 bg-white/10 px-3 py-1 hover:bg-white/20"
            >
              Create new
            </button>
          </div>
        )}
      </section>
    </SidebarLayout>
  );
};

export default LibraryPage;
