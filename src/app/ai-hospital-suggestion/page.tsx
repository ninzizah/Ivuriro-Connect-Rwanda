
"use client";

import MainLayout from '@/components/layout/main-layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit, Lightbulb, MapPin, AlertTriangle, ActivitySquare, Hospital, Clock, ShieldAlert, Star } from "lucide-react";
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

      let toastDescription = "AI has provided a recommendation.";
      let toastTitle = "Suggestion Ready!";

      if (result.suggestionType === "ROUTINE_HOSPITAL" || result.suggestionType === "SPECIALIZED_CARE") {
        if (result.hospitalName && result.hospitalName !== "N/A" && !result.hospitalName.toLowerCase().includes("contact emergency")) {
          toastDescription = `AI has suggested ${result.hospitalName}.`;
        } else {
          toastDescription = `AI has provided guidance for specialized care. See details.`;
        }
      } else if (result.suggestionType === "EMERGENCY_CONTACT") {
        toastTitle = "Urgent Health Alert!";
        toastDescription = "AI has provided critical health instructions. Please review details immediately.";
      }

      toast({
        title: toastTitle,
        description: toastDescription,
        variant: result.suggestionType === "EMERGENCY_CONTACT" ? "destructive" : "default",
        duration: result.suggestionType === "EMERGENCY_CONTACT" ? 9000 : 5000,
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
          Enter patient symptoms and location to get an AI-powered hospital or action recommendation.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Get Recommendation</CardTitle>
            <CardDescription>Provide details below for an AI-driven suggestion. For critical or rapidly worsening conditions, always call emergency services (e.g. 114) immediately.</CardDescription>
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
                        <Textarea placeholder="e.g., chest pain, difficulty breathing, high fever, unexplained rash or bleeding" {...field} className="min-h-[100px]" />
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
                  ) : "Suggest Action/Hospital"}
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
            <>
              {suggestion.suggestionType === "EMERGENCY_CONTACT" && (
                <Card className="bg-destructive/10 border-destructive shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <ShieldAlert className="h-8 w-8 text-destructive" />
                      <CardTitle className="text-2xl text-destructive font-headline">Urgent Public Health Alert!</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Assessment</h3>
                      <p className="text-lg font-semibold text-destructive/90">{suggestion.reason}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Critical Instructions</h3>
                      <p className="text-foreground/90 whitespace-pre-line">{suggestion.instructions}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-destructive/80 border-t pt-3 border-destructive/30">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Follow instructions carefully. This is critical for your health and public safety. Do not delay.
                  </CardFooter>
                </Card>
              )}

              {(suggestion.suggestionType === "ROUTINE_HOSPITAL" || suggestion.suggestionType === "SPECIALIZED_CARE") && (
                <Card className="bg-primary/5 border-primary/20 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {suggestion.suggestionType === "SPECIALIZED_CARE" ? <Star className="h-8 w-8 text-primary" /> : <Lightbulb className="h-8 w-8 text-primary" /> }
                      <CardTitle className="text-2xl text-primary font-headline">
                        {suggestion.suggestionType === "SPECIALIZED_CARE" ? "Specialized Care Recommendation" : "AI Recommendation"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {suggestion.hospitalName && suggestion.hospitalName !== "N/A" && !suggestion.hospitalName.toLowerCase().includes("contact emergency") && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Suggested Facility</h3>
                        <p className="text-xl font-semibold text-foreground flex items-center">
                          <Hospital className="h-5 w-5 mr-2 text-accent"/>
                          {suggestion.hospitalName}
                        </p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reason / Assessment</h3>
                      <p className="text-foreground/90">{suggestion.reason}</p>
                    </div>
                    {suggestion.waitTime && suggestion.waitTime !== "N/A" && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Estimated Wait Time</h3>
                        <p className="text-foreground/90 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-accent"/>
                          {suggestion.waitTime}
                        </p>
                      </div>
                    )}
                    {suggestion.instructions && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Additional Instructions</h3>
                        <p className="text-foreground/90 whitespace-pre-line">{suggestion.instructions}</p>
                      </div>
                    )}
                  </CardContent>
                   <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                    This is an AI-generated suggestion. Always verify with medical professionals for critical decisions. If condition is urgent, call emergency services.
                  </CardFooter>
                </Card>
              )}
            </>
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

