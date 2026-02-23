import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [initials, setInitials] = useState("");

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Predict", path: "/predict" },
    { label: "Drivers", path: "/drivers" },
    { label: "Groups", path: "/groups" },
    { label: "Leaderboard", path: "/leaderboard" },
  ];

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

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // ✅ REAL logout
    navigate("/login");

    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar className="bg-neutral-950 border-r border-zinc-800 text-white">
      {/* Header */}
      <SidebarHeader className="px-6 py-6 border-b border-zinc-800">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-red-500">F1</span> Prediction
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => handleNavigate(item.path)}
                    className={`
                      w-full justify-start rounded-xl px-4 py-3 text-sm font-medium transition-all
                      ${
                        isActive
                          ? "bg-red-600 text-white shadow-md"
                          : "hover:bg-zinc-800 text-zinc-300"
                      }
                    `}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="mt-auto border-t border-zinc-800 p-4 space-y-3">
        {/* Profile */}
        <div
          onClick={() => handleNavigate("/profile")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 cursor-pointer transition"
        >
          <Avatar>
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={`${initials} avatar`} />
            )}
            <AvatarFallback>
              {initials || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="text-sm">
            <div className="font-medium text-white">
              {initials ? "" : ""}
            </div>
            <div className="text-xs text-zinc-400">View Profile</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-600/10 transition"
        >
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}