
"use client";

import React, { useEffect, useRef, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const AmbulanceMapComponent = () => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // This effect's cleanup function will run when the component unmounts.
    // It's critical for preventing issues during HMR or fast re-renders.
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Remove the Leaflet map instance
        mapRef.current = null;   // Clear the ref
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and once on unmount.

  return (
    <MapContainer
      center={kigaliPosition}
      zoom={13}
      scrollWheelZoom={true}
      style={mapContainerStyle}
      whenCreated={(mapInstance) => {
        // Store the map instance in the ref.
        // This is used by the cleanup function in useEffect.
        mapRef.current = mapInstance;
      }}
    >
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
};

// Wrap the component with React.memo to prevent unnecessary re-renders
// if its props (which are none in this case) haven't changed.
const AmbulanceMap = memo(AmbulanceMapComponent);
AmbulanceMap.displayName = 'AmbulanceMap'; // Optional: for better debugging display names

export default AmbulanceMap;
