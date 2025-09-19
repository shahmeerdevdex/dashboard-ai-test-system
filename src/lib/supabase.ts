import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "http://desktop-ld7ulf3:54321";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

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

// Types for the profiles table
export interface Profile {
  id: string;
  cnic_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  fingerprint_url?: string;
  fingerprint_template_size?: number;
  fingerprint_enrolled_at?: string;
  fingerprint_template?: Buffer;
  fingerprint_img?: string;
  facial_encoding?: any;
}
