"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prompt } from "@/lib/supabase";
import Link from "next/link";

export default function PromptHistoryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchPrompts(pageNum = 1) {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/prompts?page=${pageNum}&limit=10`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch prompts");
      }
      
      setPrompts(data.prompts || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching prompts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrompts();
  }, []);

  function formatDate(dateString?: string) {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleString();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prompt History</h1>
        <Link href="/">
          <Button variant="outline">Back to Generator</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {!loading && prompts.length === 0 && (
        <div className="text-center py-20 border rounded-lg">
          No prompts found in history.
        </div>
      )}

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                <span className="font-medium">Created:</span>{" "}
                {formatDate(prompt.created_at)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div>
                  <span className="font-medium">Prompt:</span> {prompt.prompt_text}
                </div>
                {prompt.style && (
                  <div>
                    <span className="font-medium">Style:</span> {prompt.style}
                  </div>
                )}
                <div>
                  <span className="font-medium">Aspect Ratio:</span>{" "}
                  {prompt.aspect_ratio || "1:1"}
                </div>
                <div>
                  <span className="font-medium">Reference Image:</span>{" "}
                  {prompt.reference_image_used ? "Yes" : "No"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => fetchPrompts(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => fetchPrompts(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}