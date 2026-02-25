import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
  };

  // Use effect to manage blob URL creation and cleanup
  useEffect(() => {
    if (!avatarFile) {
      setPreview(null);
      return;
    }

    const blobUrl = URL.createObjectURL(avatarFile);
    setPreview(blobUrl);

    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [avatarFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Not authenticated");
        return;
      }

      const trimmedUsername = username.trim();

      if (!trimmedUsername) {
        setError("Username cannot be empty");
        return;
      }

      let avatarUrl = null;

      // Upload avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `${user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            upsert: true,
          });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

    
      const profilePayload = {
        id: user.id,
        username: trimmedUsername,
      };

      if (avatarUrl) {
        profilePayload.avatar_url = avatarUrl;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profilePayload);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-10 rounded-b-3xl space-y-8 w-full max-w-md shadow-2xl shadow-black/40"
      >
        <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">Complete Your Profile</h2>
          <p className="text-zinc-400 text-sm">
            Choose a username and add a profile picture (optional)
          </p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-28 h-28 rounded-full bg-zinc-800/50 border border-zinco-700/50 flex items-center justify-center overflow-hidden shadow-lg">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-zinc-500 text-sm">No Photo</span>
            )}
          </div>

          <label className="cursor-pointer text-sm bg-zinc-800/70 hover:bg-zinc-700 transition px-4 py-3 rounded-xl border border-zinc-700 font-medium">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Username */}
        <div className="space-y-3">
          <label htmlFor="username" className="text-sm text-zinc-300 font-medium">Username *</label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-[0.99] transition-all rounded-xl font-semibold shadow-lg shadow-red-600/20 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue to Profile"}
        </button>
      </form>
    </div>
  );
}

export default Onboarding;