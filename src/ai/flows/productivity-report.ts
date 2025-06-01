// src/ai/flows/productivity-report.ts
'use server';

/**
 * @fileOverview Generates a personalized productivity report for the user.
 *
 * - generateProductivityReport - A function that handles the generation of the productivity report.
 * - GenerateProductivityReportInput - The input type for the generateProductivityReport function.
 * - GenerateProductivityReportOutput - The return type for the generateProductivityReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductivityReportInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate the report for.'),
  startDate: z.string().describe('The start date for the report (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the report (YYYY-MM-DD).'),
});
export type GenerateProductivityReportInput = z.infer<
  typeof GenerateProductivityReportInputSchema
>;

const GenerateProductivityReportOutputSchema = z.object({
  report: z.string().describe('The generated productivity report.'),
});
export type GenerateProductivityReportOutput = z.infer<
  typeof GenerateProductivityReportOutputSchema
>;

export async function generateProductivityReport(
  input: GenerateProductivityReportInput
): Promise<GenerateProductivityReportOutput> {
  return generateProductivityReportFlow(input);
}

const generateProductivityReportPrompt = ai.definePrompt({
  name: 'generateProductivityReportPrompt',
  input: {
    schema: GenerateProductivityReportInputSchema,
  },
  output: {
    schema: GenerateProductivityReportOutputSchema,
  },
  prompt: `You are an AI assistant that generates personalized productivity reports for users.

  Analyze the user's task completion rate, most productive times, and potential bottlenecks between {{startDate}} and {{endDate}}.
  Provide actionable insights to optimize their workflow and improve overall efficiency.

  Generate a comprehensive productivity report for user {{userId}}:
  `,
});

const generateProductivityReportFlow = ai.defineFlow(
  {
    name: 'generateProductivityReportFlow',
    inputSchema: GenerateProductivityReportInputSchema,
    outputSchema: GenerateProductivityReportOutputSchema,
  },
  async input => {
    const {output} = await generateProductivityReportPrompt(input);
    return output!;
  }
);
