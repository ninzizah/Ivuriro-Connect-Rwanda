
"use client";

import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, LineChart, AlertTriangle, ActivitySquare } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';

const mockWaitTimeData = [
  { name: 'KFH, Kigali', 'Avg Wait (min)': 45 },
  { name: 'CHUB', 'Avg Wait (min)': 70 },
  { name: 'Gisenyi DH', 'Avg Wait (min)': 30 },
  { name: 'Ruhengeri RH', 'Avg Wait (min)': 60 },
  { name: 'Muhima Hosp.', 'Avg Wait (min)': 55 },
];

const mockBedOccupancyData = [
  { name: 'ICU Beds', value: 75 }, // percentage
  { name: 'General Ward Beds', value: 60 },
  { name: 'Maternity Beds', value: 80 },
  { name: 'Pediatric Beds', value: 50 },
];
const COLORS = ['#3F51B5', '#7E57C2', '#4CAF50', '#FFC107']; // Primary, Accent, Green, Yellow

const mockServiceDemandData = [
  { month: 'Jan', 'Consultations': 4000, 'Emergencies': 1500 },
  { month: 'Feb', 'Consultations': 3000, 'Emergencies': 1200 },
  { month: 'Mar', 'Consultations': 5000, 'Emergencies': 1800 },
  { month: 'Apr', 'Consultations': 4500, 'Emergencies': 1600 },
  { month: 'May', 'Consultations': 5500, 'Emergencies': 2000 },
  { month: 'Jun', 'Consultations': 6000, 'Emergencies': 2200 },
];


export default function StatisticsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <ActivitySquare className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading health statistics...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold font-headline text-primary">National Health Statistics</h1>
          <BarChart3 className="h-8 w-8 text-accent" />
        </div>
        <p className="text-muted-foreground">
          Aggregated insights into hospital performance and service demand across Rwanda.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary" />Average Wait Times by Hospital</CardTitle>
            <CardDescription>Comparison of average general consultation wait times.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWaitTimeData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={10} stroke="hsl(var(--foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Avg Wait (min)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center"><PieChart className="mr-2 h-5 w-5 text-primary" />Bed Occupancy Rate by Type</CardTitle>
            <CardDescription>Current national average bed occupancy rates.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={mockBedOccupancyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={12}
                  stroke="hsl(var(--background))"
                >
                  {mockBedOccupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                 contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center"><LineChart className="mr-2 h-5 w-5 text-primary" />Monthly Service Demand Trend</CardTitle>
          <CardDescription>Trend of consultations and emergency visits over the past months.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={mockServiceDemandData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" fontSize={12} stroke="hsl(var(--foreground))" />
              <YAxis fontSize={12} stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--card-foreground))'
                  }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="Consultations" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Emergencies" stroke="hsl(var(--accent))" strokeWidth={2} activeDot={{ r: 6 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="mt-6 bg-muted/50 border-muted-foreground/30 animate-fade-in" style={{animationDelay: '0.5s'}}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" /> Data Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            The statistics presented on this page are based on aggregated and periodically updated mock data for demonstration purposes. 
            They may not reflect the actual real-time situation in Rwandan healthcare facilities. 
            Always refer to official sources for precise and up-to-date health information.
          </p>
        </CardContent>
      </Card>

    </MainLayout>
  );
}

