// Supabase database schema setup and user role management
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "student";
  admissionNumber?: string;
  createdAt: string;
}

// Create user profile in database
export const createUserProfile = async (
  userId: string,
  email: string,
  name: string,
  role: "admin" | "teacher" | "student",
  admissionNumber?: string,
): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.from("users").insert([
      {
        id: userId,
        email,
        name,
        role,
        admission_number: admissionNumber,
        created_at: new Date(),
      },
    ]);

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Get user profile and role
export const getUserProfile = async (
  userId: string,
): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return { data: null, error };
    }

    return {
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        admissionNumber: data.admission_number,
        createdAt: data.created_at,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Check if email exists with role
export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
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

// Get student by admission number
export const getStudentByAdmission = async (
  admissionNumber: string,
): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("admission_number", admissionNumber)
      .eq("role", "student")
      .single();

    if (error) {
      return { data: null, error };
    }

    return {
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        admissionNumber: data.admission_number,
        createdAt: data.created_at,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
};
