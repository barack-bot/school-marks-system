import React, { useState, useEffect } from "react";
import { DataTable, EnterMarksModal } from "../components";
import { Plus, Download } from "lucide-react";
import {
  getMarks,
  getStudents,
  getSubjects,
  addMark,
} from "../services/supabase";

export const Marks = () => {
  const [marks, setMarks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnterMarksOpen, setIsEnterMarksOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [marksRes, studentsRes, subjectsRes] = await Promise.all([
        getMarks(),
        getStudents(),
        getSubjects(),
      ]);

      if (marksRes.error) throw marksRes.error;
      if (studentsRes.error) throw studentsRes.error;
      if (subjectsRes.error) throw subjectsRes.error;

      setMarks(marksRes.data || []);
      setStudents(studentsRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (err: any) {
      setError("Failed to load marks data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterMarks = async (data: any) => {
    try {
      const { error: saveError } = await addMark(data);
      if (saveError) {
        alert("Failed to save marks");
        return;
      }
      alert("Marks saved successfully!");
      setIsEnterMarksOpen(false);
      await fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleExport = () => {
    const csv = [
      ["Student", "Subject", "Marks", "Total", "Term", "Academic Year"].join(
        ",",
      ),
      ...marks.map((m) => {
        const student = students.find((s) => s.id === m.student_id);
        const subject = subjects.find((s) => s.id === m.subject_id);
        return [
          student?.name || "Unknown",
          subject?.name || "Unknown",
          m.marks,
          m.total_marks || 100,
          m.term,
          m.academic_year,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marks.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Marks Management</h1>
        <div className="text-center py-8">Loading marks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Marks Management</h1>
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );
  }

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
        onDelete={(mark) => {
          // Implement delete if needed
          console.log("Delete mark:", mark);
        }}
      />

      <EnterMarksModal
        isOpen={isEnterMarksOpen}
        onClose={() => setIsEnterMarksOpen(false)}
        onSubmit={handleEnterMarks}
        students={students}
        subjects={subjects}
      />
    </div>
  );
};
