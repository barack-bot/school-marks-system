import React, { useState, useEffect } from "react";
import {
  StatCard,
  DataTable,
  PerformanceChart,
  AddStudentModal,
  EnterMarksModal,
} from "../components";
import { Users, GraduationCap, BookOpen, Calendar, Plus } from "lucide-react";
import {
  getStudents,
  getClasses,
  getSubjects,
  getMarks,
  addStudent,
  addMark,
} from "../services/supabase";

export const Dashboard = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEnterMarksOpen, setIsEnterMarksOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsRes, classesRes, subjectsRes, marksRes] =
        await Promise.all([
          getStudents(),
          getClasses(),
          getSubjects(),
          getMarks(),
        ]);

      if (studentsRes.error) throw studentsRes.error;
      if (classesRes.error) throw classesRes.error;
      if (subjectsRes.error) throw subjectsRes.error;
      if (marksRes.error) throw marksRes.error;

      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
      setMarks(marksRes.data || []);
    } catch (err: any) {
      setError("Failed to load dashboard data");
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
      await fetchAllData();
    } catch (err: any) {
      alert("Error adding student: " + err.message);
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
      await fetchAllData();
    } catch (err: any) {
      alert("Error saving marks: " + err.message);
    }
  };

  // Calculate statistics
  const studentCount = students.length;
  const classCount = classes.length;
  const subjectCount = subjects.length;
  const averageMarks =
    marks.length > 0
      ? (
          marks.reduce((sum, m) => sum + (m.marks || 0), 0) / marks.length
        ).toFixed(2)
      : "0";

  // Performance data from marks
  const performanceData = students.slice(0, 5).map((student) => {
    const studentMarks = marks.filter((m) => m.student_id === student.id);
    const avg =
      studentMarks.length > 0
        ? Math.round(
            studentMarks.reduce((sum, m) => sum + (m.marks || 0), 0) /
              studentMarks.length,
          )
        : 0;
    return {
      name: student.name,
      marks: avg,
      average: avg,
    };
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    );
  }

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
          value={studentCount}
          change={0}
          trend="up"
        />
        <StatCard
          icon={<GraduationCap className="w-6 h-6" />}
          label="Total Classes"
          value={classCount}
          change={0}
          trend="up"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Total Subjects"
          value={subjectCount}
          change={0}
          trend="up"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="Avg Marks"
          value={averageMarks}
          change={0}
        />
      </div>

      {/* Charts */}
      {performanceData.length > 0 && (
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
      )}

      {/* Tables */}
      <div className="space-y-6">
        {students.length > 0 ? (
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
            data={students.slice(0, 10)}
            title="Recent Students"
            onEdit={(student) => console.log("Edit:", student)}
            onDelete={(student) => console.log("Delete:", student)}
          />
        ) : (
          <div className="bg-white rounded-lg p-8 text-center text-slate-500">
            No students yet. Add one to get started.
          </div>
        )}

        {performanceData.length > 0 && (
          <PerformanceChart
            data={performanceData}
            type="bar"
            title="Class Average Performance"
          />
        )}
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSubmit={handleAddStudent}
        classes={classes}
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
