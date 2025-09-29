import { supabase, ProfileTestResult, Profile } from "./supabase";

export interface TestRecord {
  id: string;
  userName: string;
  email: string;
  cnic: string;
  startTime: string;
  endTime: string | null;
  status: "pass" | "failed" | "in-progress" | "pending";
  currentPhase?: string;
  duration?: string;
  testCount: number;
  failReason?: string;
  // Detailed test results from profile_test_results
  consResult?: string | null;
  seatbeltResult?: string | null;
  laneResult?: string | null;
  handbreakResult?: string | null;
  backlightResult?: string | null;
  overallResult?: string | null;
  finalResult?: string | null;
  images: {
    startImage: string;
    endImage: string;
  };
}

// Fetch all test records with profile information
export async function fetchTestRecords(): Promise<TestRecord[]> {
  try {
    // Join profile_test_results with profiles table to get user details
    const { data, error } = await supabase
      .from("profile_test_results")
      .select(
        `
        *,
        profiles!inner(
          id,
          cnic_id,
          full_name,
          email,
          phone
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching test records:", error);
      return [];
    }

    console.log("Fetched test records with profiles:", data);

    // Transform the data to match our existing interface
    return data.map((test: any) => ({
      id: `T${String(test.id).padStart(3, "0")}`,
      userName: test.profiles?.full_name || `User ${test.id}`,
      email: test.profiles?.email || `${test.profiles?.cnic_id || test.id}@email.com`,
      cnic: test.profiles?.cnic_id || `00000-0000000-${test.id}`,
      startTime: test.test_start_time || test.created_at || new Date().toISOString(),
      endTime: test.test_end_time,
      status: mapStatus(test.overall_result, test.test_end_time),
      currentPhase: test.overall_result === null ? "Test in Progress" : undefined,
      duration:
        test.test_start_time && test.test_end_time
          ? calculateDuration(test.test_start_time, test.test_end_time)
          : undefined,
      testCount: 1, // You might want to calculate this based on profile history
      failReason: test.overall_result === "fail" ? getFailureReason(test) : undefined,
      // Detailed test results
      consResult: test.cons_result,
      seatbeltResult: test.seatbelt_result,
      laneResult: test.lane_result,
      handbreakResult: test.handbreak_result,
      backlightResult: test.backlight_result,
      overallResult: test.overall_result,
      finalResult: test.final_result,
      images: {
        startImage:
          test.user_image_at_test_start ||
          `https://images.unsplash.com/photo-1494790108755-2616c5e8f0c2?w=400&h=300&fit=crop&sig=${test.id}`,
        endImage:
          test.user_image_at_test_end ||
          `https://images.unsplash.com/photo-1494790108755-2616c5e8f0c2?w=400&h=300&fit=crop&sig=${test.id}`,
      },
    }));
  } catch (error) {
    console.error("Error in fetchTestRecords:", error);
    return [];
  }
}

// Map Supabase status to our status enum
function mapStatus(
  finalResult: string | null,
  testEndTime: string | null
): "pass" | "failed" | "in-progress" | "pending" {
  if (testEndTime) {
    // Test has ended
    if (finalResult === "pass") {
      return "pass";
    } else if (finalResult === "fail") {
      return "failed";
    }
    return "failed"; // Default to failed if test ended but no clear result
  }

  if (finalResult === null) {
    return "in-progress"; // Test is ongoing
  }

  return "pending"; // Test hasn't started yet
}

// Get failure reason based on individual test results
function getFailureReason(test: any): string {
  const failures = [];

  if (test.cons_result === "failed") failures.push("Consistency check");
  if (test.seatbelt_result === "failed") failures.push("Seatbelt check");
  if (test.lane_result === "failed") failures.push("Lane discipline");
  if (test.handbreak_result === "failed") failures.push("Handbrake check");
  if (test.backlight_result === "failed") failures.push("Backlight check");

  if (failures.length > 0) {
    return `Failed: ${failures.join(", ")}`;
  }

  return "Test failed - see details";
}

// Calculate duration between start and end time
function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  return `${diffMins}:${diffSecs.toString().padStart(2, "0")}`;
}

// Update test status
export async function updateTestStatus(testId: number, finalResult: string, testEndTime?: string) {
  try {
    const updateData: any = {
      final_result: finalResult,
      updated_at: new Date().toISOString(),
    };

    if (testEndTime) {
      updateData.test_end_time = testEndTime;
    }

    const { error } = await supabase
      .from("profile_test_results")
      .update(updateData)
      .eq("id", testId);

    if (error) {
      console.error("Error updating test status:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in updateTestStatus:", error);
    return false;
  }
}

// Start a test
export async function startTest(userId: string) {
  try {
    const { error } = await supabase.from("profile_test_results").insert({
      user_id: userId,
      test_start_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error starting test:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in startTest:", error);
    return false;
  }
}

// Update individual test results
export async function updateTestResult(testId: number, resultType: string, result: string) {
  try {
    const updateData: any = {
      [resultType]: result,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profile_test_results")
      .update(updateData)
      .eq("id", testId);

    if (error) {
      console.error("Error updating test result:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in updateTestResult:", error);
    return false;
  }
}
