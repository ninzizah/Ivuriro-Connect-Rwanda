
"use client";

import MainLayout from '@/components/layout/main-layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit, Lightbulb, MapPin, AlertTriangle, ActivitySquare, Hospital, Clock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { suggestHospital, SuggestHospitalInput, SuggestHospitalOutput } from '@/ai/flows/suggest-hospital';

const suggestionSchema = z.object({
  symptoms: z.string().min(10, "Please describe symptoms in at least 10 characters.").max(500, "Symptoms description is too long."),
  location: z.string().min(3, "Location must be at least 3 characters.").max(100, "Location name is too long."),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

export default function AiHospitalSuggestionPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestHospitalOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      symptoms: "",
      location: "",
    },
  });

  async function onSubmit(data: SuggestionFormValues) {
    setIsLoading(true);
    setSuggestion(null);
    setError(null);
    try {
      const inputData: SuggestHospitalInput = {
        symptoms: data.symptoms,
        location: data.location,
      };
      const result = await suggestHospital(inputData);
      setSuggestion(result);
      toast({
        title: "Suggestion Ready!",
        description: `AI has suggested ${result.hospitalName}.`,
      });
    } catch (e) {
      console.error("AI suggestion error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get suggestion: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not fetch AI suggestion. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MainLayout>
      <section className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold font-headline text-primary">AI Hospital Suggestion</h1>
          <BrainCircuit className="h-8 w-8 text-accent" />
        </div>
        <p className="text-muted-foreground">
          Enter patient symptoms and location to get an AI-powered hospital recommendation.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Get Recommendation</CardTitle>
            <CardDescription>Provide details below for an AI-driven suggestion.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Symptoms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., chest pain, difficulty breathing, high fever" {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Current Location</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="e.g., Kigali, Nyarugenge Sector" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <ActivitySquare className="mr-2 h-4 w-4 animate-spin" />
                      Getting Suggestion...
                    </>
                  ) : "Suggest Hospital"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}>
          {isLoading && (
            <Card className="flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
              <ActivitySquare className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Analyzing information...</p>
              <p className="text-sm text-muted-foreground">Please wait a moment.</p>
            </Card>
          )}
          {!isLoading && suggestion && (
            <Card className="bg-primary/5 border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl text-primary font-headline">AI Recommendation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Suggested Hospital</h3>
                  <p className="text-xl font-semibold text-foreground flex items-center">
                    <Hospital className="h-5 w-5 mr-2 text-accent"/>
                    {suggestion.hospitalName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reason</h3>
                  <p className="text-foreground/90">{suggestion.reason}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Estimated Wait Time</h3>
                  <p className="text-foreground/90 flex items-center">
                     <Clock className="h-4 w-4 mr-2 text-accent"/>
                    {suggestion.waitTime}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                 <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                This is an AI-generated suggestion. Always verify with medical professionals for critical decisions.
              </CardFooter>
            </Card>
          )}
          {!isLoading && error && (
            <Card className="border-destructive bg-destructive/10">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" /> Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive/90">{error}</p>
              </CardContent>
            </Card>
          )}
          {!isLoading && !suggestion && !error && (
             <Card className="flex flex-col items-center justify-center min-h-[200px] border-dashed border-muted-foreground/30 bg-card">
              <BrainCircuit className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground">Your suggestion will appear here.</p>
              <p className="text-sm text-muted-foreground">Fill the form to get started.</p>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
