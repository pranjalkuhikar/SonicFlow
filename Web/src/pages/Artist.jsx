import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  authApi,
  useProfileQuery,
  useLogoutMutation,
} from "../services/authApi";
import AddSongModal from "../components/AddSongModal";
import AvatarMenu from "../components/AvatarMenu";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Artist = () => {
  const { data: user } = useProfileQuery();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
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

  const handleSongSubmit = (songData) => {
    console.log("Submitting song", songData);
    setShowModal(false);
  };
  useEffect(() => {
    if (user && user.user.role !== "artist") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <Navbar>
          <button
            type="button"
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
            onClick={() => setShowModal(true)}
          >
            Add Song
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
          >
            Home
          </button>
          {user && <AvatarMenu user={user.user} onLogout={handleLogout} />}
        </Navbar>
        <AddSongModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSongSubmit}
        />

        <section className="px-6 md:px-10 py-6">
          <div className="max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-semibold">Artist Dashboard</h1>
                <p className="mt-2 text-neutral-400">
                  Manage your songs and playlists.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              >
                Create Playlist
              </button>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-semibold">Your Songs</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-neutral-950 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-16 rounded-lg border border-white/10 bg-white/10" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Song Title</div>
                        <div className="text-xs text-white/60">Album Name</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-white/60">1,234 plays</div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
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
