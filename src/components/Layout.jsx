import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Layout() {
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (error || !data) return;

      setAvatarUrl(data.avatar_url);

      if (data.username) {
        const nameParts = data.username.trim().split(" ");
        const first = nameParts[0]?.[0] || "";
        const second = nameParts[1]?.[0] || "";
        setInitials((first + second).toUpperCase());
      }
    };

    loadProfile();
  }, []);

  return (
    <SidebarProvider>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <AppSidebar />
      </div>

      <div className="flex flex-col min-h-screen bg-neutral-800 text-white w-full">

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-center px-8 py-4 sticky top-0 z-50 backdrop-blur-md bg-neutral-900/10 border-b border-white/10">
          <Navbar />

          <div className="absolute right-8">
            <Avatar
              className="cursor-pointer hover:ring-2 hover:ring-red-500 transition"
              size="lg"
              onClick={() => navigate("/profile")}
            >
              {avatarUrl && <AvatarImage src={avatarUrl} alt={`${initials} avatar`} />}

              <AvatarFallback>
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 container">
          <div className="p-4 md:hidden">
            <SidebarTrigger />
          </div>

          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}