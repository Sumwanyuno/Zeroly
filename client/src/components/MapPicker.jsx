import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { toast } from "sonner";

const LocationMarker = ({ onLocationSelect, mapRef }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  const updateLocation = (lat, lng) => {
    setPosition([lat, lng]);
    map.flyTo([lat, lng], 15, { animate: true, duration: 1 });

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
        onLocationSelect({ address, lat, lng });
      })
      .catch((err) => {
        console.error("Reverse geocoding error:", err);
        onLocationSelect({ address: `Lat: ${lat}, Lng: ${lng}`, lat, lng });
      });
  };

  useEffect(() => {
    if (mapRef) {
      mapRef.current = { updateLocation };
    }
  }, [mapRef]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      updateLocation(lat, lng);
    },
  });

  return position ? <Marker position={position} alt="Selected location marker" title="Selected location marker"></Marker> : null;
};

const MapPicker = ({ onLocationSelect }) => {
  const mapRef = React.useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "zeroly-app/1.0 (contact@example.com)",
          },
        }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const first = data[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);
        if (mapRef.current) {
          mapRef.current.updateLocation(lat, lng);
        }
        toast.success(`Location found: ${first.display_name}`);
      } else {
        toast.error("Location not found. Please try a different search term.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      toast.error("Failed to search location. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    toast.info("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (mapRef.current) {
          mapRef.current.updateLocation(
            position.coords.latitude,
            position.coords.longitude
          );
        }
      },
      (error) => {
        toast.error("Unable to retrieve your location. Please type in the address search bar.");
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-2 p-2.5 bg-background/95 border-b border-border z-[400] relative">
        <form onSubmit={handleSearch} className="flex-grow flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type address or city (e.g. London)..."
            className="flex-grow px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Search address to place map pin"
          />
          <Button type="submit" disabled={searching} size="sm" className="shrink-0 h-9 font-semibold">
            {searching ? "Searching..." : "Search"}
          </Button>
        </form>
        <Button 
          type="button" 
          onClick={handleFetchLocation}
          size="sm"
          className="shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 shrink-0 h-9"
        >
          <Navigation className="w-3.5 h-3.5" />
          Fetch My Location
        </Button>
      </div>
      <div className="flex-grow w-full relative min-h-[280px]">
        <MapContainer
          center={[23.1815, 79.9864]}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 10 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker onLocationSelect={onLocationSelect} mapRef={mapRef} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPicker;
