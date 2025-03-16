"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Download } from "lucide-react";
import { Toaster, toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { downloadImage } from "@/lib/downloadImage";
import { StyleSelector } from "@/components/StyleSelector";
import { ImageUpload } from "@/components/ImageUpload";

// Form validation schema
const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  imageCount: z.number().min(1).max(3),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4"]),
  style: z.string().default("none"),
  referenceImage: z.string().optional(),
  useReferenceContent: z.boolean().default(true),
  useReferenceStyle: z.boolean().default(false),
});

export default function ImageGeneratorPage() {
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      imageCount: 1,
      aspectRatio: "1:1",
      style: "none",
      referenceImage: "",
      useReferenceContent: true,
      useReferenceStyle: false,
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsGenerating(true);
      setImages([]);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: values.prompt,
          count: values.imageCount,
          aspectRatio: values.aspectRatio,
          style: values.style,
          referenceImage: values.referenceImage || undefined,
          useReferenceContent: values.useReferenceContent,
          useReferenceStyle: values.useReferenceStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate images");
      }

      setImages(data.images || []);
      toast.success("Images generated successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(errorMessage || "Failed to generate images");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center flex-1">
          Tim&apos;s AI Image Generator
        </h1>
        <Link href="/history" className="text-sm">
          <Button variant="outline" size="sm">
            View History
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the image you want to generate..."
                        className="resize-none min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be descriptive for better results.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageCount"
                render={({ field }) => (
                  <FormItem className="space-y-6">
                    <div className="space-y-1">
                      <FormLabel>Number of Images</FormLabel>
                      <FormDescription>
                        Generate between 1-3 images at once.
                      </FormDescription>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between mb-2">
                        {[1, 2, 3].map(num => (
                          <div 
                            key={num}
                            className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${
                              field.value === num 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                            onClick={() => field.onChange(num)}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                      
                      <FormControl>
                        <Slider
                          min={1}
                          max={3}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="mt-2"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Aspect Ratio</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 sm:grid-cols-5 gap-4"
                      >
                        {[
                          { value: "1:1", label: "Square (1:1)", width: "w-16", height: "h-16" },
                          { value: "16:9", label: "Landscape (16:9)", width: "w-16", height: "h-9" },
                          { value: "9:16", label: "Portrait (9:16)", width: "w-9", height: "h-16" },
                          { value: "4:3", label: "Standard (4:3)", width: "w-16", height: "h-12" },
                          { value: "3:4", label: "Portrait (3:4)", width: "w-12", height: "h-16" }
                        ].map((ratio) => (
                          <label
                            key={ratio.value}
                            htmlFor={`ratio-${ratio.value}`}
                            className={`flex flex-col items-center gap-2 cursor-pointer transition-colors ${field.value === ratio.value ? 'text-primary' : ''}`}
                          >
                            <div 
                              className={`border ${field.value === ratio.value ? 'border-primary dark:border-primary' : 'border-gray-300 dark:border-gray-700'} rounded-md bg-muted/20 w-24 h-24 flex items-center justify-center relative transition-colors hover:border-primary/50`}
                              onClick={() => field.onChange(ratio.value)}
                            >
                              <RadioGroupItem
                                value={ratio.value}
                                id={`ratio-${ratio.value}`}
                                className="absolute top-2 left-2 sr-only"
                              />
                              <div className={`${ratio.width} ${ratio.height} bg-primary/10 rounded`}></div>
                              {field.value === ratio.value && (
                                <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                </div>
                              )}
                            </div>
                            <span className="text-xs">
                              {ratio.label}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Select the image dimensions.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Style</FormLabel>
                    <FormControl>
                      <StyleSelector
                        selectedStyle={field.value}
                        onStyleChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a predefined style to enhance your prompt.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Image (Optional)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image as reference for content or style.
                    </FormDescription>
                  </FormItem>
                )}
              />

              {form.watch('referenceImage') && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="useReferenceContent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Use content from reference image</FormLabel>
                          <FormDescription>
                            Consider the content/subjects in the reference image.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="useReferenceStyle"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Use style from reference image</FormLabel>
                          <FormDescription>
                            Imitate the visual style of the reference image.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Images"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Generated Images</h2>

          {isGenerating && (
            <div className="flex justify-center items-center min-h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isGenerating && images.length === 0 && (
            <div className="text-center text-muted-foreground py-10 border rounded-lg">
              Generated images will appear here
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-2">
                  <div className="relative group">
                    <div className="w-full h-0 pb-[100%] relative overflow-hidden rounded-md">
                      <Image
                        src={
                          image.startsWith("data:")
                            ? image
                            : `data:image/png;base64,${image}`
                        }
                        alt={`Generated image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain bg-black/5 dark:bg-white/5"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        downloadImage(image, `generated-image-${index + 1}.png`)
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
