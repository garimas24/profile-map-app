import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to update map view on lat/lng changes
function ChangeMapView({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !isNaN(lat) &&
      !isNaN(lng)
    ) {
      map.setView([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
}

export default function MapView({ profiles = [], highlightedProfile }) {
  const defaultPosition = [39.8283, -98.5795]; // Center of US

  // State for location from localStorage
  const [storedLocation, setStoredLocation] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('profileLocation');
    if (storedData) {
      try {
        const locationObj = JSON.parse(storedData);
        if (
          typeof locationObj.latitude === 'number' &&
          typeof locationObj.longitude === 'number'
        ) {
          setStoredLocation([locationObj.latitude, locationObj.longitude]);
        }
      } catch (err) {
        console.error('Error parsing stored location', err);
      }
    }
  }, []);

  // Helper: get latlng from profile safely
  const getLatLngFromProfile = (profile) => {
    const lat = Number(profile.latitude);
    const lng = Number(profile.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
    return null;
  };

  // Map center preference: highlightedProfile > storedLocation > defaultPosition
  const mapCenter = (() => {
    if (highlightedProfile) {
      const coords = getLatLngFromProfile(highlightedProfile);
      if (coords) return coords;
    }
    if (storedLocation) return storedLocation;
    return defaultPosition;
  })();

  return (
    <div style={{ height: '600px', width: '100%', marginTop: '20px' }}>
      {/* <h2 className="text-xl font-semibold mb-2">Profile Map View</h2> */}

      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {profiles.map((profile) => {
          const latlng = getLatLngFromProfile(profile) || defaultPosition;
          return (
            <Marker key={profile.id} position={latlng}>
              <Popup>
                <strong>{profile.name}</strong>
                <br />
                {profile.description || ''}
                <br />
                <em>{profile.address || profile.location || ''}</em>
              </Popup>
            </Marker>
          );
        })}

        {highlightedProfile && (
          <>
            <ChangeMapView
              lat={Number(highlightedProfile.latitude)}
              lng={Number(highlightedProfile.longitude)}
            />
            <Marker
              position={getLatLngFromProfile(highlightedProfile) || defaultPosition}
            >
              <Popup>
                <strong>{highlightedProfile.name}</strong>
                <br />
                {highlightedProfile.address || highlightedProfile.location || ''}
              </Popup>
            </Marker>
          </>
        )}

        {!highlightedProfile && storedLocation && (
          <>
            <ChangeMapView lat={storedLocation[0]} lng={storedLocation[1]} />
            <Marker position={storedLocation}>
              <Popup>
                <strong>Your Location</strong>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
