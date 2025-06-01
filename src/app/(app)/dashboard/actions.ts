"use server";

import { generateProductivityReport, type GenerateProductivityReportInput, type GenerateProductivityReportOutput } from "@/ai/flows/productivity-report";

export async function generateProductivityReportAction(
  input: GenerateProductivityReportInput
): Promise<GenerateProductivityReportOutput> {
  try {
    // Add any necessary validation or preprocessing here
    if (!input.userId || !input.startDate || !input.endDate) {
      throw new Error("User ID, start date, and end date are required.");
    }
    
    const reportOutput = await generateProductivityReport(input);
    
    if (!reportOutput || !reportOutput.report) {
        throw new Error("AI flow did not return a valid report.");
    }

    return reportOutput;
  } catch (error) {
    console.error("Error in generateProductivityReportAction:", error);
    // It's better to return a structured error or throw a custom error
    // For simplicity, re-throwing the original error or a generic one
    if (error instanceof Error) {
        throw new Error(`Failed to generate productivity report: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the productivity report.");
  }
}
