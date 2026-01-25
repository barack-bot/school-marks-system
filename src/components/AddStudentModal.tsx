import React, { useState } from "react";
import { Modal } from "./Modal";
import { Plus } from "lucide-react";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  classes: any[];
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classes,
}) => {
  const handleSubmit = (formData: FormData) => {
    const data = {
      name: formData.get("name"),
      admission_no: formData.get("admission_no"),
      class_id: formData.get("class_id"),
      section: formData.get("section"),
      date_of_birth: formData.get("date_of_birth"),
      gender: formData.get("gender"),
      parent_name: formData.get("parent_name"),
      parent_contact: formData.get("parent_contact"),
      address: formData.get("address"),
    };
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Add New Student"
      submitLabel="Add Student"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Student Name *
          </label>
          <input
            type="text"
            name="name"
            className="input-field"
            placeholder="Enter student name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Admission No *
          </label>
          <input
            type="text"
            name="admission_no"
            className="input-field"
            placeholder="Enter admission number"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Class *
            </label>
            <select name="class_id" className="input-field" required>
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Section *
            </label>
            <select name="section" className="input-field" required>
              <option value="">Select section</option>
              <option value="primary">Primary</option>
              <option value="junior">Junior</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date of Birth
          </label>
          <input type="date" name="date_of_birth" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Gender
          </label>
          <select name="gender" className="input-field">
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Parent Name
          </label>
          <input
            type="text"
            name="parent_name"
            className="input-field"
            placeholder="Enter parent name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Parent Contact
          </label>
          <input
            type="tel"
            name="parent_contact"
            className="input-field"
            placeholder="Enter parent contact"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Address
          </label>
          <textarea
            name="address"
            className="input-field"
            placeholder="Enter address"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
};
