"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const MapComponent = ({ latitude, longitude, address }) => {
  const position = [
    latitude || 9.0820, // Default to Abuja
    longitude || 7.4913
  ];

  // Stylish CartoDB Positron (Grayscale/Minimal)
  const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div className="w-full h-full overflow-hidden shadow-inner">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution={attribution}
          url={tileUrl}
        />
        <Marker position={position}>
          <Popup>
            <div className="font-mono text-xs">
              <p className="font-bold uppercase tracking-wider mb-1">Base of Operations</p>
              <p className="text-black/60 italic">{address || "Abuja, Nigeria"}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
