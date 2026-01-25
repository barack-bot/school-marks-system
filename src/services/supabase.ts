import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local",
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

// Auth functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Database functions
export const getStudents = async () => {
  const { data, error } = await supabase.from("students").select("*");
  return { data, error };
};

export const addStudent = async (student: any) => {
  const { data, error } = await supabase.from("students").insert([student]);
  return { data, error };
};

export const updateStudent = async (id: number, student: any) => {
  const { data, error } = await supabase
    .from("students")
    .update(student)
    .eq("id", id);
  return { data, error };
};

export const deleteStudent = async (id: number) => {
  const { data, error } = await supabase.from("students").delete().eq("id", id);
  return { data, error };
};

export const getMarks = async () => {
  const { data, error } = await supabase.from("marks").select("*");
  return { data, error };
};

export const addMark = async (mark: any) => {
  const { data, error } = await supabase.from("marks").insert([mark]);
  return { data, error };
};

export const getClasses = async () => {
  const { data, error } = await supabase.from("classes").select("*");
  return { data, error };
};

export const getSubjects = async () => {
  const { data, error } = await supabase.from("subjects").select("*");
  return { data, error };
};

export const getTeachers = async () => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("role", "teacher");
  return { data, error };
};
