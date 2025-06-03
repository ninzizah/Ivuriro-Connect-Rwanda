
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

const kigaliPosition: L.LatLngExpression = [-1.9441, 30.0619]; // Kigali, Rwanda coordinates

// Custom icon to avoid potential issues with default icon paths
const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const mapContainerStyle = { height: '450px', width: '100%' };

export default function AmbulanceMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // You can return a loading spinner here if preferred
    return null; 
  }

  return (
    <MapContainer center={kigaliPosition} zoom={13} scrollWheelZoom={true} style={mapContainerStyle}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={kigaliPosition} icon={defaultIcon}>
        <Popup>
          Kigali, Rwanda. <br /> Central dispatch point.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
