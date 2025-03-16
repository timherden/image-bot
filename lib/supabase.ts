import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export type Prompt = {
  id?: number;
  prompt_text: string;
  style?: string;
  aspect_ratio?: string;
  created_at?: string;
  reference_image_used?: boolean;
}

// Helper function to save prompts to database
export async function savePrompt(data: Prompt): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('prompts')
      .insert([data]);

    if (error) {
      console.error('Error saving prompt:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error saving prompt';
    console.error('Error in savePrompt:', errorMessage);
    return { success: false, error: errorMessage };
  }
}