import React, { useState, useEffect } from "react";
import { DataTable, AddStudentModal } from "../components";
import { Plus, Download } from "lucide-react";
import { getStudents, addStudent, getClasses } from "../services/supabase";

export const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, classesRes] = await Promise.all([
        getStudents(),
        getClasses(),
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (classesRes.error) throw classesRes.error;

      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
    } catch (err: any) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (data: any) => {
    try {
      const { error: saveError } = await addStudent(data);
      if (saveError) {
        alert("Failed to add student");
        return;
      }
      alert("Student added successfully!");
      setIsAddStudentOpen(false);
      setEditingStudent(null);
      await fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Students</h1>
        <div className="text-center py-8">Loading students...</div>
      </div>
    );
  }

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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-slate-500">
          No students found. Add one to get started.
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "name" as any, label: "Name", sortable: true },
            {
              key: "admission_no" as any,
              label: "Admission No",
              sortable: true,
            },
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
      )}

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => {
          setIsAddStudentOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleAddStudent}
        classes={classes}
      />
    </div>
  );
};
