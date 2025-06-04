
"use client";

import MainLayout from '@/components/layout/main-layout';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CalendarPlus, User, Phone, Stethoscope, ActivitySquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mockHospitals } from '@/lib/mock-data'; // Assuming mock data is still used for hospital list
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig'; // Import Firestore instance
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { useAuth } from '@/context/AuthContext'; // Import useAuth to get user ID if needed

const preRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format."),
  symptoms: z.string().min(10, "Please describe your symptoms (min 10 characters).").max(500),
  preferredHospitalId: z.string().min(1, "Please select a hospital."),
  preferredDate: z.date({ required_error: "A preferred date is required." }),
  preferredTime: z.string().min(1, "Please select a preferred time slot."),
});

type PreRegistrationFormValues = z.infer<typeof preRegistrationSchema>;

const timeSlots = ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "14:00 - 15:00", "15:00 - 16:00"];

export default function PreRegistrationPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const { currentUser } = useAuth(); // Get current user from Auth context

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<PreRegistrationFormValues>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      symptoms: "",
      preferredHospitalId: "",
      preferredTime: "",
      // preferredDate will be initialized by the calendar
    },
  });

  async function onSubmit(data: PreRegistrationFormValues) {
    // Optional: Check if user is logged in before submitting
    // if (!currentUser) {
    //   toast({ title: "Error", description: "You must be logged in to pre-register.", variant: "destructive" });
    //   return;
    // }

    try {
      // Add the pre-registration data to Firestore
      const docRef = await addDoc(collection(db, "preregistrations"), {
        ...data,
        userId: currentUser ? currentUser.uid : null, // Store user ID if logged in
        submittedAt: serverTimestamp(), // Add a server timestamp
        status: 'pending', // Add an initial status
        preferredDate: format(data.preferredDate, "yyyy-MM-dd") // Store date as string for consistency
      });

      console.log("Document written with ID: ", docRef.id);

      toast({
        title: "Registration Submitted!",
        description: `Thank you, ${data.fullName}. Your pre-registration has been received.`, // Simplified message
        variant: "default",
      });
      form.reset();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Submission Failed",
        description: "Could not submit your pre-registration. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (!isClient) {
    return (
       <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
            <ActivitySquare className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Loading form...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold font-headline text-primary">Patient Pre-Registration</h1>
            <CalendarPlus className="h-8 w-8 text-accent" />
        </div>
        <p className="text-muted-foreground">
          Complete this form to pre-register for your consultation and schedule an appointment.
        </p>
      </section>

      <Card className="max-w-2xl mx-auto animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Pre-Registration Form</CardTitle>
          <CardDescription>Fill in your details below. Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* --- Form Fields remain the same as your previous code --- */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="e.g. Shema Honore" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input type="tel" placeholder="e.g. +250 78..." {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms / Reason for Visit *</FormLabel>
                    <FormControl>
                       <div className="relative flex items-start">
                        <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea placeholder="Briefly describe your symptoms or reason for consultation..." {...field} className="pl-10 min-h-[100px]" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredHospitalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Hospital *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hospital" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockHospitals.map(hospital => (
                          <SelectItem key={hospital.id} value={hospital.id}>{hospital.name} - {hospital.location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) || date > new Date(new Date().setMonth(new Date().getMonth() + 3))} 
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time Slot *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* --- End of Form Fields --- */}

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit Pre-Registration"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

