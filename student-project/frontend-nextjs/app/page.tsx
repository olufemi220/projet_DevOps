"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Student,
  StudentInput,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./lib/api";

const EMPTY_FORM: StudentInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  enrollmentDate: "",
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<StudentInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<"ok" | "error" | "loading">("loading");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ── Fetch students ──────────────────────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudents();
      setStudents(data);
      setApiStatus("ok");
    } catch {
      setApiStatus("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ── Show message ────────────────────────────────────────────────────────────
  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // ── Submit form ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateStudent(editingId, form);
        showMessage("Étudiant mis à jour avec succès !", "success");
        setEditingId(null);
      } else {
        await createStudent(form);
        showMessage("Étudiant ajouté avec succès !", "success");
      }
      setForm(EMPTY_FORM);
      fetchStudents();
    } catch (err: unknown) {
      showMessage(err instanceof Error ? err.message : "Une erreur est survenue", "error");
    }
  };

  // ── Edit ────────────────────────────────────────────────────────────────────
  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      enrollmentDate: student.enrollmentDate.split("T")[0],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      showMessage("Étudiant supprimé.", "success");
      setDeleteConfirm(null);
      fetchStudents();
    } catch {
      showMessage("Erreur lors de la suppression.", "error");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  // ── Format date ─────────────────────────────────────────────────────────────
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">🎓 Student Management</h1>
            <p className="text-sm text-gray-500">EFREI Paris — 2025/2026</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              apiStatus === "ok" ? "bg-green-100 text-green-700" :
              apiStatus === "error" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                apiStatus === "ok" ? "bg-green-500" :
                apiStatus === "error" ? "bg-red-500" : "bg-yellow-500"
              }`} />
              {apiStatus === "ok" ? "API Connectée" : apiStatus === "error" ? "API Hors Ligne" : "Connexion..."}
            </span>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">
              {students.length} étudiant{students.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </header>

      {/* ── Toast notification ─────────────────────────────────────────────── */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
          message.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Form ─────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">
                {editingId ? "✏️ Modifier l'étudiant" : "➕ Nouvel étudiant"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Ex: Alice"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Ex: Dupont"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="alice.dupont@efrei.fr"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="0611223344"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date d&apos;inscription *</label>
                  <input
                    type="date"
                    required
                    value={form.enrollmentDate}
                    onChange={e => setForm({ ...form, enrollmentDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    {editingId ? "Mettre à jour" : "Ajouter l'étudiant"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* ── Student list ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">📋 Liste des étudiants</h2>
                <span className="text-sm text-gray-500">{students.length} inscrit{students.length !== 1 ? "s" : ""}</span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Chargement...
                </div>
              ) : apiStatus === "error" ? (
                <div className="flex flex-col items-center justify-center py-20 text-red-400">
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="font-medium">Impossible de contacter l&apos;API</p>
                  <p className="text-sm text-gray-400 mt-1">Vérifiez que les backends sont démarrés</p>
                  <button onClick={fetchStudents} className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
                    Réessayer
                  </button>
                </div>
              ) : students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="text-5xl mb-3">👥</div>
                  <p className="font-medium text-gray-500">Aucun étudiant inscrit</p>
                  <p className="text-sm mt-1">Utilisez le formulaire pour ajouter le premier étudiant</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <th className="px-6 py-3">Étudiant</th>
                        <th className="px-6 py-3">Contact</th>
                        <th className="px-6 py-3">Inscription</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {students.map((student) => (
                        <tr key={student.id} className={`hover:bg-gray-50 transition-colors ${editingId === student.id ? "bg-indigo-50" : ""}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                                {student.firstName[0]}{student.lastName[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{student.firstName} {student.lastName}</p>
                                <p className="text-xs text-gray-400">ID #{student.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-600">{student.email}</p>
                            <p className="text-xs text-gray-400">{student.phone}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {formatDate(student.enrollmentDate)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {deleteConfirm === student.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-xs text-gray-500">Confirmer ?</span>
                                <button onClick={() => handleDelete(student.id)} className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">
                                  Oui
                                </button>
                                <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200">
                                  Non
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(student)}
                                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                                >
                                  ✏️ Modifier
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(student.id)}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                                >
                                  🗑️ Supprimer
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
