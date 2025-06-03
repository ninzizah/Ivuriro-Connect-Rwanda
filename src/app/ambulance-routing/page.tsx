
"use client";

import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance, Map as MapIcon, RadioTower } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// It's good practice to ensure Leaflet's default icon paths are set up,
// especially when using bundlers. This can be done in a useEffect.
// If marker icons appear broken, uncomment and adjust this useEffect.
// You might need to copy leaflet images to your public folder.
// For example, copy 'node_modules/leaflet/dist/images/*' to 'public/leaflet-images/'
// and then set: L.Icon.Default.imagePath = '/leaflet-images/';

// A common fix for default Leaflet icons if they don't appear:
// useEffect(() => {
//   delete (L.Icon.Default.prototype as any)._getIconUrl;
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default?.src || require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png').default?.src || require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png').default?.src || require('leaflet/dist/images/marker-shadow.png'),
//   });
// }, []);


const kigaliPosition: L.LatLngExpression = [-1.9441, 30.0619]; // Kigali, Rwanda coordinates

// Custom icon to avoid potential issues with default icon paths if not configured
const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export default function AmbulanceRoutingPage() {
  return (
    <MainLayout>
      <section className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold font-headline text-primary">Ambulance Routing & Dispatch</h1>
          <Ambulance className="h-8 w-8 text-accent" />
        </div>
        <p className="text-muted-foreground">
          Optimized routing for emergency medical services to ensure rapid response times.
        </p>
      </section>

      <Card className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Emergency Dispatch System</CardTitle>
          <CardDescription>
            This system provides real-time tracking and intelligent dispatch suggestions for ambulances, 
            integrating with hospital availability and traffic data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 border rounded-lg bg-card">
            <MapIcon className="h-16 w-16 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Real-Time Location Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Live tracking of ambulance fleet and incident locations on an interactive map.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 p-6 border rounded-lg bg-card">
            <RadioTower className="h-16 w-16 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Intelligent Dispatch</h3>
              <p className="text-sm text-muted-foreground">
                AI-assisted dispatch to the nearest appropriate hospital considering patient condition,
                hospital specialty, wait times, and bed availability.
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Interactive Map
            </p>
            <div className="bg-muted/50 rounded-lg overflow-hidden max-w-2xl mx-auto border">
              <MapContainer center={kigaliPosition} zoom={13} scrollWheelZoom={true} style={{ height: '450px', width: '100%' }}>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
