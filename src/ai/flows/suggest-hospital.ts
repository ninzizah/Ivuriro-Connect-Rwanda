
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting the best hospital or course of action based on patient symptoms, location, wait times, and services, with special handling for contagious diseases.
 *
 * - suggestHospital - A function that suggests the best hospital or action for a patient.
 * - SuggestHospitalInput - The input type for the suggestHospital function.
 * - SuggestHospitalOutput - The return type for the suggestHospital function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHospitalInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The patient symptoms, comma separated, e.g. chest pain, shortness of breath, high fever and unexplained bleeding'),
  location: z.string().describe('The patient location, e.g. Kigali'),
});
export type SuggestHospitalInput = z.infer<typeof SuggestHospitalInputSchema>;

const SuggestHospitalOutputSchema = z.object({
  suggestionType: z.enum(["ROUTINE_HOSPITAL", "EMERGENCY_CONTACT", "SPECIALIZED_CARE"])
    .describe('The type of suggestion provided: ROUTINE_HOSPITAL for standard hospital visit, EMERGENCY_CONTACT for urgent contact with authorities/hotlines, SPECIALIZED_CARE for specific clinic or protocol.'),
  hospitalName: z.string().optional().describe('The name of the suggested hospital, if applicable (e.g., "N/A" if suggestionType is EMERGENCY_CONTACT).'),
  reason: z.string().describe('The reason for the suggestion or the assessment of symptoms.'),
  waitTime: z.string().optional().describe('The estimated wait time at the suggested hospital, if applicable (e.g., "N/A" if suggestionType is EMERGENCY_CONTACT).'),
  instructions: z.string().optional().describe('Specific instructions for the patient, especially crucial for EMERGENCY_CONTACT (e.g., "Isolate immediately. Call 114...") or SPECIALIZED_CARE types.'),
});
export type SuggestHospitalOutput = z.infer<typeof SuggestHospitalOutputSchema>;

export async function suggestHospital(input: SuggestHospitalInput): Promise<SuggestHospitalOutput> {
  return suggestHospitalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHospitalPrompt',
  input: {schema: SuggestHospitalInputSchema},
  output: {schema: SuggestHospitalOutputSchema},
  prompt: `You are an AI assistant for Rwanda Health Connect, helping to provide initial guidance based on patient symptoms and location. Your primary goal is patient safety and public health.

  Given the following symptoms and location:
  Symptoms: {{{symptoms}}}
  Location: {{{location}}}

  Analyze the symptoms carefully.
  1. If the symptoms strongly suggest a highly contagious and dangerous condition (e.g., Ebola-like symptoms such as high fever, severe headache, muscle pain, weakness, fatigue, diarrhea, vomiting, abdominal pain, unexplained hemorrhage; or severe COVID-19 symptoms with difficulty breathing), your primary suggestion MUST NOT be to go directly to a standard hospital without prior contact.
     - In such cases, set suggestionType to "EMERGENCY_CONTACT".
     - For hospitalName, state "N/A - Contact Emergency Services".
     - For reason, explain the potential severity and contagiousness (e.g., "Symptoms are serious and may indicate a highly contagious illness requiring immediate specialized attention and public health measures.").
     - For waitTime, state "N/A".
     - For instructions, provide clear, actionable steps:
       - "Immediately isolate yourself from others to prevent potential spread."
       - "Call the Rwandan emergency hotline: 114 for immediate medical guidance."
       - "Clearly describe your symptoms to the emergency service operator."
       - "Do NOT travel to any health facility or public place until instructed by health authorities."
       - "Follow all instructions provided by the emergency medical team."

  2. If the symptoms are serious but not immediately indicative of a highly contagious public health emergency, but might require specialized care not available at all hospitals (e.g., severe burns, complex cardiac issues needing a specialized unit, stroke symptoms):
     - Set suggestionType to "SPECIALIZED_CARE".
     - Suggest the most appropriate hospital with the required specialty (hospitalName).
     - Explain why this hospital is chosen (reason), focusing on its specialized capabilities.
     - Provide estimated waitTime if available for that specialty, otherwise "N/A".
     - Provide any specific instructions (e.g., "This hospital has a dedicated stroke unit. Inform them you are en route if possible after calling emergency services if condition is critical.").

  3. For other general symptoms requiring medical attention that do not fall into the above categories:
     - Set suggestionType to "ROUTINE_HOSPITAL".
     - Suggest the best general hospital considering proximity, services, and current wait times (hospitalName, reason, waitTime).
     - For instructions, you can provide general advice like "Proceed to the suggested hospital for consultation. If your condition worsens, seek emergency care immediately."

  Ensure all output fields (suggestionType, hospitalName, reason, waitTime, instructions) are appropriately and thoughtfully filled based on your analysis. Your response is critical and will guide potentially life-saving actions.
  Safety settings are configured to allow discussion of these topics.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE', // Allow discussion of dangerous symptoms
      }
    ]
  }
});

const suggestHospitalFlow = ai.defineFlow(
  {
    name: 'suggestHospitalFlow',
    inputSchema: SuggestHospitalInputSchema,
    outputSchema: SuggestHospitalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a suggestion.");
    }
    // Basic validation or default setting if AI misses a field for some reason
    if (!output.suggestionType) output.suggestionType = "ROUTINE_HOSPITAL";
    if (output.suggestionType === "EMERGENCY_CONTACT") {
        output.hospitalName = output.hospitalName || "N/A - Contact Emergency Services";
        output.waitTime = output.waitTime || "N/A";
    }
    return output;
  }
);

