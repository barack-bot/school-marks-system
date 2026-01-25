import React from "react";
import { DataTable } from "../components";
import { Download } from "lucide-react";

const mockTeachers = [
  {
    id: "1" as any,
    full_name: "Mr. Rajesh Kumar",
    role: "teacher" as const,
    email: "rajesh@school.com",
    phone: "9876543210",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2" as any,
    full_name: "Mrs. Priya Sharma",
    role: "teacher" as const,
    email: "priya@school.com",
    phone: "9876543211",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3" as any,
    full_name: "Mr. Vikram Singh",
    role: "teacher" as const,
    email: "vikram@school.com",
    phone: "9876543212",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const Teachers = () => {
  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Phone", "Role"].join(","),
      ...mockTeachers.map((t) =>
        [t.full_name, t.email, t.phone, t.role].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teachers.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teachers</h1>
          <p className="text-slate-600 mt-1">Manage teaching staff.</p>
        </div>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <DataTable
        columns={[
          { key: "full_name" as any, label: "Name", sortable: true },
          { key: "email" as any, label: "Email", sortable: true },
          { key: "phone" as any, label: "Phone", sortable: false },
          { key: "role" as any, label: "Role", sortable: true },
        ]}
        data={mockTeachers}
        title="All Teachers"
      />
    </div>
  );
};

