
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
    // Capture the map instance from the ref at the time the effect is set up.
    const mapInstanceToClean = mapRef.current;

    return () => {
      // If there was a map instance when this component mounted, try to remove it.
      if (mapInstanceToClean) {
        mapInstanceToClean.remove();
      }

      // If mapRef.current is the instance we just tried to remove (i.e., no new map
      // instance has been created and assigned to the ref in the meantime),
      // then it's safe to nullify the ref. This helps prevent the next render
      // cycle from finding a stale instance in the ref.
      if (mapRef.current === mapInstanceToClean) {
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

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
