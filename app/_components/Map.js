"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

// Custom zinc/silver icon (optimized SVG)
const zincIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 41'%3E%3Cpath fill='%23c0c0c0' stroke='%23333' stroke-width='1.5' d='M16 1C8.3 1 2 7.3 2 15c0 10.5 11.2 19.3 14.1 24.6.3.5.9.5 1.2 0C20.8 34.3 32 25.5 32 15c0-7.7-6.3-14-16-14z'/%3E%3Ccircle cx='16' cy='15' r='6' fill='%23f0f0f0' stroke='%23333' stroke-width='1.2'/%3E%3C/svg%3E",
  iconRetinaUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 82'%3E%3Cpath fill='%23c0c0c0' stroke='%23333' stroke-width='3' d='M32 2C16.6 2 4 14.6 4 30c0 21 22.4 38.6 28.2 49.2.6 1 1.8 1 2.4 0C40.6 68.6 64 51 64 30c0-15.4-12.6-28-32-28z'/%3E%3Ccircle cx='32' cy='30' r='12' fill='%23f0f0f0' stroke='%23333' stroke-width='2.4'/%3E%3C/svg%3E",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

// UPDATED CSS - HIDE ATTRIBUTION BUT MAINTAIN ACCESSIBILITY
const darkThemeCSS = `
  .leaflet-container {
    background-color: #1a202c !important;
  }
  
  /* Hide attribution control */
  .leaflet-control-attribution {
    display: none !important;
  }
  
 
`;

function ShopMarker({ latitude, longitude }) {
  const markerRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.openPopup();
    }
  }, [map]);

  return (
    <Marker position={[latitude, longitude]} icon={zincIcon} ref={markerRef}>
      <Popup className="custom-popup">We are here!</Popup>
    </Marker>
  );
}

export default function Map({ latitude, longitude }) {
  return (
    <>
      <style>{darkThemeCSS}</style>
      <MapContainer
        zoomControl={false}
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full rounded-md"
      >
        <TileLayer
          url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          maxZoom={20}
        />

        <ShopMarker latitude={latitude} longitude={longitude} />
      </MapContainer>
    </>
  );
}
