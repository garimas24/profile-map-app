import React from "react";

function ProfileCard({ profile, onSummaryClick, onViewDetails }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "default",
      }}
    >
      <img
        src={profile.photo}
        alt={profile.name}
        style={{ width: 80, height: 80, borderRadius: "50%", cursor: "pointer" }}
        onClick={() => onViewDetails(profile.id)}
      />
      <div style={{ flexGrow: 1 }}>
        <h3
          onClick={() => onViewDetails(profile.id)}
          style={{ margin: 0, cursor: "pointer", color: "#007bff" }}
        >
          {profile.name}
        </h3>
        <p style={{ margin: "4px 0" }}>{profile.description}</p>
        <small>Location: {profile.location}</small>
      </div>
      <button onClick={() => onSummaryClick(profile)}>Summary</button>
    </div>
  );
}


export default ProfileCard;