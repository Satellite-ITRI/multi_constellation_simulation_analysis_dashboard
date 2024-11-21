import React, { useState } from 'react';
import { ModalInput } from '@/app/modalComponent';

export const EditModal = ({
  application,
  onClose,
  onEdit,
  applicationName
}) => {
  const [formData, setFormData] = useState({
    name: application.name,
    description: application.description
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="w-[100%] rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Application</h2>
        <ModalInput label="Model" value={applicationName} readOnly />
        <ModalInput label="UID" value={application.uid} readOnly />
        <ModalInput label="Token" value={application.token} readOnly />
        <ModalInput
          label="Name"
          name="name"
          value={formData.name}
          // onChange={handleInputChange}
          readOnly
        />
        <ModalInput
          label="Description"
          name="description"
          value={formData.description}
          // onChange={handleInputChange}
          readOnly
        />
        <ModalInput
          label="Created Time"
          value={application.created_time}
          readOnly
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-700 px-4 py-2 font-bold text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
