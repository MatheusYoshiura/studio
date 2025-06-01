
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
import type { Task, Priority, TaskStatus, FileAttachment } from "@/lib/types";
import { CalendarIcon, Save, Paperclip, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FileUploadPlaceholder } from "../shared/FileUploadPlaceholder";
import { useState, useEffect } from "react";

const priorities: Priority[] = ["Alta", "Média", "Baixa"];
const statuses: TaskStatus[] = ["pendente", "em-progresso", "concluída"];

// Form schema does not include attachments directly as they are managed separately
const formSchema = z.object({
  name: z.string().min(1, { message: "Nome da tarefa é obrigatório." }),
  priority: z.enum(priorities, { required_error: "Prioridade é obrigatória." }),
  deadline: z.date({ required_error: "Data limite é obrigatória." }),
  description: z.string().optional(),
  status: z.enum(statuses).optional(),
});

type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  onSave: (data: Omit<Task, "id" | "createdAt" | "subtasks"> | Task) => void; // attachments will be part of data
  initialData?: Task | null;
  onClose: () => void;
}

export function TaskForm({ onSave, initialData, onClose }: TaskFormProps) {
  const [currentAttachments, setCurrentAttachments] = useState<FileAttachment[]>([]);

  useEffect(() => {
    if (initialData?.attachments) {
      setCurrentAttachments(initialData.attachments);
    } else {
      setCurrentAttachments([]);
    }
  }, [initialData]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          priority: initialData.priority,
          deadline: parseISO(initialData.deadline),
          description: initialData.description || "",
          status: initialData.status,
        }
      : {
          name: "",
          priority: "Média",
          deadline: new Date(),
          description: "",
          status: "pendente",
        },
  });

  const handleFileUpload = (file: File) => {
    const newAttachment: FileAttachment = {
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file), // Temporary client-side URL
      size: file.size,
      type: file.type,
      file: file // Store original file if needed later
    };
    setCurrentAttachments(prev => [...prev, newAttachment]);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    const attachmentToRemove = currentAttachments.find(att => att.id === attachmentId);
    if (attachmentToRemove && attachmentToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachmentToRemove.url); // Clean up blob URL
    }
    setCurrentAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  function onSubmit(values: TaskFormValues) {
    const taskDataToSave = {
      ...values,
      deadline: values.deadline.toISOString(),
      status: values.status || "pendente", 
      attachments: currentAttachments, // Add current attachments to the task data
      // subtasks are not managed by this form directly, should be preserved if editing
      subtasks: initialData?.subtasks || [], 
    };
    
    if (initialData) {
      onSave({ ...initialData, ...taskDataToSave });
    } else {
      // For new tasks, ensure subtasks is an empty array if not provided
      const finalNewTaskData = {
        ...taskDataToSave,
        subtasks: taskDataToSave.subtasks || [],
      }
      onSave(finalNewTaskData as Omit<Task, "id" | "createdAt">);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Tarefa</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Desenvolver nova feature..." {...field} />
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
                      <SelectValue placeholder="Selecione a prioridade" />
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
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } 
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {initialData && ( 
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes sobre a tarefa..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Anexos</FormLabel>
          <FileUploadPlaceholder onFileUpload={handleFileUpload} />
          {currentAttachments.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground">Arquivos selecionados:</h4>
              <ul className="space-y-1">
                {currentAttachments.map(att => (
                  <li key={att.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <a href={att.url} target="_blank" rel="noopener noreferrer" className="hover:underline" title={att.name}>
                        {att.name.length > 30 ? `${att.name.substring(0,27)}...` : att.name}
                      </a>
                       <span className="text-xs text-muted-foreground">({(att.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveAttachment(att.id)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="font-headline bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Salvar Tarefa
          </Button>
        </div>
      </form>
    </Form>
  );
}
