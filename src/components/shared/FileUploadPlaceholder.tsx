"use client";

import { UploadCloud } from "lucide-react";
import { Button } from "../ui/button";
import { ChangeEvent, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadPlaceholderProps {
  onFileUpload: (file: File) => void;
  small?: boolean;
}

export function FileUploadPlaceholder({ onFileUpload, small = false }: FileUploadPlaceholderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // RN006: Documentos só serão salvos se o usuário completar o upload.
      // This is a placeholder. Actual upload logic would go here.
      onFileUpload(file);
      toast({
        title: "Arquivo Selecionado",
        description: `${file.name} pronto para upload. (Funcionalidade de upload real não implementada).`,
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (small) {
    return (
       <Button type="button" variant="outline" size="sm" onClick={handleClick} className="text-xs">
        <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
        Anexar
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </Button>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="mt-1 flex justify-center rounded-lg border border-dashed border-input-border/60 px-6 py-10 cursor-pointer hover:border-primary transition-colors bg-input/20"
    >
      <div className="text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
        <div className="mt-4 flex text-sm leading-6 text-foreground">
          <label
            htmlFor="file-upload-main"
            className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
          >
            <span>Carregar um arquivo</span>
            <input id="file-upload-main" name="file-upload-main" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} />
          </label>
          <p className="pl-1">ou arraste e solte</p>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, PDF etc. até 10MB</p>
      </div>
    </div>
  );
}
