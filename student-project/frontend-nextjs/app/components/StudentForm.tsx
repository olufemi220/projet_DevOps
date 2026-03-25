// app/components/StudentForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { StudentFormData, validateStudent } from "@/app/lib/validations";

interface StudentFormProps {
  initialData?: StudentFormData;
  onSubmit: (data: StudentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function StudentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: StudentFormProps) {
  const [formData, setFormData] = useState<Partial<StudentFormData>>(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form
    const validation = validateStudent(formData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }

    try {
      await onSubmit(formData as StudentFormData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred while saving"
      );
    }
  };

  // Combine Zod and Tailwind input styles
  const getInputClasses = (fieldName: string) => {
    const hasError = touched[fieldName] && errors[fieldName];
    const baseClasses =
      "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition";
    const errorClasses = hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-blue-500";
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
          {submitError}
        </div>
      )}

      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First Name *
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClasses("firstName")}
          disabled={isLoading}
          aria-invalid={touched.firstName && !!errors.firstName}
          aria-describedby={errors.firstName ? `firstName-error` : undefined}
        />
        {touched.firstName && errors.firstName && (
          <p id="firstName-error" className="mt-1 text-sm text-red-600">
            {errors.firstName}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Last Name *
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClasses("lastName")}
          disabled={isLoading}
          aria-invalid={touched.lastName && !!errors.lastName}
          aria-describedby={errors.lastName ? `lastName-error` : undefined}
        />
        {touched.lastName && errors.lastName && (
          <p id="lastName-error" className="mt-1 text-sm text-red-600">
            {errors.lastName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClasses("email")}
          disabled={isLoading}
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={errors.email ? `email-error` : undefined}
        />
        {touched.email && errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone (FR format: +331... or 01...) *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClasses("phone")}
          placeholder="+33123456789"
          disabled={isLoading}
          aria-invalid={touched.phone && !!errors.phone}
          aria-describedby={errors.phone ? `phone-error` : undefined}
        />
        {touched.phone && errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Enrollment Date */}
      <div>
        <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700 mb-1">
          Enrollment Date *
        </label>
        <input
          type="date"
          id="enrollmentDate"
          name="enrollmentDate"
          value={
            formData.enrollmentDate
              ? new Date(formData.enrollmentDate).toISOString().split("T")[0]
              : ""
          }
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClasses("enrollmentDate")}
          disabled={isLoading}
          aria-invalid={touched.enrollmentDate && !!errors.enrollmentDate}
          aria-describedby={
            errors.enrollmentDate ? `enrollmentDate-error` : undefined
          }
        />
        {touched.enrollmentDate && errors.enrollmentDate && (
          <p id="enrollmentDate-error" className="mt-1 text-sm text-red-600">
            {errors.enrollmentDate}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {isLoading ? "Saving..." : "Save Student"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
