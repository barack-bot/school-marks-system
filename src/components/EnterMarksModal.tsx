import React from "react";
import { Modal } from "./Modal";

interface EnterMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  students: any[];
  subjects: any[];
}

export const EnterMarksModal: React.FC<EnterMarksModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  subjects,
}) => {
  const handleSubmit = (formData: FormData) => {
    const data = {
      student_id: formData.get("student_id"),
      subject_id: formData.get("subject_id"),
      term: formData.get("term"),
      marks_obtained: parseFloat(formData.get("marks_obtained") as string),
      academic_year: formData.get("academic_year"),
      remarks: formData.get("remarks"),
    };
    onSubmit(data);
  };

  const currentYear = new Date().getFullYear();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Enter Student Marks"
      submitLabel="Save Marks"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Student *
          </label>
          <select name="student_id" className="input-field" required>
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.admission_no})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Subject *
          </label>
          <select name="subject_id" className="input-field" required>
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} (Max: {subject.max_marks})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Term *
            </label>
            <select name="term" className="input-field" required>
              <option value="">Select term</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Academic Year *
            </label>
            <select name="academic_year" className="input-field" required>
              <option value="">{currentYear}</option>
              <option value={`${currentYear}-${currentYear + 1}`}>
                {currentYear}-{currentYear + 1}
              </option>
              <option value={`${currentYear - 1}-${currentYear}`}>
                {currentYear - 1}-{currentYear}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Marks Obtained *
          </label>
          <input
            type="number"
            name="marks_obtained"
            className="input-field"
            placeholder="Enter marks"
            min="0"
            step="0.5"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Remarks
          </label>
          <textarea
            name="remarks"
            className="input-field"
            placeholder="Enter remarks (optional)"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
};
