// app/lib/api.ts
// API client - calls the C# backend via Next.js rewrite proxy

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrollmentDate: string;
}

const BASE = "/api/students";

export async function getStudents(): Promise<Student[]> {
  const res = await fetch(BASE, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}

export async function createStudent(data: StudentInput): Promise<Student> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create student");
  }
  return res.json();
}

export async function updateStudent(id: number, data: StudentInput): Promise<Student> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update student");
  }
  return res.json();
}

export async function deleteStudent(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete student");
}
