"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Subtask, Priority, TaskStatus } from "@/lib/types";
import { CalendarIcon, Save } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const priorities: Priority[] = ["Alta", "Média", "Baixa"];
const statuses: TaskStatus[] = ["pendente", "em-progresso", "concluída"];

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome da subtarefa é obrigatório." }),
  priority: z.enum(priorities, { required_error: "Prioridade é obrigatória." }),
  deadline: z.date({ required_error: "Data limite é obrigatória." }),
  estimatedTime: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(statuses).optional(),
});

type SubtaskFormValues = z.infer<typeof formSchema>;

interface SubtaskFormProps {
  onSave: (data: Omit<Subtask, "id" | "createdAt"> | Subtask) => void;
  initialData?: Subtask | null;
  onClose: () => void;
}

export function SubtaskForm({ onSave, initialData, onClose }: SubtaskFormProps) {
  const form = useForm<SubtaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          priority: initialData.priority,
          deadline: parseISO(initialData.deadline),
          estimatedTime: initialData.estimatedTime || "",
          description: initialData.description || "",
          status: initialData.status,
        }
      : {
          name: "",
          priority: "Média",
          deadline: new Date(),
          estimatedTime: "",
          description: "",
          status: "pendente",
        },
  });

  function onSubmit(values: SubtaskFormValues) {
    const subtaskDataToSave = {
      ...values,
      deadline: values.deadline.toISOString(),
      status: values.status || "pendente",
    };
    if (initialData) {
      onSave({ ...initialData, ...subtaskDataToSave });
    } else {
      onSave(subtaskDataToSave as Omit<Subtask, "id" | "createdAt">);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Subtarefa</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Testar responsividade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Limite</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal justify-start",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {initialData && ( // Show status field only when editing
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="estimatedTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo Estimado (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 2h, 30m" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes sobre a subtarefa..."
                  className="resize-none"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="font-headline bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Salvar Subtarefa
          </Button>
        </div>
      </form>
    </Form>
  );
}
