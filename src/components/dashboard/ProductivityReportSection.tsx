"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateProductivityReportAction } from "@/app/(app)/dashboard/actions";
import type { GenerateProductivityReportOutput } from "@/ai/flows/productivity-report";
import { Loader2, Download, BarChartBig } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function ProductivityReportSection() {
  const [report, setReport] = useState<GenerateProductivityReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    // Set default dates: last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    setStartDate(format(sevenDaysAgo, "yyyy-MM-dd"));
    setEndDate(format(today, "yyyy-MM-dd"));
  }, []);


  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    if (!startDate || !endDate) {
      setError("Por favor, selecione as datas de início e fim.");
      setIsLoading(false);
      toast({ title: "Erro", description: "Datas de início e fim são obrigatórias.", variant: "destructive" });
      return;
    }

    try {
      // In a real app, userId would come from auth context
      const result = await generateProductivityReportAction({ userId: "user123", startDate, endDate });
      if (result.report) {
        setReport(result);
        toast({ title: "Relatório Gerado!", description: "Seu relatório de produtividade está pronto." });
      } else {
        throw new Error("O relatório retornado estava vazio.");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(`Falha ao gerar relatório: ${errorMessage}`);
      toast({ title: "Erro ao Gerar Relatório", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2"><BarChartBig className="text-primary w-6 h-6" />Relatório de Produtividade</CardTitle>
        <CardDescription>
          Analise sua produtividade, identifique padrões e otimize seu fluxo de trabalho.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date">Data de Início</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="end-date">Data de Fim</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BarChartBig className="mr-2 h-4 w-4" />
          )}
          Gerar Relatório
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {report && (
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Seu Relatório:</h3>
            <Textarea
              value={report.report}
              readOnly
              rows={10}
              className="bg-background text-foreground border-border"
            />
          </div>
        )}
      </CardContent>
      {report && (
        <CardFooter>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Baixar Relatório (PDF)
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
