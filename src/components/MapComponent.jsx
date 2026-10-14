"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

function getWeatherDescription(code) {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Clear";
}

const MapComponent = ({ latitude, longitude, address }) => {
  const lat = Number(latitude) || 9.0820; // Default to Abuja
  const lon = Number(longitude) || 7.4913;
  const position = [lat, lon];

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            condition: getWeatherDescription(data.current.weather_code)
          });
        }
      } catch (e) {
        console.error("Open-Meteo fetch error:", e);
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [lat, lon]);

  // OpenStreetMap tile server - 100% free, no API key required
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

  return (
    <div className="w-full h-full min-h-[260px] relative overflow-hidden shadow-inner bg-[#f0f0f0]">
      {/* Live Open-Meteo Weather Badge */}
      {weather && (
        <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-black/10 flex items-center gap-2 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-black/80">
            {weather.temp}°C • {weather.condition}
          </span>
        </div>
      )}

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full min-h-[260px]"
      >
        <TileLayer
          attribution={attribution}
          url={tileUrl}
          className="map-tiles-styled"
        />
        <Marker position={position}>
          <Popup>
            <div className="font-mono text-xs p-1">
              <p className="font-bold uppercase tracking-wider mb-1 text-black">Base of Operations</p>
              <p className="text-black/70 italic mb-1.5">{address || "Abuja, Nigeria"}</p>
              {weather && (
                <div className="border-t border-black/10 pt-1.5 text-[10px] text-black/60 flex items-center justify-between gap-3">
                  <span>Current Weather:</span>
                  <span className="font-bold text-black">{weather.temp}°C, {weather.condition}</span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
