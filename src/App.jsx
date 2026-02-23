import { Routes, Route, Navigate } from "react-router-dom";

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
import Login from "./pages/Login";
import Rules from "./pages/Rules";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import PublicOnly from "./components/PublicOnly";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />

      {/* Authenticated but no username yet */}
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

      {/* Fully onboarded users */}
      <Route
        path="/"
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
        <Route path="groups/:id" element={<GroupDetail />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="profile" element={<Profile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="rules" element={<Rules />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
