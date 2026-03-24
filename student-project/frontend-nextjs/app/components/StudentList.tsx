// app/components/StudentList.tsx
"use client";

import { Student } from "@/app/lib/api";

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export default function StudentList({
  students,
  onEdit,
  onDelete,
  isLoading = false,
}: StudentListProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No students found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Enrollment Date
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 text-gray-800">
                {student.firstName} {student.lastName}
              </td>
              <td className="px-4 py-3 text-gray-700 truncate">{student.email}</td>
              <td className="px-4 py-3 text-gray-700">{student.phone}</td>
              <td className="px-4 py-3 text-gray-700">
                {new Date(student.enrollmentDate).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onEdit(student)}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition mr-3 font-medium"
                  aria-label={`Edit ${student.firstName} ${student.lastName}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${student.firstName} ${student.lastName}?`
                      )
                    ) {
                      onDelete(student.id);
                    }
                  }}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-800 disabled:text-gray-400 transition font-medium"
                  aria-label={`Delete ${student.firstName} ${student.lastName}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
