'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting the best hospital based on patient symptoms, location, wait times, and services.
 *
 * - suggestHospital - A function that suggests the best hospital for a patient.
 * - SuggestHospitalInput - The input type for the suggestHospital function.
 * - SuggestHospitalOutput - The return type for the suggestHospital function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHospitalInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The patient symptoms, comma separated, e.g. chest pain, shortness of breath'),
  location: z.string().describe('The patient location, e.g. Kigali'),
});
export type SuggestHospitalInput = z.infer<typeof SuggestHospitalInputSchema>;

const SuggestHospitalOutputSchema = z.object({
  hospitalName: z.string().describe('The name of the suggested hospital.'),
  reason: z.string().describe('The reason for suggesting this hospital.'),
  waitTime: z.string().describe('The estimated wait time at the suggested hospital.'),
});
export type SuggestHospitalOutput = z.infer<typeof SuggestHospitalOutputSchema>;

export async function suggestHospital(input: SuggestHospitalInput): Promise<SuggestHospitalOutput> {
  return suggestHospitalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHospitalPrompt',
  input: {schema: SuggestHospitalInputSchema},
  output: {schema: SuggestHospitalOutputSchema},
  prompt: `You are an AI assistant helping paramedics to find the best hospital for a patient.

  Given the following symptoms and location, suggest the best hospital to take the patient to.
  Consider the hospital's proximity, services offered, and current wait times.

  Symptoms: {{{symptoms}}}
  Location: {{{location}}}

  Make sure to fill in the reason and waitTime fields with as accurate information as possible.
  Hospital Name:`,
});

const suggestHospitalFlow = ai.defineFlow(
  {
    name: 'suggestHospitalFlow',
    inputSchema: SuggestHospitalInputSchema,
    outputSchema: SuggestHospitalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
