import React from "react";
import { DataTable } from "../components";
import { Download, Plus } from "lucide-react";

const mockClasses = [
  {
    id: 1,
    name: "Class 5A",
    section: "primary" as const,
    class_teacher_id: "1",
    academic_year: "2024-2025",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Class 5B",
    section: "primary" as const,
    class_teacher_id: "2",
    academic_year: "2024-2025",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Class 8A",
    section: "junior" as const,
    class_teacher_id: "3",
    academic_year: "2024-2025",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Class 8B",
    section: "junior" as const,
    class_teacher_id: "1",
    academic_year: "2024-2025",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const Classes = () => {
  const handleExport = () => {
    const csv = [
      ["Name", "Section", "Academic Year"].join(","),
      ...mockClasses.map((c) => [c.name, c.section, c.academic_year].join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "classes.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Classes</h1>
          <p className="text-slate-600 mt-1">Manage all classes.</p>
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
            Add Class
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "name" as any, label: "Class Name", sortable: true },
          { key: "section" as any, label: "Section", sortable: true },
          {
            key: "academic_year" as any,
            label: "Academic Year",
            sortable: true,
          },
          {
            key: "class_teacher_id" as any,
            label: "Class Teacher ID",
            sortable: false,
          },
        ]}
        data={mockClasses}
        title="All Classes"
      />
    </div>
  );
};

