
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import ProfileList from "./ProfileList";
import MapView from "./MapView";

function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [highlightedProfile, setHighlightedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("profiles");
    if (stored) setProfiles(JSON.parse(stored));

    const adminUser = localStorage.getItem("adminUser");
    setIsAdminLoggedIn(!!adminUser);
  }, []);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterLocation ? p.location === filterLocation : true;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterLocation, profiles]);

  const handleSummaryClick = (profile) => {
    setHighlightedProfile(profile);
  };

  const handleViewDetails = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleAdminButtonClick = () => {
    if (isAdminLoggedIn) {
      localStorage.removeItem("adminUser");
      setIsAdminLoggedIn(false);
      navigate("/");
      window.location.reload();
    } else {
      navigate("/admin-login");
    }
  };

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(profiles.map((p) => p.location))).filter(Boolean);
  }, [profiles]);

  return (
    <div style={{ padding: "24px", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "1px solid #ddd"
      }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", color: "#333" }}>Profile Explorer</h1>
        <button
          onClick={handleAdminButtonClick}
          style={{
            padding: "10px 20px",
            backgroundColor: isAdminLoggedIn ? "#dc3545" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s"
          }}
        >
          {isAdminLoggedIn ? "Logout" : "Admin Login"}
        </button>
      </header>

      {/* Controls */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "24px"
      }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flexGrow: 1,
            minWidth: "220px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          style={{
            padding: "10px",
            minWidth: "200px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Main Section */}
      <main style={{
        display: "flex",
        flexDirection: "row",
        gap: "24px",
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>
        {/* Profile List */}
        <section style={{
          flex: 1,
          minWidth: "300px"
        }}>
          <ProfileList
            profiles={filteredProfiles}
            onSummaryClick={handleSummaryClick}
            onViewDetails={handleViewDetails}
          />
        </section>

        {/* Map View */}
        <section style={{
          flexBasis: "600px",
          flexShrink: 0,
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <MapView
            profiles={filteredProfiles}
            highlightedProfile={highlightedProfile}
          />
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
