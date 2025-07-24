import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const LocationMarker = ({ onPick }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Reverse geocode to get address
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            "User-Agent": "zeroly-app/1.0 (contact@example.com)",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const address = data?.display_name || `Lat: ${lat}, Lng: ${lng}`;
          onPick(address); // Send the address to parent
        })
        .catch((err) => {
          console.error("Reverse geocoding error:", err);
          onPick(`Lat: ${lat}, Lng: ${lng}`);
        });
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

const MapPicker = ({ onPick }) => (
  <MapContainer
    center={[23.1815, 79.9864]} // Default center (Jabalpur)
    zoom={13}
    style={{ height: "300px", width: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    />
    <LocationMarker onPick={onPick} />
  </MapContainer>
);

export default MapPicker;
