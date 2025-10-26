import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in some setups (especially with Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMarker = ({ onPick }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          {
            headers: {
              "User-Agent": "zeroly-app/1.0 (contact@example.com)",
            },
          }
        );
        const data = await res.json();
        const address = data?.display_name || `Lat: ${lat}, Lng: ${lng}`;
        onPick(address, lat, lng);
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        onPick(`Lat: ${lat}, Lng: ${lng}`, lat, lng);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ onPick }) => (
  <MapContainer
    center={[23.1815, 79.9864]} // Jabalpur center by default
    zoom={13}
    style={{ height: "300px", width: "100%", borderRadius: "12px" }}
    scrollWheelZoom={true}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    />
    <LocationMarker onPick={onPick} />
  </MapContainer>
);

export default MapPicker;
