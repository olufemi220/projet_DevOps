// app/lib/validations.ts
// Student form validation schema using Zod

import { z } from "zod";

export const studentSchema = z.object({
  id: z.number().int().positive().optional(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must not exceed 100 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "First name can only contain letters, spaces, hyphens and apostrophes"),
  
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must not exceed 100 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Last name can only contain letters, spaces, hyphens and apostrophes"),
  
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters"),
  
  phone: z
    .string()
    .regex(
      /^(\+33|0)[1-9](\d{8}|(?:\d{2}){4})$/,
      "Invalid French phone number (e.g., +33123456789 or 0123456789)"
    ),
  
  enrollmentDate: z
    .string()
    .refine(
      (date) => {
        const enrollmentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return enrollmentDate <= today;
      },
      {
        message: "Enrollment date cannot be in the future",
      }
    ),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// Validation error response
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate student form data
 * @param data - The form data to validate
 * @returns Validation result with errors if any
 */
export function validateStudent(
  data: unknown
): { success: boolean; errors?: Record<string, string> } {
  const result = studentSchema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((error) => {
      const path = error.path.join(".");
      errors[path] = error.message;
    });
    return { success: false, errors };
  }

  return { success: true };
}
