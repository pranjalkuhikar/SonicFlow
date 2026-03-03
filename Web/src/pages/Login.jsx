import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlerSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
        <div
          className="relative p-10 lg:p-12"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 0%, #A855F7 0%, #7C3AED 30%, #3B0764 60%, #0B0B0B 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-30 mix-blend-overlay" />
          <div className="relative h-full flex flex-col justify-end gap-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                <span className="inline-block size-2 rounded-full bg-white" />
                <span>SonicFlow</span>
              </div>
              <h1 className="mt-4 text-3xl lg:text-4xl font-semibold">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm opacity-90">
                Sign in to continue listening.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-950 p-8 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <div>
              <h2 className="text-2xl font-semibold">Log In</h2>
              <p className="mt-2 text-sm text-neutral-400">
                Enter your credentials to access your account.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800"
              >
                <span className="inline-block size-4 rounded bg-white" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800"
              >
                <span className="inline-block size-4 rounded bg-white" />
                <span>Github</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-3 text-neutral-500">
              <div className="h-px flex-1 bg-neutral-800" />
              <span className="text-xs">Or</span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>

            <form onSubmit={handlerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  placeholder="eg. johnfrans@gmail.com"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                className="mt-2 w-full rounded-lg bg-white text-black font-semibold py-2 hover:bg-neutral-200"
              >
                Sign In
              </button>

              <p className="mt-4 text-sm text-neutral-400">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-white font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
