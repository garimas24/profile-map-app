import {useState, useMemo} from "react";
import profiles from "./profiles";
import { useNavigate } from "react-router-dom";


function Header({ onSearch, onFilter }) {
    const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterLocation(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <header
      style={{
        padding: 16,
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 20 }}>MyProfiles</div>

      {/* <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
      /> */}
      {/* <select value={filterLocation} onChange={handleFilterChange}>
        <option value="">All Locations</option>
        {[...new Set(profiles.map((p) => p.location))].map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select> */}

      <button
        onClick={() => navigate("/admin-login")}
        style={{ marginLeft: "auto" }}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
