import React, { useState } from "react";
import { PerformanceChart } from "../components";
import { Download, Filter } from "lucide-react";

const performanceData = [
  { name: "Arjun", marks: 85, average: 82 },
  { name: "Priya", marks: 92, average: 88 },
  { name: "Rohan", marks: 78, average: 75 },
  { name: "Ananya", marks: 88, average: 85 },
  { name: "Vikram", marks: 76, average: 73 },
  { name: "Neha", marks: 90, average: 87 },
];

const classPerformanceData = [
  { name: "Class 5A", marks: 85 },
  { name: "Class 5B", marks: 82 },
  { name: "Class 8A", marks: 88 },
  { name: "Class 8B", marks: 80 },
];

export const Reports = () => {
  const [selectedTerm, setSelectedTerm] = useState("1");
  const [selectedClass, setSelectedClass] = useState("");

  const handleGeneratePDF = () => {
    alert("PDF report generated successfully! Check your downloads.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600 mt-1">
            View and generate performance reports.
          </p>
        </div>
        <button
          onClick={handleGeneratePDF}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Generate PDF Report
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Select Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="input-field"
            >
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              <option value="">All Classes</option>
              <option value="5A">Class 5A</option>
              <option value="5B">Class 5B</option>
              <option value="8A">Class 8A</option>
              <option value="8B">Class 8B</option>
            </select>
          </div>

          <button className="btn-secondary">Apply Filters</button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          data={performanceData}
          type="bar"
          title="Student Performance - Term 1"
        />
        <PerformanceChart
          data={classPerformanceData}
          type="bar"
          title="Class Average Performance"
        />
      </div>

      <PerformanceChart
        data={performanceData}
        type="line"
        title="Performance Trend Over Time"
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Average Score", value: "84.5" },
          { label: "Highest Score", value: "95" },
          { label: "Lowest Score", value: "76" },
          { label: "Pass Rate", value: "96.5%" },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <div className="card-body text-center">
              <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold text-primary-600">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

