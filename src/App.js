import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage";
import ProfileCard from "./components/ProfileCard";
import ProfileList from "./components/ProfileList";
import ProfileDetails from "./components/ProfileDetails";
import MapView from "./components/MapView";
import Header from "./Header";
import profiles from "./profiles";

function App() {
  // ✅ Declare state variables at the top
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profiles, setProfiles] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              profiles={profiles}
              setProfiles={setProfiles}
              onLogout={() => setIsLoggedIn(false)}
            />
          }
        />

        {/* Admin Login */}
        <Route
          path="/admin-login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <AdminLogin
                onLoginSuccess={() => setIsLoggedIn(true)}
                setProfiles={setProfiles}
              />
            )
          }
        />

        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/admin-login" />}
        />

        {/* MyProfiles (LandingPage) */}
        <Route
          path="/myprofiles"
          element={
            isLoggedIn ? (
              <LandingPage
                profiles={profiles}
                setProfiles={setProfiles}
                onLogout={() => setIsLoggedIn(false)}
              />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
        <Route path="/profile/:id" element={<ProfileDetails />} />
        <Route path="/profilecard" element={<ProfileCard />} />
        <Route
          path="/profilelist"
          element={<ProfileList profiles={profiles} />}
        />
        <Route path="/mapview" element={<MapView />} />
        <Route path="/header" element={<Header />} />
      </Routes>
    </Router>
  );
}

export default App;
