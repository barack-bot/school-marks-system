import React, { useState, useEffect } from "react";
import {
  StatCard,
  DataTable,
  PerformanceChart,
  AddStudentModal,
  EnterMarksModal,
} from "../components";
import { Users, GraduationCap, BookOpen, Calendar, Plus } from "lucide-react";

// Sample data
const mockStudents = [
  {
    id: 1,
    name: "Arjun Kumar",
    admission_no: "ADM001",
    class_id: 1,
    section: "primary",
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
    section: "primary",
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
    section: "junior",
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
    section: "junior",
    date_of_birth: "2008-11-05",
    gender: "Female",
    parent_name: "Mrs. Singh",
    parent_contact: "9876543213",
    address: "Pune",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockClasses = [
  { id: 1, name: "Class 5A", section: "primary", academic_year: "2024-2025" },
  { id: 2, name: "Class 8B", section: "junior", academic_year: "2024-2025" },
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

const performanceData = [
  { name: "Arjun", marks: 85, average: 82 },
  { name: "Priya", marks: 92, average: 88 },
  { name: "Rohan", marks: 78, average: 75 },
  { name: "Ananya", marks: 88, average: 85 },
  { name: "Vikram", marks: 76, average: 73 },
];

export const Dashboard = () => {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEnterMarksOpen, setIsEnterMarksOpen] = useState(false);
  const [students, setStudents] = useState(mockStudents);

  const handleAddStudent = (data: any) => {
    const newStudent = {
      id: students.length + 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStudents([...students, newStudent]);
    setIsAddStudentOpen(false);
    alert("Student added successfully!");
  };

  const handleEnterMarks = (data: any) => {
    setIsEnterMarksOpen(false);
    alert("Marks saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back! Here's your school overview.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Student
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Students"
          value={245}
          change={12}
          trend="up"
        />
        <StatCard
          icon={<GraduationCap className="w-6 h-6" />}
          label="Total Teachers"
          value={42}
          change={5}
          trend="up"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Total Classes"
          value={18}
          change={-2}
          trend="down"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="Academic Year"
          value="2024-25"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          data={performanceData}
          type="bar"
          title="Student Performance by Marks"
        />
        <PerformanceChart
          data={performanceData}
          type="line"
          title="Performance Trend"
        />
      </div>

      {/* Tables */}
      <div className="space-y-6">
        <DataTable
          columns={[
            { key: "name" as any, label: "Name", sortable: true },
            {
              key: "admission_no" as any,
              label: "Admission No",
              sortable: true,
            },
            { key: "section" as any, label: "Section", sortable: false },
            {
              key: "parent_contact" as any,
              label: "Parent Contact",
              sortable: false,
            },
          ]}
          data={students}
          title="Recent Students"
          onEdit={(student) => console.log("Edit:", student)}
          onDelete={(student) => console.log("Delete:", student)}
        />

        <PerformanceChart
          data={performanceData}
          type="bar"
          title="Class Average Performance"
        />
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSubmit={handleAddStudent}
        classes={mockClasses}
      />

      <EnterMarksModal
        isOpen={isEnterMarksOpen}
        onClose={() => setIsEnterMarksOpen(false)}
        onSubmit={handleEnterMarks}
        students={students}
        subjects={mockSubjects}
      />
    </div>
  );
};
