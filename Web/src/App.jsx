import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Artist from "./pages/Artist.jsx";
import Song from "./pages/Song.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artist" element={<Artist />} />
          <Route path="/song/:id" element={<Song />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
