"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [status, setStatus] = useState("Vérification de l'API...");

  // En local, le navigateur contacte directement le port 5000 exposé par ton docker-compose
  const API_URL = "http://localhost:5000/api/students";

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        setStudents(await res.json());
        setStatus("Connecté au Backend C# 🟢");
      } else {
        setStatus("Erreur de réponse API 🔴");
      }
    } catch {
      setStatus("API hors ligne (Vérifie que docker-compose tourne) 🔴");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ firstName: "", lastName: "", email: "" });
        fetchStudents(); // Met à jour la liste après l'ajout
      }
    } catch (err) {
      console.error("Erreur d'ajout", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-slate-800">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Portail Étudiants</h1>
          <span className="text-sm font-medium px-3 py-1 bg-slate-100 rounded-full">{status}</span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulaire */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Nouvelle Inscription</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Prénom"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Nom"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition-colors">
                Ajouter
              </button>
            </form>
          </section>

          {/* Liste */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Base de données MySQL</h2>
            {students.length === 0 ? (
              <p className="text-slate-500 text-center py-8 italic">Aucun étudiant dans la base.</p>
            ) : (
              <ul className="space-y-3">
                {students.map((s: any, i) => (
                  <li key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                    <span className="font-medium">{s.firstName} {s.lastName}</span>
                    <span className="text-sm text-slate-500">{s.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}