import React from "react";
import { DataTable } from "../components";
import { Download, Plus } from "lucide-react";

const mockSubjects = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH101",
    section: "primary" as const,
    max_marks: 100,
    description: "Basic mathematics",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "English",
    code: "ENG101",
    section: "primary" as const,
    max_marks: 100,
    description: "English language and literature",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Science",
    code: "SCI101",
    section: "primary" as const,
    max_marks: 100,
    description: "General science",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Social Studies",
    code: "SS101",
    section: "primary" as const,
    max_marks: 100,
    description: "History and geography",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Hindi",
    code: "HIN101",
    section: "primary" as const,
    max_marks: 100,
    description: "Hindi language",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const Subjects = () => {
  const handleExport = () => {
    const csv = [
      ["Name", "Code", "Section", "Max Marks"].join(","),
      ...mockSubjects.map((s) =>
        [s.name, s.code, s.section, s.max_marks].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subjects.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subjects</h1>
          <p className="text-slate-600 mt-1">Manage all subjects.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Subject
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "name" as any, label: "Subject Name", sortable: true },
          { key: "code" as any, label: "Code", sortable: true },
          { key: "section" as any, label: "Section", sortable: true },
          { key: "max_marks" as any, label: "Max Marks", sortable: true },
          { key: "description" as any, label: "Description", sortable: false },
        ]}
        data={mockSubjects}
        title="All Subjects"
      />
    </div>
  );
};

