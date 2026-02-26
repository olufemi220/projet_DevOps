"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [status, setStatus] = useState("Connexion en cours...");
  const [isOnline, setIsOnline] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const API_URL = "/api/students";

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        setStudents(await res.json());
        setStatus("Cluster Connecté");
        setIsOnline(true);
      } else {
        setStatus("Erreur API");
        setIsOnline(false);
      }
    } catch {
      setStatus("API Hors Ligne");
      setIsOnline(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        });
        if (res.ok) {
          setEditingId(null);
          setFormData({ firstName: "", lastName: "", email: "" });
          fetchStudents();
        }
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setFormData({ firstName: "", lastName: "", email: "" });
          fetchStudents();
        }
      }
    } catch (err) {
      console.error("Erreur", err);
    }
  };

  const handleEditClick = (student: any) => {
    setEditingId(student.id);
    setFormData({
      firstName: student.first_name || student.firstName,
      lastName: student.last_name || student.lastName,
      email: student.email,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet étudiant ?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) fetchStudents();
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Portail DevOps
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Gestion des étudiants via Kubernetes</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200/60">
            <span className="relative flex h-3.5 w-3.5">
              {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-sm font-semibold text-slate-700">{status}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* FORMULAIRE (Colonne de gauche) */}
          <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:sticky lg:top-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Modifier le profil" : "Nouvelle Inscription"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {editingId ? "Mettez à jour les informations ci-dessous." : "Ajoutez un nouvel étudiant à la base de données."}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prénom</label>
                <input
                  type="text"
                  placeholder="Ex: John"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom</label>
                <input
                  type="text"
                  placeholder="Ex: Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adresse Email</label>
                <input
                  type="email"
                  placeholder="john.doe@efrei.fr"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="pt-2 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]">
                  {editingId ? "Enregistrer" : "Ajouter l'étudiant"}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFormData({ firstName: "", lastName: "", email: "" }); }}
                    className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all">
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* LISTE DES ETUDIANTS (Colonnes de droite) */}
          <section className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Annuaire de la promotion</h2>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                {students.length} {students.length > 1 ? 'inscrits' : 'inscrit'}
              </span>
            </div>
            
            <div className="p-0">
              {students.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  </div>
                  <p className="text-slate-500 font-medium">La base de données est vide.</p>
                  <p className="text-sm text-slate-400 mt-1">Utilisez le formulaire pour commencer.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {students.map((s: any, i) => (
                    <li key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 hover:bg-slate-50/80 transition-colors group">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${s.first_name || s.firstName}+${s.last_name || s.lastName}&background=eff6ff&color=4f46e5&bold=true`} 
                          alt="avatar" 
                          className="w-12 h-12 rounded-full border border-indigo-100 shadow-sm"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-lg">
                            {s.first_name || s.firstName} {s.last_name || s.lastName}
                          </div>
                          <div className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            {s.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(s)} 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 rounded-lg text-sm font-semibold transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          Éditer
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)} 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-red-300 hover:text-red-600 text-slate-600 rounded-lg text-sm font-semibold transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          
        </div>
      </div>
    </main>
  );
}