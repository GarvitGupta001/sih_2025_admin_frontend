"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SARTHAK_CHART_COLORS, SARTHAK_THEME } from "@/lib/theme";

// Fix for default marker icons in Next.js/React
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom colored marker for alumni - using Sarthak theme solid colors
const createColoredIcon = (colorIndex) => {
  const color = SARTHAK_CHART_COLORS[colorIndex % SARTHAK_CHART_COLORS.length];
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0, 17, 69, 0.4);
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};



// Component to fit bounds to markers
function FitBounds({ alumni }) {
  const map = useMap();

  useEffect(() => {
    if (alumni.length > 0) {
      const bounds = L.latLngBounds(
        alumni.map((a) => [a.display_point.lat, a.display_point.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [alumni, map]);

  return null;
}

export default function AlumniMap({
  alumni,
  center = [20.5937, 78.9629], // Center of India
  zoom = 4,
}) {
  // Set default icon
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  if (alumni.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#f6faff] border border-[#e4f0ff] rounded-2xl">
        <div className="text-center p-8">
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-[#001145] flex items-center justify-center shadow-lg">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-[#001145] text-lg font-bold mb-1">No Locations Yet</p>
          <p className="text-[#7088aa] text-sm">
            Alumni with location data will appear on this map
          </p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", borderRadius: "inherit" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds alumni={alumni} />

      {alumni.map((alumnus, index) => {
        const icon = createColoredIcon(index);

        return (
          <Marker
            key={alumnus.id}
            position={[alumnus.display_point.lat, alumnus.display_point.lng]}
            icon={icon}
          >
            <Popup>
              <div style={{ minWidth: 220, fontFamily: "Inter, sans-serif", padding: 4 }}>
                {/* Header with avatar */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: SARTHAK_CHART_COLORS[index % 5],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    {alumnus.name ? alumnus.name[0].toUpperCase() : "A"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#001145", lineHeight: 1.3 }}>
                      {alumnus.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#4a5f7c", marginTop: 2 }}>
                      {alumnus.role || "Alumni"}
                    </div>
                  </div>
                </div>

                {/* Company */}
                {alumnus.company && alumnus.company !== "N/A" && (
                  <div
                    style={{
                      background: "#001145",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 10,
                      display: "inline-block",
                    }}
                  >
                    {alumnus.company}
                  </div>
                )}

                {/* Info badges */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  {alumnus.graduation_year && (
                    <span
                      style={{
                        background: "#e4f0ff",
                        color: "#001145",
                        padding: "4px 10px",
                        borderRadius: 16,
                        fontSize: 11,
                        fontWeight: 600,
                        border: "1px solid #a8bdda",
                      }}
                    >
                      Batch {alumnus.graduation_year}
                    </span>
                  )}
                  {alumnus.city && (
                    <span
                      style={{
                        background: "#f6faff",
                        color: "#4a5f7c",
                        padding: "4px 10px",
                        borderRadius: 16,
                        fontSize: 11,
                        fontWeight: 600,
                        border: "1px solid #a8bdda",
                      }}
                    >
                      {alumnus.city}{alumnus.state ? `, ${alumnus.state}` : ""}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => alert("Connect feature coming soon!")}
                    style={{
                      flex: 1,
                      background: "#001145",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => window.open(`/alumni/${alumnus.id}`, "_blank")}
                    style={{
                      flex: 1,
                      background: "#f6faff",
                      color: "#001145",
                      border: "1px solid #a8bdda",
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
