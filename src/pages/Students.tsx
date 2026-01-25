import React, { useState } from "react";
import { DataTable, AddStudentModal } from "../components";
import { Plus, Download } from "lucide-react";

const mockStudents = [
  {
    id: 1,
    name: "Arjun Kumar",
    admission_no: "ADM001",
    class_id: 1,
    section: "primary" as const,
    date_of_birth: "2010-05-15",
    gender: "Male",
    parent_name: "Mr. Kumar",
    parent_contact: "9876543210",
    address: "Mumbai",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Priya Sharma",
    admission_no: "ADM002",
    class_id: 1,
    section: "primary" as const,
    date_of_birth: "2010-07-22",
    gender: "Female",
    parent_name: "Mrs. Sharma",
    parent_contact: "9876543211",
    address: "Delhi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Rohan Patel",
    admission_no: "ADM003",
    class_id: 2,
    section: "junior" as const,
    date_of_birth: "2008-03-10",
    gender: "Male",
    parent_name: "Mr. Patel",
    parent_contact: "9876543212",
    address: "Bangalore",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Ananya Singh",
    admission_no: "ADM004",
    class_id: 2,
    section: "junior" as const,
    date_of_birth: "2008-11-05",
    gender: "Female",
    parent_name: "Mrs. Singh",
    parent_contact: "9876543213",
    address: "Pune",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Vikram Reddy",
    admission_no: "ADM005",
    class_id: 1,
    section: "primary" as const,
    date_of_birth: "2009-12-08",
    gender: "Male",
    parent_name: "Mr. Reddy",
    parent_contact: "9876543214",
    address: "Hyderabad",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockClasses = [
  {
    id: 1,
    name: "Class 5A",
    section: "primary" as const,
    academic_year: "2024-2025",
  },
  {
    id: 2,
    name: "Class 8B",
    section: "junior" as const,
    academic_year: "2024-2025",
  },
];

export const Students = () => {
  const [students, setStudents] = useState(mockStudents);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const handleAddStudent = (data: any) => {
    if (editingStudent) {
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id ? { ...s, ...data } : s,
        ),
      );
      setEditingStudent(null);
    } else {
      const newStudent = {
        id: Math.max(...students.map((s) => s.id)) + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setStudents([...students, newStudent]);
    }
    setIsAddStudentOpen(false);
    alert(
      editingStudent
        ? "Student updated successfully!"
        : "Student added successfully!",
    );
  };

  const handleDeleteStudent = (student: any) => {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      setStudents(students.filter((s) => s.id !== student.id));
      alert("Student deleted successfully!");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Admission No", "Class", "Section", "Parent Contact"].join(","),
      ...students.map((s) =>
        [s.name, s.admission_no, s.class_id, s.section, s.parent_contact].join(
          ",",
        ),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>
          <p className="text-slate-600 mt-1">
            Manage all students in the system.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => {
              setEditingStudent(null);
              setIsAddStudentOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "name" as any, label: "Name", sortable: true },
          { key: "admission_no" as any, label: "Admission No", sortable: true },
          { key: "section" as any, label: "Section", sortable: true },
          { key: "parent_name" as any, label: "Parent", sortable: true },
          { key: "parent_contact" as any, label: "Contact", sortable: false },
          { key: "address" as any, label: "Address", sortable: false },
        ]}
        data={students}
        title="All Students"
        onEdit={(student) => {
          setEditingStudent(student);
          setIsAddStudentOpen(true);
        }}
        onDelete={handleDeleteStudent}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => {
          setIsAddStudentOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleAddStudent}
        classes={mockClasses}
      />
    </div>
  );
};
