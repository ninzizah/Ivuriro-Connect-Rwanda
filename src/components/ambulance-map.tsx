
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
    // Capture the instance at the time the effect runs.
    // This is important for the cleanup function's closure.
    const currentMapInstance = mapRef.current;

    return () => {
      // Use the captured instance in the cleanup.
      if (currentMapInstance) {
        // Check if the container still exists and has Leaflet's internal ID.
        // This is an extra defensive check.
        const container = currentMapInstance.getContainer();
        if (container && (container as any)._leaflet_id) {
          currentMapInstance.remove();
        }
      }
      // It's also good practice to clear the ref if this component instance
      // is truly being disposed of, though the ref itself will be gone with the component.
      // If mapRef.current was used to set currentMapInstance, and another effect could
      // change mapRef.current before cleanup, this ensures we only act on the one from mount.
      // However, with an empty dependency array, this effect (and its cleanup) are tied
      // to this component's mount/unmount.
      if (mapRef.current === currentMapInstance) {
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and its cleanup once on unmount.

  return (
    <MapContainer
      center={kigaliPosition}
      zoom={13}
      scrollWheelZoom={true}
      style={mapContainerStyle}
      whenCreated={(mapInstance) => {
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

const AmbulanceMap = memo(AmbulanceMapComponent);
AmbulanceMap.displayName = 'AmbulanceMap';

export default AmbulanceMap;
