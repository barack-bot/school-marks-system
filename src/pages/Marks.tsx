import React, { useState } from "react";
import { DataTable, EnterMarksModal } from "../components";
import { Plus, Download } from "lucide-react";

const mockMarks = [
  {
    id: 1,
    student_id: 1,
    subject_id: 1,
    term: "1" as const,
    marks_obtained: 85,
    academic_year: "2024-2025",
    remarks: "Good performance",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    student_id: 1,
    subject_id: 2,
    term: "1" as const,
    marks_obtained: 92,
    academic_year: "2024-2025",
    remarks: "Excellent",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    student_id: 2,
    subject_id: 1,
    term: "1" as const,
    marks_obtained: 88,
    academic_year: "2024-2025",
    remarks: "Very good",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    student_id: 2,
    subject_id: 2,
    term: "1" as const,
    marks_obtained: 95,
    academic_year: "2024-2025",
    remarks: "Excellent work",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    student_id: 3,
    subject_id: 3,
    term: "1" as const,
    marks_obtained: 78,
    academic_year: "2024-2025",
    remarks: "Average",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockStudents = [
  { id: 1, name: "Arjun Kumar", admission_no: "ADM001" },
  { id: 2, name: "Priya Sharma", admission_no: "ADM002" },
  { id: 3, name: "Rohan Patel", admission_no: "ADM003" },
];

const mockSubjects = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH101",
    section: "primary",
    max_marks: 100,
  },
  {
    id: 2,
    name: "English",
    code: "ENG101",
    section: "primary",
    max_marks: 100,
  },
  {
    id: 3,
    name: "Science",
    code: "SCI101",
    section: "primary",
    max_marks: 100,
  },
];

export const Marks = () => {
  const [marks, setMarks] = useState(mockMarks);
  const [isEnterMarksOpen, setIsEnterMarksOpen] = useState(false);

  const handleEnterMarks = (data: any) => {
    const newMark = {
      id: (marks.length + 1),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMarks([...marks, newMark]);
    setIsEnterMarksOpen(false);
    alert("Marks saved successfully!");
  };

  const handleDeleteMark = (mark: any) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setMarks(marks.filter((m) => m.id !== mark.id));
      alert("Mark deleted successfully!");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Student ID", "Subject ID", "Term", "Marks", "Academic Year"].join(","),
      ...marks.map((m) =>
        [
          m.student_id,
          m.subject_id,
          m.term,
          m.marks_obtained,
          m.academic_year,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marks.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Marks Management
          </h1>
          <p className="text-slate-600 mt-1">Track and manage student marks.</p>
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
            onClick={() => setIsEnterMarksOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Enter Marks
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "student_id" as any, label: "Student ID", sortable: true },
          { key: "subject_id" as any, label: "Subject ID", sortable: true },
          { key: "term" as any, label: "Term", sortable: true },
          { key: "marks_obtained" as any, label: "Marks", sortable: true },
          {
            key: "academic_year" as any,
            label: "Academic Year",
            sortable: true,
          },
          { key: "remarks" as any, label: "Remarks", sortable: false },
        ]}
        data={marks}
        title="All Marks"
        onDelete={handleDeleteMark}
      />

      <EnterMarksModal
        isOpen={isEnterMarksOpen}
        onClose={() => setIsEnterMarksOpen(false)}
        onSubmit={handleEnterMarks}
        students={mockStudents}
        subjects={mockSubjects}
      />
    </div>
  );
};

