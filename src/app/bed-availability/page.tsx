
"use client";

import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockHospitals, timeSince, Hospital, DepartmentBedInfo } from '@/lib/mock-data';
import { BedDouble, AlertTriangle, CheckCircle2, ActivitySquare, HospitalIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getAvailabilityColor = (available: number, total: number) => {
  const percentage = total > 0 ? (available / total) * 100 : 0;
  if (percentage > 50) return "text-green-600"; 
  if (percentage > 20) return "text-yellow-600"; 
  return "text-red-600"; 
};

const getAvailabilityBadgeVariant = (available: number, total: number): "default" | "secondary" | "destructive" | "outline" => {
  const percentage = total > 0 ? (available / total) * 100 : 0;
  if (percentage > 50) return "secondary"; 
  if (percentage > 20) return "outline"; 
  return "destructive";
}

const DepartmentBedStatusRow = ({ dept, hospitalName }: { dept: DepartmentBedInfo, hospitalName: string }) => {
  const occupancyPercentage = dept.totalBeds > 0 ? ((dept.totalBeds - dept.availableBeds) / dept.totalBeds) * 100 : 0;
  const availabilityColor = getAvailabilityColor(dept.availableBeds, dept.totalBeds);

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{dept.name}</TableCell>
      <TableCell>{hospitalName}</TableCell>
      <TableCell className="text-center">{dept.totalBeds}</TableCell>
      <TableCell className={`text-center font-semibold ${availabilityColor}`}>{dept.availableBeds}</TableCell>
      <TableCell className="text-center">{dept.totalBeds - dept.availableBeds}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <Progress value={occupancyPercentage} className={`w-full h-2 mr-2 ${occupancyPercentage > 80 ? '[&>div]:bg-destructive' : occupancyPercentage > 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500' }`} />
          <span className="text-xs text-muted-foreground">{occupancyPercentage.toFixed(0)}%</span>
        </div>
      </TableCell>
       <TableCell className="text-center">
        <Badge variant={getAvailabilityBadgeVariant(dept.availableBeds, dept.totalBeds)}>
          {occupancyPercentage > 80 ? <AlertTriangle className="h-3 w-3 mr-1"/> : <CheckCircle2 className="h-3 w-3 mr-1"/>}
          {occupancyPercentage > 80 ? "High" : occupancyPercentage > 50 ? "Moderate" : "Low"}
        </Badge>
      </TableCell>
    </TableRow>
  );
};


export default function BedAvailabilityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [hospitalsData, setHospitalsData] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedText, setLastUpdatedText] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setHospitalsData(mockHospitals);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (hospitalsData.length > 0) {
      const mostRecentUpdate = hospitalsData.reduce((latest, hospital) => 
        new Date(hospital.lastUpdated) > new Date(latest) ? hospital.lastUpdated : latest, 
      hospitalsData[0].lastUpdated);
      
      const updateText = () => setLastUpdatedText(timeSince(mostRecentUpdate));
      updateText(); 

      const intervalId = setInterval(updateText, 60000);
      return () => clearInterval(intervalId);
    }
  }, [hospitalsData]);


  const allDepartments = useMemo(() => {
    return hospitalsData.flatMap(hospital => 
      hospital.departments.map(dept => ({
        ...dept,
        hospitalName: hospital.name,
        hospitalLocation: hospital.location,
        lastUpdated: hospital.lastUpdated,
      }))
    );
  }, [hospitalsData]);

  const filteredDepartments = useMemo(() => {
    return allDepartments
      .filter(dept => 
        (dept.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         dept.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedLocation === 'all' || dept.hospitalLocation === selectedLocation)
      )
      .sort((a,b) => (a.availableBeds/a.totalBeds) - (b.availableBeds/b.totalBeds) || a.hospitalName.localeCompare(b.hospitalName) ); 
  }, [allDepartments, searchTerm, selectedLocation]);

  const uniqueLocations = useMemo(() => {
    const locations = mockHospitals.map(h => h.location);
    return ['all', ...new Set(locations)];
  }, []);
  

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
            <ActivitySquare className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Loading bed availability data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold font-headline text-primary">Hospital Bed Availability</h1>
          <BedDouble className="h-8 w-8 text-accent" />
        </div>
        <p className="text-muted-foreground">
          View real-time bed availability across departments and hospitals. (For authorized medical staff)
        </p>
        {lastUpdatedText && <p className="text-xs text-muted-foreground mt-1">Overall data last updated: {lastUpdatedText}</p>}
      </section>

      <Card className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Bed Status Overview</CardTitle>
          <CardDescription>Search and filter bed availability by hospital, department, or location.</CardDescription>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search by hospital or department..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by location..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDepartments.length > 0 ? (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead className="text-center">Total Beds</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-center">Occupied</TableHead>
                  <TableHead className="min-w-[150px]">Occupancy</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((dept) => (
                  <DepartmentBedStatusRow key={`${dept.hospitalName}-${dept.id}`} dept={dept} hospitalName={dept.hospitalName}/>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <HospitalIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No bed availability data found for your current filters.</p>
              <p>Try broadening your search criteria.</p>
            </div>
          )}
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground pt-4 border-t">
            <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" /> Note: This data is for informational purposes and updated periodically. Always confirm with the hospital directly for critical cases.
        </CardFooter>
      </Card>
    </MainLayout>
  );
}
