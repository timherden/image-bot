"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const firstRejection = rejectedFiles[0];
        const errorMessage =
          firstRejection.errors[0]?.message || "Invalid file";
        setError(errorMessage);
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setError(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-md p-4 transition-colors hover:bg-muted/30 cursor-pointer",
          isDragActive && "border-primary bg-muted/40",
          value && "border-solid",
          error && "border-destructive"
        )}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className="relative w-full h-36 overflow-hidden rounded-md">
            <Image
              src={value}
              alt="Reference image"
              fill
              className="object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 h-6 w-6"
              type="button"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
            <div className="flex justify-center mb-2">
              {isDragActive ? (
                <Upload className="h-10 w-10 text-primary animate-pulse" />
              ) : (
                <ImageIcon className="h-10 w-10" />
              )}
            </div>
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop image here"
                : "Drag & drop a reference image"}
            </p>
            <p className="text-xs mt-1">
              or click to select (PNG, JPG, WebP up to 5MB and max 1024x1024)
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
