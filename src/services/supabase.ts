import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local",
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

// =============================================
// AUTH FUNCTIONS
// =============================================

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

export const getCurrentSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// =============================================
// USER PROFILE FUNCTIONS (matches schema)
// =============================================

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
};

export const createUserProfile = async (
  userId: string,
  email: string,
  fullName: string,
  role: "admin" | "teacher" | "student",
  phone?: string,
) => {
  try {
    // Add small delay to ensure auth user is created in Supabase backend
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { data, error } = await supabase.from("user_profiles").insert([
      {
        id: userId,
        email,
        full_name: fullName,
        role,
        phone,
      },
    ]);

    if (error) {
      console.error("Profile creation error:", error);
      // If FK constraint fails, user might not exist in auth yet
      if (error.code === "23503") {
        return {
          data: null,
          error: {
            message:
              "User not yet confirmed. Please check your email and verify your account.",
            code: error.code,
          },
        };
      }
    }

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const updateUserProfile = async (userId: string, profile: any) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(profile)
    .eq("id", userId);
  return { data, error };
};

// =============================================
// STUDENTS FUNCTIONS
// =============================================

export const getStudents = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("*, classes(name, section)");
  return { data, error };
};

export const getStudentById = async (studentId: number) => {
  const { data, error } = await supabase
    .from("students")
    .select("*, classes(name, section)")
    .eq("id", studentId)
    .single();
  return { data, error };
};

export const getStudentsByClass = async (classId: number) => {
  const { data, error } = await supabase
    .from("students")
    .select("*, classes(name, section)")
    .eq("class_id", classId);
  return { data, error };
};

export const getStudentByAdmission = async (admissionNo: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("admission_no", admissionNo)
    .single();
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

// =============================================
// CLASSES FUNCTIONS
// =============================================

export const getClasses = async () => {
  const { data, error } = await supabase
    .from("classes")
    .select("*, user_profiles!classes_class_teacher_id_fkey(full_name)");
  return { data, error };
};

export const getClassById = async (classId: number) => {
  const { data, error } = await supabase
    .from("classes")
    .select("*, user_profiles!classes_class_teacher_id_fkey(full_name)")
    .eq("id", classId)
    .single();
  return { data, error };
};

export const addClass = async (classData: any) => {
  const { data, error } = await supabase.from("classes").insert([classData]);
  return { data, error };
};

export const updateClass = async (id: number, classData: any) => {
  const { data, error } = await supabase
    .from("classes")
    .update(classData)
    .eq("id", id);
  return { data, error };
};

// =============================================
// SUBJECTS FUNCTIONS
// =============================================

export const getSubjects = async () => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name");
  return { data, error };
};

export const getSubjectsBySection = async (section: string) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("section", section)
    .order("name");
  return { data, error };
};

export const getSubjectById = async (subjectId: number) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", subjectId)
    .single();
  return { data, error };
};

export const addSubject = async (subject: any) => {
  const { data, error } = await supabase.from("subjects").insert([subject]);
  return { data, error };
};

export const updateSubject = async (id: number, subject: any) => {
  const { data, error } = await supabase
    .from("subjects")
    .update(subject)
    .eq("id", id);
  return { data, error };
};

// =============================================
// MARKS FUNCTIONS
// =============================================

export const getMarks = async () => {
  const { data, error } = await supabase
    .from("marks")
    .select(
      `
      *,
      students(name, admission_no),
      subjects(name, code),
      user_profiles!marks_entered_by_fkey(full_name)
    `,
    )
    .order("created_at", { ascending: false });
  return { data, error };
};

export const getMarksByStudent = async (studentId: number) => {
  const { data, error } = await supabase
    .from("marks")
    .select(
      `
      *,
      students(name, admission_no),
      subjects(name, code, max_marks),
      user_profiles!marks_entered_by_fkey(full_name)
    `,
    )
    .eq("student_id", studentId);
  return { data, error };
};

export const getMarksByTeacher = async (teacherId: string) => {
  const { data, error } = await supabase
    .from("marks")
    .select(
      `
      *,
      students(name, admission_no),
      subjects(name, code),
      user_profiles!marks_entered_by_fkey(full_name)
    `,
    )
    .eq("entered_by", teacherId);
  return { data, error };
};

export const getMarksBySubjectAndClass = async (
  subjectId: number,
  classId: number,
  term: string,
  academicYear: string,
) => {
  const { data, error } = await supabase
    .from("marks")
    .select(
      `
      *,
      students(name, admission_no, class_id),
      subjects(name, code, max_marks)
    `,
    )
    .eq("subject_id", subjectId)
    .eq("term", term)
    .eq("academic_year", academicYear);
  return { data, error };
};

export const addMark = async (mark: any) => {
  const { data, error } = await supabase.from("marks").insert([mark]);
  return { data, error };
};

export const updateMark = async (id: number, mark: any) => {
  const { data, error } = await supabase
    .from("marks")
    .update(mark)
    .eq("id", id);
  return { data, error };
};

export const deleteMark = async (id: number) => {
  const { data, error } = await supabase.from("marks").delete().eq("id", id);
  return { data, error };
};

// =============================================
// TEACHERS FUNCTIONS
// =============================================

export const getTeachers = async () => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("role", "teacher");
  return { data, error };
};

export const getTeacherById = async (teacherId: string) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", teacherId)
    .eq("role", "teacher")
    .single();
  return { data, error };
};

// =============================================
// TEACHER SUBJECT ASSIGNMENTS
// =============================================

export const getTeacherSubjects = async (teacherId: string) => {
  const { data, error } = await supabase
    .from("teacher_subjects")
    .select(
      `
      *,
      subjects(name, code),
      classes(name, section),
      user_profiles!teacher_subjects_teacher_id_fkey(full_name)
    `,
    )
    .eq("teacher_id", teacherId);
  return { data, error };
};

export const getTeacherSubjectsByClass = async (classId: number) => {
  const { data, error } = await supabase
    .from("teacher_subjects")
    .select(
      `
      *,
      subjects(name, code),
      user_profiles!teacher_subjects_teacher_id_fkey(full_name, email)
    `,
    )
    .eq("class_id", classId);
  return { data, error };
};

export const assignTeacherSubject = async (assignment: any) => {
  const { data, error } = await supabase
    .from("teacher_subjects")
    .insert([assignment]);
  return { data, error };
};

export const removeTeacherSubject = async (id: number) => {
  const { data, error } = await supabase
    .from("teacher_subjects")
    .delete()
    .eq("id", id);
  return { data, error };
};
