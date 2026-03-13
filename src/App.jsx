import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import UsernameGuard from "./components/UsernameGuard";
import NoUsernameOnly from "./components/NoUsernameOnly";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Groups from "./pages/Groups";
import Prediction from "./pages/Prediction";
import Leaderboard from "./pages/Leaderboard";
import Drivers from "./pages/Drivers";
import Profile from "./pages/Profile";
import GroupDetail from "./pages/GroupDetail";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import Login from "./pages/Login";
import Rules from "./pages/Rules";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import LandingPage from "./pages/LandingPage";
import PublicOnly from "./components/PublicOnly";

function App() {
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    console.debug("[stability] App mounted");
    return () => {
      console.debug("[stability] App unmounted");
    };
  }, []);

  return (
    <Routes>
      {/* Public: Landing page — redirects to /home if authenticated */}
      <Route
        path="/"
        element={
          <PublicOnly>
            <LandingPage />
          </PublicOnly>
        }
      />

      {/* Public: Login page */}
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />

      <Route path="/join/:inviteToken" element={<JoinGroup />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <NoUsernameOnly>
              <Onboarding />
            </NoUsernameOnly>
          </ProtectedRoute>
        }
      />

      {/* Protected app routes — all under /home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <UsernameGuard>
              <Layout />
            </UsernameGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="predict" element={<Prediction />} />
        <Route path="groups" element={<Groups />} />
        <Route path="groups/create" element={<CreateGroup />} />
        <Route path="groups/:groupId" element={<GroupDetail />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="profile" element={<Profile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="rules" element={<Rules />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
