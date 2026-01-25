import apiClient from "./api";
import { Student, Class, Subject, Mark, UserProfile } from "../types";

// Students API
export const studentAPI = {
  getAll: (params?: any) => apiClient.get<Student[]>("/students", { params }),
  getById: (id: bigint) => apiClient.get<Student>(`/students/${id}`),
  create: (data: Omit<Student, "id" | "created_at" | "updated_at">) =>
    apiClient.post<Student>("/students", data),
  update: (id: bigint, data: Partial<Student>) =>
    apiClient.put<Student>(`/students/${id}`, data),
  delete: (id: bigint) => apiClient.delete(`/students/${id}`),
};

// Classes API
export const classAPI = {
  getAll: (params?: any) => apiClient.get<Class[]>("/classes", { params }),
  getById: (id: bigint) => apiClient.get<Class>(`/classes/${id}`),
  create: (data: Omit<Class, "id" | "created_at" | "updated_at">) =>
    apiClient.post<Class>("/classes", data),
  update: (id: bigint, data: Partial<Class>) =>
    apiClient.put<Class>(`/classes/${id}`, data),
  delete: (id: bigint) => apiClient.delete(`/classes/${id}`),
};

// Subjects API
export const subjectAPI = {
  getAll: (params?: any) => apiClient.get<Subject[]>("/subjects", { params }),
  getById: (id: bigint) => apiClient.get<Subject>(`/subjects/${id}`),
  create: (data: Omit<Subject, "id" | "created_at" | "updated_at">) =>
    apiClient.post<Subject>("/subjects", data),
  update: (id: bigint, data: Partial<Subject>) =>
    apiClient.put<Subject>(`/subjects/${id}`, data),
  delete: (id: bigint) => apiClient.delete(`/subjects/${id}`),
};

// Marks API
export const markAPI = {
  getAll: (params?: any) => apiClient.get<Mark[]>("/marks", { params }),
  getById: (id: bigint) => apiClient.get<Mark>(`/marks/${id}`),
  create: (data: Omit<Mark, "id" | "created_at" | "updated_at">) =>
    apiClient.post<Mark>("/marks", data),
  update: (id: bigint, data: Partial<Mark>) =>
    apiClient.put<Mark>(`/marks/${id}`, data),
  delete: (id: bigint) => apiClient.delete(`/marks/${id}`),
  getByStudent: (studentId: bigint, params?: any) =>
    apiClient.get<Mark[]>(`/marks/student/${studentId}`, { params }),
};

// Users API
export const userAPI = {
  getProfile: () => apiClient.get<UserProfile>("/users/profile"),
  updateProfile: (data: Partial<UserProfile>) =>
    apiClient.put<UserProfile>("/users/profile", data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () =>
    apiClient.get<{
      totalStudents: number;
      totalTeachers: number;
      totalClasses: number;
      academicYear: string;
    }>("/dashboard/stats"),
  getPerformanceData: (params?: any) =>
    apiClient.get<any>("/dashboard/performance", { params }),
};
