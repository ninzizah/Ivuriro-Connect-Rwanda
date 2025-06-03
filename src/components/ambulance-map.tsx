
"use client";

import React, { useState, useEffect, useRef } from 'react'; // Import React and useRef
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // L is the Leaflet instance
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

// Define the component that renders the map
const AmbulanceMapComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<L.Map | null>(null); // Ref to store the Leaflet map instance

  useEffect(() => {
    setIsMounted(true);

    // Cleanup function: This will be called when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Explicitly remove the map instance
        mapRef.current = null;   // Clear the ref
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

  if (!isMounted) {
    // Return null or a placeholder if the component isn't mounted yet
    return null;
  }

  return (
    <MapContainer
      center={kigaliPosition}
      zoom={13}
      scrollWheelZoom={true}
      style={mapContainerStyle}
      whenCreated={(mapInstance) => { // Callback to get the map instance
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

// Wrap the component with React.memo
const AmbulanceMap = React.memo(AmbulanceMapComponent);
AmbulanceMap.displayName = 'AmbulanceMap'; // Optional: for better debugging display names

export default AmbulanceMap;
