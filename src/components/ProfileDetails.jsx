import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "./MapView"; // <-- Make sure this import path is correct

function ProfileDetails() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("profiles")) || [];
    const found = stored.find((p) => p.id.toString() === id);
    setProfile(found);
  }, [id]);

  if (!profile) return <p style={{ padding: 20 }}>Profile not found</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Row: Photo + Details */}
        <div style={styles.row}>
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} style={styles.image} />
          ) : (
            <div style={styles.placeholder}>No Photo</div>
          )}
          <div style={styles.details}>
            <h2 style={styles.name}>{profile.name}</h2>
            <p style={styles.text}><strong>Email:</strong> {profile.email}</p>
            <p style={styles.text}><strong>Location:</strong> {profile.location}</p>
            <p style={styles.text}><strong>Description:</strong> {profile.description}</p>
            <p style={styles.text}><strong>Pincode:</strong> {profile.pincode}</p>
            <p style={styles.text}><strong>Latitude:</strong> {profile.latitude}</p>
            <p style={styles.text}><strong>Longitude:</strong> {profile.longitude}</p>
          </div>
        </div>

        {/* Full-width MapView below */}
        <div style={styles.mapContainer}>
          <MapView highlightedProfile={profile} profiles={[]} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh", // ensures no vertical overflow
    overflow: "hidden", // disables scrollbar
    display: "flex",
    justifyContent: "center",
    alignItems: "center", // center content vertically
    backgroundColor: "#f9f9f9",
  },
  card: {
    display: "flex",
    flexDirection: "column", // stacking content vertically
    gap: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    maxWidth: 800,
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row", // photo and details side by side
    alignItems: "flex-start", // ensure vertical alignment from top
    gap: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    objectFit: "cover",
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontSize: 16,
  },
  details: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  name: {
    fontSize: 20,
    margin: "0 0 8px 0",
  },
  text: {
    fontSize: 14,
    margin: "2px 0",
  },
  mapContainer: {
    width: "100%",
    height: 300, // adjust as needed
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
};

export default ProfileDetails;

