// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://efrei.local/api";

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// READ : Récupérer tous les étudiants
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, { cache: 'no-store' });
    if (!response.ok) throw new Error("Erreur lors de la récupération");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetch):", error);
    return [];
  }
};

// CREATE : Ajouter un étudiant
export const addStudent = async (student: Omit<Student, 'id'>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    return response.ok;
  } catch (error) {
    console.error("API Error (add):", error);
    return false;
  }
};

// UPDATE : Modifier un étudiant
export const updateStudent = async (id: number, student: Omit<Student, 'id'>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    return response.ok;
  } catch (error) {
    console.error("API Error (update):", error);
    return false;
  }
};

// DELETE : Supprimer un étudiant
export const deleteStudent = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("API Error (delete):", error);
    return false;
  }
};