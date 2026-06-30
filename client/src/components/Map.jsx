/**
 * Map.jsx — A read-only Leaflet map that shows a pinned location.
 *
 * Props:
 *   lat        {number}  – Latitude of the marker.  Defaults to 23.1815 (Jabalpur, India).
 *   lng        {number}  – Longitude of the marker. Defaults to 79.9864.
 *   address    {string}  – Optional tooltip / popup text shown on the marker.
 *   zoom       {number}  – Initial zoom level (default 14).
 *   className  {string}  – Extra Tailwind / CSS classes on the wrapper div.
 */
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet's default icon paths when bundled via Vite / webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Map = ({
  lat = 23.1815,
  lng = 79.9864,
  address = "Item Location",
  zoom = 14,
  className = "",
}) => {
  const center = [lat, lng];

  return (
    <div
      className={`w-full rounded-2xl overflow-hidden border border-border/50 shadow-md ${className}`}
      style={{ minHeight: 200 }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", minHeight: 200 }}
        aria-label={`Map showing location: ${address}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        <Marker position={center} alt={address} title={address}>
          {address && (
            <Popup className="rounded-xl font-sans text-sm font-medium">
              {address}
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
