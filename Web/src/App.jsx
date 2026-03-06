import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Artist from "./pages/Artist.jsx";
import Song from "./pages/Song.jsx";
import Library from "./pages/Library.jsx";
import CreatePlaylist from "./pages/CreatePlaylist.jsx";
import Playlist from "./pages/Playlist.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/song/:id" element={<Song />} />
        <Route path="/library" element={<Library />} />
        <Route path="/playlists/new" element={<CreatePlaylist />} />
        <Route path="/playlists/:id" element={<Playlist />} />
      </Routes>
    </div>
  );
};

export default App;
