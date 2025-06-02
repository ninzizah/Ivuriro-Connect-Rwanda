
import MainLayout from '@/components/layout/main-layout';
import DashboardCard from '@/components/dashboard-card';
import { Clock, CalendarPlus, BedDouble, Ambulance, BrainCircuit, BarChart3 } from 'lucide-react';

const features = [
  {
    title: "Real-Time Wait Times",
    description: "View current waiting times for services at various hospitals. Plan your visit efficiently.",
    href: "/wait-times",
    icon: Clock,
  },
  {
    title: "Pre-Registration & Scheduling",
    description: "Pre-register for consultations and schedule appointments online to save time at the hospital.",
    href: "/pre-registration",
    icon: CalendarPlus,
  },
  {
    title: "Bed Availability",
    description: "For medical staff: Access up-to-date bed availability across hospitals and receive critical alerts.",
    href: "/bed-availability",
    icon: BedDouble,
  },
  {
    title: "Ambulance Routing",
    description: "Integrated emergency ambulance routing to the most suitable facility.",
    href: "/ambulance-routing",
    icon: Ambulance,
  },
  {
    title: "AI Hospital Suggestion",
    description: "Get AI-powered recommendations for the best hospital based on symptoms and conditions.",
    href: "/ai-hospital-suggestion",
    icon: BrainCircuit,
  },
  {
    title: "National Health Statistics",
    description: "View aggregated statistics on wait times, bed occupancy, and service demand nationwide.",
    href: "/statistics", 
    icon: BarChart3,
  }
];

export default function HomePage() {
  return (
    <MainLayout>
      <section className="text-center py-12 animate-fade-in">
        <h1 className="text-4xl font-bold font-headline text-primary mb-4">
          Welcome to Rwanda Health Connect
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Your central platform for navigating Rwanda&apos;s healthcare system efficiently. Access real-time information, schedule appointments, and more.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {features.map((feature, index) => (
          <DashboardCard
            key={feature.href}
            title={feature.title}
            description={feature.description}
            href={feature.href}
            icon={feature.icon}
            actionText={`Explore ${feature.title.split(' ')[0]}`}
          />
        ))}
      </section>
    </MainLayout>
  );
}
