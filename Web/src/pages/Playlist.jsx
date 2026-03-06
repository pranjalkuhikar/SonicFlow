import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import {
  useGetArtistPlayListByIdQuery,
  useGetUserPlayListByIdQuery,
  useAddSongToArtistPlayListMutation,
  useRemoveSongToArtistPlayListMutation,
  useAddSongToUserPlayListMutation,
  useRemoveSongToUserPlayListMutation,
  useDeleteArtistPlayListMutation,
  useDeleteUserPlayListMutation,
  useGetSongsQuery,
  useSearchSongsQuery,
} from "../services/songApi";
import { useProfileQuery, useLogoutMutation, authApi } from "../services/authApi";
import SidebarLayout from "../components/SidebarLayout";
import { useDispatch } from "react-redux";
import { resetAvatarColor } from "../features/ui/uiSlice";

const PlaylistPage = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const type = params.get("type") === "artist" ? "artist" : "user";
  const { data: user } = useProfileQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const {
    data: playlistData,
    isFetching: loadingPlaylist,
    refetch: refetchPlaylist,
  } =
    type === "artist"
      ? useGetArtistPlayListByIdQuery(id, { skip: !id })
      : useGetUserPlayListByIdQuery(id, { skip: !id });

  const playlist = playlistData?.playList;

  const { data: songsData } = useGetSongsQuery();
  const allSongs = songsData?.songs ?? [];
  const playlistSongs = useMemo(() => {
    if (!playlist?.songs) return [];
    const ids = new Set(playlist.songs);
    return allSongs.filter((song) => ids.has(song._id));
  }, [playlist, allSongs]);

  const shouldSearch = searchTerm.trim().length > 1;
  const { data: searchResults } = useSearchSongsQuery(searchTerm.trim(), {
    skip: !shouldSearch,
  });
  const foundSongs = searchResults?.songs ?? [];

  const [addSongToArtist] = useAddSongToArtistPlayListMutation();
  const [removeSongFromArtist] = useRemoveSongToArtistPlayListMutation();
  const [addSongToUser] = useAddSongToUserPlayListMutation();
  const [removeSongFromUser] = useRemoveSongToUserPlayListMutation();
  const [deleteArtistPlaylist] = useDeleteArtistPlayListMutation();
  const [deleteUserPlaylist] = useDeleteUserPlayListMutation();

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

  const addSong = async (songId) => {
    if (!songId || !playlist?._id) return;
    if (
      playlist?.songs?.some(
        (id) => id === songId || id?.toString?.() === songId?.toString?.(),
      )
    ) {
      setStatus("Already in playlist.");
      return;
    }
    try {
      if (type === "artist") {
        await addSongToArtist({ playListId: playlist._id, songId }).unwrap();
      } else {
        await addSongToUser({ playListId: playlist._id, songId }).unwrap();
      }
      setStatus("Song added.");
      await refetchPlaylist();
    } catch (err) {
      const msg =
        err?.data?.message === "Song already in playlist"
          ? "Already in playlist."
          : err?.data?.message || "Unable to add song.";
      setStatus(msg);
    }
  };

  const removeSong = async (songId) => {
    if (!songId || !playlist?._id) return;
    try {
      if (type === "artist") {
        await removeSongFromArtist({ playListId: playlist._id, songId }).unwrap();
      } else {
        await removeSongFromUser({ playListId: playlist._id, songId }).unwrap();
      }
      setStatus("Song removed.");
      await refetchPlaylist();
    } catch (err) {
      setStatus(err?.data?.message || "Unable to remove song.");
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      if (type === "artist") {
        await deleteArtistPlaylist(playlist._id).unwrap();
      } else {
        await deleteUserPlaylist(playlist._id).unwrap();
      }
      navigate("/library");
    } catch (err) {
      setStatus(err?.data?.message || "Unable to delete playlist.");
    }
  };

  const isOwner =
    (type === "artist" &&
      user?.user?.role === "artist" &&
      playlist?.artist?.toString?.() === user?.user?._id) ||
    (type === "user" && user?.user?._id && playlist);

  return (
    <SidebarLayout
      user={user}
      onLogout={handleLogout}
      title={playlist ? playlist.name : "Playlist"}
      subtitle={type === "artist" ? "Public artist playlist" : "Your private playlist"}
      showSearch={false}
    >
      {status && (
        <div className="mb-4 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
          {status}
        </div>
      )}

      {loadingPlaylist ? (
        <div className="rounded-xl border border-white/10 bg-neutral-900/70 p-4 text-sm text-white/60">
          Loading playlist…
        </div>
      ) : !playlist ? (
        <div className="rounded-xl border border-white/10 bg-neutral-900/70 p-4 text-sm text-white/60">
          Playlist not found.{" "}
          <Link to="/library" className="text-white underline">
            Back to library
          </Link>
        </div>
      ) : (
        <>
          {isOwner && (
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDeletePlaylist}
                className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20"
              >
                Delete playlist
              </button>
            </div>
          )}

          {isOwner && (
            <div className="mb-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Add songs by name</p>
                  <p className="text-xs text-white/60">
                    Search songs then add them to this playlist.
                  </p>
                </div>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search songs"
                className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm outline-none placeholder:text-white/60 focus:border-white/60"
              />
              {shouldSearch && (
                <div className="space-y-2">
                  {foundSongs.length === 0 && (
                    <div className="text-xs text-white/60">No matches.</div>
                  )}
                  {foundSongs.slice(0, 6).map((song) => (
                    <div
                      key={song._id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <div>
                        <div className="text-sm font-semibold">{song.title}</div>
                        <div className="text-xs text-white/60">{song.artist}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSong(song._id)}
                        className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Songs in this playlist</h2>
            {playlistSongs.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 text-sm text-white/60">
                No songs yet.
              </div>
            ) : (
              <div className="space-y-3">
                {playlistSongs.map((song) => (
                  <div
                    key={song._id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-xl font-semibold text-white">{song.title}</div>
                      <div className="truncate text-base text-white/70">{song.artist}</div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Link
                        to={`/song/${song._id}`}
                        className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                      >
                        View
                      </Link>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => removeSong(song._id)}
                          className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </SidebarLayout>
  );
};

export default PlaylistPage;
