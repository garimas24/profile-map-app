import React from "react";
import ProfileCard from "./ProfileCard";
import "../profiles"

function ProfileList({ profiles, onSummaryClick, onViewDetails }) {
  return (
    <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
      {profiles.map((p) => (
        <ProfileCard
          key={p.id}
          profile={p}
          onSummaryClick={onSummaryClick}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}


export default ProfileList;