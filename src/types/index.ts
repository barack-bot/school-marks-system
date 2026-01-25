export interface UserProfile {
  id: string;
  full_name: string;
  role: "admin" | "teacher" | "student";
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: bigint;
  user_id?: string;
  name: string;
  admission_no: string;
  class_id: bigint;
  section: "primary" | "junior";
  date_of_birth?: string;
  gender?: "Male" | "Female" | "Other";
  parent_name?: string;
  parent_contact?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: bigint;
  name: string;
  section: "primary" | "junior";
  class_teacher_id?: string;
  academic_year: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: bigint;
  name: string;
  code: string;
  section: "primary" | "junior";
  max_marks: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Mark {
  id: bigint;
  student_id: bigint;
  subject_id: bigint;
  term: "1" | "2" | "3";
  marks_obtained: number;
  academic_year: string;
  entered_by?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface TeacherSubject {
  id: bigint;
  teacher_id: string;
  subject_id: bigint;
  class_id: bigint;
  academic_year: string;
  created_at: string;
}

export interface AuditLog {
  id: bigint;
  user_id?: string;
  action: string;
  table_name?: string;
  record_id?: bigint;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}
