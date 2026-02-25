import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signIn, signUp, signInWithGoogle } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const sanitizeRedirectPath = (path) => {
  if (typeof path !== "string" || path.length === 0) return "/";
  if (!path.startsWith("/")) return "/";
  if (path.startsWith("//")) return "/";
  return path;
};

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading: authLoading } = useAuth();
  const [formLoading, setFormLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTarget = useMemo(
    () => sanitizeRedirectPath(searchParams.get("redirect")),
    [searchParams],
  );

  useEffect(() => {
    setError("");
    setUsername("");
  }, [isLogin]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formLoading) return;

    setError("");
    setFormLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate(redirectTarget, { replace: true });
        return;
      }

      if (!username.trim()) {
        throw new Error("Username is required");
      }

      const result = await signUp(email, password, username);

      if (result.status === "authenticated") {
        navigate(redirectTarget, { replace: true });
        return;
      }

      if (result.status === "pending_confirmation") {
        setError("Check your email to confirm your account.");
      }
    } catch (err) {
      setError(err.message || "Unable to authenticate.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;

    setError("");
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle(redirectTarget);
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-b-3xl overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.15)] border border-zinc-800">
        <div className="hidden md:flex flex-col justify-between p-14 bg-gradient-to-br from-red-600 via-red-700 to-black relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Own the Grid.
              <br />
              <span className="text-white/90">Predict Like a Pro.</span>
            </h1>

            <p className="mt-6 text-zinc-200 text-lg max-w-sm">
              Pick podiums. Earn points. Dominate the leaderboard.
            </p>
          </div>

          <div className="relative z-10 text-sm text-zinc-300">(c) 2026 F1 Prediction Game</div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-zinc-400 text-sm">
              {isLogin
                ? "Log in to continue predicting."
                : "Join the grid and start climbing."}
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 mb-6 bg-white text-black rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.2 0 6 1.1 8.2 3.3l6.1-6.1C34.3 2.5 29.6 0 24 0 14.6 0 6.6 5.8 2.9 14.1l7.3 5.7C12.3 13.1 17.7 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.5 5.8c4.4-4.1 7.2-10.1 7.2-17.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.2 28.8c-.6-1.8-1-3.7-1-5.8s.3-4 1-5.8l-7.3-5.7C1 15.5 0 19.6 0 24s1 8.5 2.9 12.5l7.3-5.7z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 12-2.1 16-5.7l-7.5-5.8c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.7-3.6-13.8-8.8l-7.3 5.7C6.6 42.2 14.6 48 24 48z"
              />
            </svg>
            {isGoogleLoading ? "Loading..." : "Continue with Google"}
          </button>

          <div className="relative flex items-center mb-6">
            <div className="grow border-t border-zinc-700"></div>
            <span className="px-4 text-xs text-zinc-500 uppercase tracking-widest">or</span>
            <div className="grow border-t border-zinc-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div
              role="status"
              aria-live="assertive"
              aria-atomic="true"
              className="text-red-500 text-sm min-h-[1.5rem]"
            >
              {error}
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-60"
            >
              {formLoading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-sm text-zinc-400 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-red-500 hover:text-red-400 font-medium transition"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


