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

      // Build upsert payload - only include avatar_url if it was provided
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-10 rounded-3xl space-y-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Complete Your Profile</h2>
          <p className="text-zinc-400 text-sm">
            Choose a username and add a profile picture (optional)
          </p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-28 h-28 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
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

          <label className="cursor-pointer text-sm bg-zinc-800 hover:bg-zinc-700 transition px-4 py-2 rounded-xl border border-zinc-700">
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
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm text-zinc-400">Username *</label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 transition rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default Onboarding;