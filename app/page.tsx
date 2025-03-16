"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Download } from "lucide-react";
import { Toaster, toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
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
      <h1 className="text-3xl font-bold mb-8 text-center">
        Tim&apos;s AI Image Generator
      </h1>

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
                  <FormItem>
                    <FormLabel>Number of Images: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={3}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Generate between 1-3 images at once.
                    </FormDescription>
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
                        defaultValue={field.value}
                        className="grid grid-cols-2 sm:grid-cols-5 gap-4"
                      >
                        <div
                          className="flex flex-col items-center gap-2 cursor-pointer"
                          onClick={() => field.onChange("1:1")}
                        >
                          <div className="border border-gray-300 dark:border-gray-700 rounded-md bg-muted/20 w-24 h-24 flex items-center justify-center relative">
                            <RadioGroupItem
                              value="1:1"
                              id="ratio-1:1"
                              className="absolute top-2 left-2"
                            />
                            <div className="w-16 h-16 bg-primary/10 rounded"></div>
                          </div>
                          <label htmlFor="ratio-1:1" className="text-xs">
                            Square (1:1)
                          </label>
                        </div>

                        <div
                          className="flex flex-col items-center gap-2 cursor-pointer"
                          onClick={() => field.onChange("16:9")}
                        >
                          <div className="border border-gray-300 dark:border-gray-700 rounded-md bg-muted/20 w-24 h-24 flex items-center justify-center relative">
                            <RadioGroupItem
                              value="16:9"
                              id="ratio-16:9"
                              className="absolute top-2 left-2"
                            />
                            <div className="w-16 h-9 bg-primary/10 rounded"></div>
                          </div>
                          <label htmlFor="ratio-16:9" className="text-xs">
                            Landscape (16:9)
                          </label>
                        </div>

                        <div
                          className="flex flex-col items-center gap-2 cursor-pointer"
                          onClick={() => field.onChange("9:16")}
                        >
                          <div className="border border-gray-300 dark:border-gray-700 rounded-md bg-muted/20 w-24 h-24 flex items-center justify-center relative">
                            <RadioGroupItem
                              value="9:16"
                              id="ratio-9:16"
                              className="absolute top-2 left-2"
                            />
                            <div className="w-9 h-16 bg-primary/10 rounded"></div>
                          </div>
                          <label htmlFor="ratio-9:16" className="text-xs">
                            Portrait (9:16)
                          </label>
                        </div>

                        <div
                          className="flex flex-col items-center gap-2 cursor-pointer"
                          onClick={() => field.onChange("4:3")}
                        >
                          <div className="border border-gray-300 dark:border-gray-700 rounded-md bg-muted/20 w-24 h-24 flex items-center justify-center relative">
                            <RadioGroupItem
                              value="4:3"
                              id="ratio-4:3"
                              className="absolute top-2 left-2"
                            />
                            <div className="w-16 h-12 bg-primary/10 rounded"></div>
                          </div>
                          <label htmlFor="ratio-4:3" className="text-xs">
                            Standard (4:3)
                          </label>
                        </div>

                        <div
                          className="flex flex-col items-center gap-2 cursor-pointer"
                          onClick={() => field.onChange("3:4")}
                        >
                          <div className="border border-gray-300 dark:border-gray-700 rounded-md bg-muted/20 w-24 h-24 flex items-center justify-center relative">
                            <RadioGroupItem
                              value="3:4"
                              id="ratio-3:4"
                              className="absolute top-2 left-2"
                            />
                            <div className="w-12 h-16 bg-primary/10 rounded"></div>
                          </div>
                          <label htmlFor="ratio-3:4" className="text-xs">
                            Portrait (3:4)
                          </label>
                        </div>
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
