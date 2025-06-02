
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance, Map, RadioTower } from 'lucide-react';
import Image from 'next/image';

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
            <Map className="h-16 w-16 text-primary flex-shrink-0" />
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
              (Illustrative map of ambulance routing)
            </p>
            <div className="bg-muted/50 rounded-lg overflow-hidden aspect-video max-w-2xl mx-auto border">
              <Image 
                src="https://placehold.co/800x450" 
                alt="Ambulance Routing Map Placeholder" 
                width={800} 
                height={450}
                className="object-cover w-full h-full"
                data-ai-hint="map ambulance"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Feature under active development. Full functionality coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
