import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uqaoyfttymijbsxnxuqy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxYW95ZnR0eW1pamJzeG54dXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzYxNTYsImV4cCI6MjA3MDExMjE1Nn0.QHHeO3MXHZSsCas2RXxdunwpfRSDVlNF2khbRr8LSts";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for the profile_test_results table
export interface ProfileTestResult {
  id: number;
  user_id: string;
  cons_result: string | null;
  seatbelt_result: string | null;
  lane_result: string | null;
  handbreak_result: string | null;
  backlight_result: string | null;
  user_image_at_test_start: string | null;
  user_image_at_test_end: string | null;
  overall_result: string | null;
  final_result: string | null;
  created_at: string | null;
  updated_at: string | null;
  test_start_time: string | null;
  test_end_time: string | null;
}

// Types for the profiles table (assuming it exists)
export interface Profile {
  id: string;
  name?: string;
  email?: string;
  cnic?: string;
  // Add other profile fields as needed
}
