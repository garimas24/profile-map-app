import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    description: "",
    pincode: "",
    latitude: "",
    longitude: "",
    photo: null,
  });
  const [message, setMessage] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const hasLoadedProfiles = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("profiles");
    if (stored) {
      setProfiles(JSON.parse(stored));
    }
    hasLoadedProfiles.current = true;
  }, []);

  useEffect(() => {
    if (hasLoadedProfiles.current && profiles.length > 0) {
      localStorage.setItem("profiles", JSON.stringify(profiles));
    }
  }, [profiles]);

  useEffect(() => {
    if (editingProfile) {
      setFormData(editingProfile);
    } else {
      setFormData({
        name: "",
        email: "",
        location: "",
        description: "",
        pincode: "",
        latitude: "",
        longitude: "",
        photo: null,
      });
    }
  }, [editingProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = async () => {
    if (!formData.pincode.trim()) {
      alert("Please enter a valid pincode");
      return;
    }

    setLoadingLocation(true);
    setError(null);

    try {
      const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(
        formData.pincode
      )}&countrycodes=IN&format=json&limit=1`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "AdminDashboardApp/1.0 (+your-email@example.com)",
          "Accept-Language": "en",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch location");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("Location not found for this pincode");
      }

      const place = data[0];

      setFormData((prev) => ({
        ...prev,
        location: place.display_name || "",
        latitude: place.lat || "",
        longitude: place.lon || "",
      }));

      setMessage("Location fetched successfully");
    } catch (err) {
      console.error(err);
      setError("Could not fetch location for the given pincode");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (editingProfile) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === editingProfile.id ? { ...formData, id: p.id } : p
        )
      );
      setMessage("Profile updated successfully");
    } else {
      const newProfile = {
        ...formData,
        id: Date.now(),
      };
      setProfiles((prev) => [...prev, newProfile]);
      setMessage("Profile added successfully");
    }

    setEditingProfile(null);
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      setMessage("Profile deleted");
      if (editingProfile && editingProfile.id === id) {
        setEditingProfile(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingProfile(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>

      {message && (
        <div style={styles.messageBox}>
          {message}
          <button onClick={() => setMessage(null)} style={styles.closeButton}>
            ✖
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            ...styles.messageBox,
            backgroundColor: "#f8d7da",
            color: "#721c24",
          }}
        >
          {error}
          <button onClick={() => setError(null)} style={styles.closeButton}>
            ✖
          </button>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={{ marginBottom: 15 }}>
          {editingProfile ? "Edit Profile" : "Add New Profile"}
        </h3>

        <label style={styles.label}>
          Name:
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Email:
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
          />
        </label>

        <label style={styles.label}>
          Pincode:
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <button
          type="button"
          onClick={handleGetLocation}
          style={styles.locationButton}
        >
          {loadingLocation ? "Fetching..." : "Get Location"}
        </button>

        <label style={styles.label}>
          Location:
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={styles.input}
            disabled
          />
        </label>

        <label style={styles.label}>
          Latitude:
          <input
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            style={styles.input}
            disabled
          />
        </label>

        <label style={styles.label}>
          Longitude:
          <input
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            style={styles.input}
            disabled
          />
        </label>

        <label style={styles.label}>
          Photo:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.input}
          />
        </label>

        {formData.photo && (
          <div style={styles.imagePreview}>
            <img
              src={formData.photo}
              alt="Preview"
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            {editingProfile ? "Update Profile" : "Add Profile"}
          </button>
          {editingProfile && (
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={styles.container1}>
        <h2 style={styles.heading}> Profile</h2>

        <div style={styles.topBar}>
          <button
            onClick={() => navigate("/myprofiles")}
            style={styles.navButton}
          >
            Go to My Profiles
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Photo</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Lat</th>
              <th style={styles.th}>Lng</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  No profiles found
                </td>
              </tr>
            ) : (
              profiles.map((profile) => (
                <tr
                  key={profile.id}
                  onClick={() => handleEdit(profile)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={styles.td}>
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt="Profile"
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    ) : (
                      "No Photo"
                    )}
                  </td>
                  <td style={styles.td}>{profile.name}</td>
                  <td style={styles.td}>{profile.location}</td>
                  <td style={styles.td}>{profile.latitude}</td>
                  <td style={styles.td}>{profile.longitude}</td>
                  <td style={styles.td}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(profile);
                      }}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(profile.id);
                      }}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container1: {
    marginBottom: 30,
    border: "1px solid #ccc",
    padding: 20,
    borderRadius: 6,
    maxWidth: 600,
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    right: 0,
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    borderRadius: 6,
    overflow: "hidden",
  },

  th: {
    border: "1px solid #ccc",
    padding: 12,
    backgroundColor: "#f8f9fa",
    fontWeight: "600",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  },

  td: {
    border: "1px solid #ccc",
    padding: 12,
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontWeight: "400",
  },

  heading: {
    marginBottom: 20,
  },
  messageBox: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "10px 15px",
    marginBottom: "20px",
    borderRadius: 4,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    border: "none",
    background: "transparent",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
  },
  topBar: {
    marginBottom: 20,
  },
  navButton: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: 4,
    color: "white",
    cursor: "pointer",
  },

  form: {
    marginBottom: 30,
    border: "1px solid #ccc",
    padding: 20,
    borderRadius: 6,
    maxWidth: 600,
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },

  label: {
    display: "block",
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 8,
    marginTop: 5,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    height: 60,
    padding: 8,
    marginTop: 5,
    borderRadius: 4,
    border: "1px solid #ccc",
    resize: "vertical",
  },
  locationButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginBottom: 10,
  },
  imagePreview: {
    marginBottom: 10,
  },
  buttonGroup: {
    display: "flex",
    gap: 10,
  },
  submitButton: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    fontStyle: "italic",
    color: "#888",
  },
  editButton: {
    padding: "4px 8px",
    marginRight: 5,
    backgroundColor: "#ffc107",
    border: "none",
    color: "black",
    borderRadius: 4,
    cursor: "pointer",
  },
  deleteButton: {
    padding: "4px 8px",
    backgroundColor: "#dc3545",
    border: "none",
    color: "white",
    borderRadius: 4,
    cursor: "pointer",
  },
  noData: {
    textAlign: "center",
    padding: 20,
  },
};
