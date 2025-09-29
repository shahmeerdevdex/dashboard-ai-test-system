import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase, Profile } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// Local storage key for user session
const USER_SESSION_KEY = "driving_test_user_session";

// Session manager for local storage
const sessionManager = {
  getSession: () => {
    try {
      const session = localStorage.getItem(USER_SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },
  initSession: (user: User) => {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(USER_SESSION_KEY);
  },
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the user object to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => user, [user?.id, user?.email, user?.user_metadata?.cnic_id]);

  useEffect(() => {
    // Initialize authentication state
    const initializeAuth = async () => {
      try {
        console.log("🔐 Initializing authentication...");

        // First check our custom session
        const customSession = sessionManager.getSession();
        if (customSession) {
          console.log("✅ Found custom session:", customSession);
          setUser(customSession);
          setLoading(false);
          return;
        }

        console.log("ℹ️ No existing session found");
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signInWithCNIC = useCallback(async (cnicId: string, fullName?: string) => {
    try {
      console.log("🔐 Starting CNIC authentication...");

      // First, try to find existing user with this CNIC
      const { data: existingUser, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("cnic_id", cnicId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("❌ Error fetching user:", fetchError);
        return { success: false, error: "Database error. Please try again." };
      }

      if (existingUser) {
        console.log("✅ Found existing user:", existingUser);

        // Only verify full name if provided
        if (
          fullName &&
          fullName.trim() &&
          existingUser.full_name.toLowerCase() !== fullName.toLowerCase()
        ) {
          console.log("❌ Full name mismatch");
          return {
            success: false,
            error: "Full name does not match. Please check your details.",
          };
        }

        // Create user object for session
        const authenticatedUser = {
          id: existingUser.id,
          email: `${existingUser.cnic_id}@driving-test.local`,
          user_metadata: {
            cnic_id: existingUser.cnic_id,
            full_name: existingUser.full_name,
          },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
          role: "authenticated",
          updated_at: new Date().toISOString(),
        } as User;

        setUser(authenticatedUser);
        sessionManager.initSession(authenticatedUser);
        setLoading(false);

        return { success: true, user: authenticatedUser };
      } else {
        console.log("❌ User not found with CNIC:", cnicId);
        return { success: false, error: "User not found. Please register first." };
      }
    } catch (error) {
      console.error("❌ Error in CNIC authentication:", error);
      return { success: false, error: "Authentication error. Please try again." };
    }
  }, []);

  const registerWithCNIC = useCallback(async (cnicId: string, fullName: string) => {
    try {
      console.log("🔐 Starting CNIC registration...");

      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("cnic_id", cnicId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("❌ Error checking existing user:", fetchError);
        return { success: false, error: "Database error. Please try again." };
      }

      if (existingUser) {
        console.log("❌ User already exists with CNIC:", cnicId);
        return { success: false, error: "User already registered with this CNIC." };
      }

      // Create new user
      console.log("🔐 Creating user with data:", {
        cnicId,
        fullName,
      });

      const userData = {
        cnic_id: cnicId,
        full_name: fullName,
      };

      const { data: newUser, error: insertError } = await supabase
        .from("profiles")
        .insert([userData])
        .select()
        .single();

      if (insertError) {
        console.error("❌ Error creating user:", insertError);
        return { success: false, error: `Failed to create user: ${insertError.message}` };
      }

      console.log("✅ User registered successfully:", newUser);

      // Create user object for session
      const authenticatedUser = {
        id: newUser.id,
        email: `${newUser.cnic_id}@driving-test.local`,
        user_metadata: {
          cnic_id: newUser.cnic_id,
          full_name: newUser.full_name,
        },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
        role: "authenticated",
        updated_at: new Date().toISOString(),
      } as User;

      setUser(authenticatedUser);
      sessionManager.initSession(authenticatedUser);

      return { success: true, user: authenticatedUser };
    } catch (error) {
      console.error("❌ Error in CNIC registration:", error);
      return { success: false, error: "Registration error. Please try again." };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log("🔐 Starting sign out...");

      // Clear session
      sessionManager.clearSession();

      // Clear user state
      setUser(null);

      console.log("✅ Signed out successfully");
    } catch (error) {
      console.error("❌ Error in sign out:", error);
    }
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  const authValue = useMemo(
    () => ({
      user: memoizedUser,
      loading,
      signInWithCNIC,
      registerWithCNIC,
      signOut,
    }),
    [memoizedUser, loading, signInWithCNIC, registerWithCNIC, signOut]
  );

  return authValue;
};
