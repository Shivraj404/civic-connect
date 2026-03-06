import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CATEGORY_INFO, type CivicIssue, STATUS_INFO } from "@/lib/civic-data";

/* Fix default marker icon path issue with bundlers */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* Custom colored marker based on issue category */
const getMarkerIcon = (category: string) => {
  const colors: Record<string, string> = {
    pothole: "#E5A023",
    garbage: "#34B77C",
    streetlight: "#7C5DD6",
    water_leakage: "#22A8D8",
    drainage: "#2DB9AA",
    traffic_signal: "#E5566D",
    damaged_road: "#E5A023",
    other: "#2DB9AA",
  };
  const color = colors[category] || "#2DB9AA";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
      background: ${color}; transform: rotate(-45deg);
      border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    "><div style="transform: rotate(45deg); font-size: 12px;">${CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]?.icon || "📋"}</div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

/* Heatmap overlay using circles for complaint density */
const HeatmapLayer = ({ issues, show }: { issues: CivicIssue[]; show: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (!show) return;

    /* Group issues by approximate area (rounded lat/lng) */
    const clusters: Record<string, { lat: number; lng: number; count: number }> = {};
    issues.forEach((issue) => {
      const key = `${Math.round(issue.latitude * 100) / 100},${Math.round(issue.longitude * 100) / 100}`;
      if (!clusters[key]) {
        clusters[key] = { lat: issue.latitude, lng: issue.longitude, count: 0 };
      }
      clusters[key].count++;
    });

    const circles = Object.values(clusters).map((c) => {
      const intensity = Math.min(c.count / 3, 1);
      return L.circle([c.lat, c.lng], {
        radius: 300 + c.count * 150,
        color: "transparent",
        fillColor: `hsl(${350 - intensity * 200}, 80%, 50%)`,
        fillOpacity: 0.25 + intensity * 0.2,
      }).addTo(map);
    });

    return () => {
      circles.forEach((c) => c.remove());
    };
  }, [issues, show, map]);

  return null;
};

/* Interactive map component showing all reported issues */
const IssueMap = ({
  issues,
  className = "",
  showHeatmap = false,
}: {
  issues: CivicIssue[];
  className?: string;
  showHeatmap?: boolean;
}) => {
  /* Center on New Delhi by default */
  const center: [number, number] = [28.6139, 77.2090];

  return (
    <div className={`rounded-xl overflow-hidden border border-border ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full min-h-[400px]"
        style={{ minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatmapLayer issues={issues} show={showHeatmap} />
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={getMarkerIcon(issue.category)}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-sm">{issue.title}</p>
                <p className="text-xs mt-1">
                  {CATEGORY_INFO[issue.category].icon} {CATEGORY_INFO[issue.category].label}
                </p>
                <p className="text-xs mt-0.5">
                  Status: {STATUS_INFO[issue.status].label}
                </p>
                {issue.address && (
                  <p className="text-xs mt-0.5 text-gray-500">{issue.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IssueMap;
