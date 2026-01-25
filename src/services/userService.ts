// User profile management for user_profiles table
import {
  getUserProfile,
  createUserProfile,
  getStudentByAdmission,
  supabase,
} from "./supabase";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "teacher" | "student";
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Export the functions from supabase.ts directly
export { getUserProfile, createUserProfile, getStudentByAdmission };

// Additional utility functions

export const formatUserProfile = (profile: any): UserProfile => {
  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
    phone: profile.phone,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error && error.code === "PGRST116") {
      // No rows found
      return { data: null, error: null };
    }

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Get student profile with admission details
export const getStudentProfile = async (admissionNumber: string) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*, user_profiles(*)")
      .eq("admission_no", admissionNumber)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
