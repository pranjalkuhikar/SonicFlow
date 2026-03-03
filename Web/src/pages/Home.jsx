import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-3xl w-full px-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-10 text-center shadow-2xl">
          <h1 className="text-4xl font-semibold">SonicFlow</h1>
          <p className="mt-3 text-neutral-400">
            Stream and manage your music with a clean, modern UI.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-white text-black font-semibold px-5 py-2 hover:bg-neutral-200"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-5 py-2 hover:bg-neutral-800"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
