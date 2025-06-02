
"use client"; 

import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockHospitals, formatWaitTime, timeSince, Hospital } from '@/lib/mock-data';
import { Clock, MapPin, Users, AlertCircle, CheckCircle, BarChartHorizontalBig } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

const getWaitTimeColor = (minutes: number) => {
  if (minutes < 30) return "bg-green-500/20 text-green-700 border-green-500"; 
  if (minutes < 60) return "bg-yellow-500/20 text-yellow-700 border-yellow-500"; 
  return "bg-red-500/20 text-red-700 border-red-500"; 
};

const getWaitTimeSeverityIcon = (minutes: number) => {
  if (minutes < 30) return <CheckCircle className="h-4 w-4 text-green-600" />;
  if (minutes < 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  return <AlertCircle className="h-4 w-4 text-red-600" />;
};


const HospitalWaitTimeCard = ({ hospital }: { hospital: Hospital }) => {
  const [lastUpdatedText, setLastUpdatedText] = useState('');

  useEffect(() => {
    setLastUpdatedText(timeSince(hospital.lastUpdated)); // Initial set
    const intervalId = setInterval(() => {
      setLastUpdatedText(timeSince(hospital.lastUpdated));
    }, 60000); 
    return () => clearInterval(intervalId);
  }, [hospital.lastUpdated]);
  
  const overallWaitTimeColor = getWaitTimeColor(hospital.generalWaitTimeMinutes);

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl font-headline text-primary">{hospital.name}</CardTitle>
                <CardDescription className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" /> {hospital.location}
                </CardDescription>
            </div>
            <Badge variant="outline" className={`text-xs ${overallWaitTimeColor}`}>
                {getWaitTimeSeverityIcon(hospital.generalWaitTimeMinutes)}
                <span className="ml-1">{formatWaitTime(hospital.generalWaitTimeMinutes)} Avg. Wait</span>
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <h4 className="text-sm font-semibold text-foreground/90 mb-2 flex items-center"><BarChartHorizontalBig className="w-4 h-4 mr-2 text-accent"/>Service Wait Times:</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {hospital.services.map(service => (
            <div key={service.id} className="text-xs p-2 rounded-md border bg-background">
                <div className="flex justify-between items-center">
                <span className="font-medium text-foreground/80">{service.name}</span>
                <Badge variant="secondary" className={`${getWaitTimeColor(service.waitTimeMinutes)} px-1.5 py-0.5`}>
                    {formatWaitTime(service.waitTimeMinutes)}
                </Badge>
                </div>
                 <Progress value={(service.waitTimeMinutes / 120) * 100} className="h-1 mt-1 [&>div]:bg-primary/70" />
                 <p className="text-muted-foreground text-[10px] mt-0.5">Updated: {timeSince(service.lastUpdated)}</p>
            </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-4 border-t">
        <Clock className="h-3 w-3 mr-1" /> Last overall update: {lastUpdatedText}
      </CardFooter>
    </Card>
  );
};


export default function WaitTimesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    setHospitals(mockHospitals);
  }, []);
  
  const filteredAndSortedHospitals = useMemo(() => {
    let filtered = hospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'wait_time_asc':
        filtered.sort((a, b) => a.generalWaitTimeMinutes - b.generalWaitTimeMinutes);
        break;
      case 'wait_time_desc':
        filtered.sort((a, b) => b.generalWaitTimeMinutes - a.generalWaitTimeMinutes);
        break;
    }
    return filtered;
  }, [hospitals, searchTerm, sortOption]);

  return (
    <MainLayout>
      <section className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold font-headline text-primary">Real-Time Hospital Wait Times</h1>
          <Clock className="h-8 w-8 text-accent" />
        </div>
        <p className="text-muted-foreground">
          Find current estimated wait times for various services at hospitals across Rwanda.
        </p>
      </section>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
        <Input
          type="text"
          placeholder="Search by hospital name or location..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="wait_time_asc">Wait Time (Low to High)</SelectItem>
            <SelectItem value="wait_time_desc">Wait Time (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedHospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedHospitals.map((hospital, index) => (
            <HospitalWaitTimeCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      ) : (
         <div className="text-center py-10 text-muted-foreground animate-fade-in" style={{animationDelay: '0.4s'}}>
          <Users className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg">No hospitals found matching your criteria.</p>
          <p>Try adjusting your search or sort options.</p>
        </div>
      )}
    </MainLayout>
  );
}
