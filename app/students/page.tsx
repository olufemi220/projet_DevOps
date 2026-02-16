"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { studentService } from '@/services/studentService';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentsPage() {
    const router = useRouter();
    const { showToast } = useToast();

    // State
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch logic
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await studentService.getStudents(page, limit, search);
            setStudents(response.data);
            setTotal(response.total || 0);
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, showToast]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchStudents]);

    // Actions
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await studentService.deleteStudent(deleteId);
            showToast('Étudiant supprimé avec succès', 'success');
            fetchStudents();
            setDeleteId(null);
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusColor = (status: Student['status']) => {
        const colors = {
            Active: 'bg-emerald-100 text-emerald-700',
            Inactive: 'bg-slate-100 text-slate-700',
            Graduated: 'bg-indigo-100 text-indigo-700',
            Suspended: 'bg-rose-100 text-rose-700',
        };
        return colors[status] || 'bg-slate-100 text-slate-700';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gestion des Étudiants</h1>
                    <p className="text-slate-500 mt-1">Gérez facilement vos étudiants et leurs informations.</p>
                </div>
                <Button onClick={() => router.push('/students/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un étudiant
                </Button>
            </div>

            {/* Stats Counter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 inline-block">
                <span className="text-sm font-medium text-slate-500">Total Étudiants:</span>
                <span className="ml-2 text-lg font-bold text-indigo-600">{total}</span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email..."
                        className="pl-10 w-full h-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Étudiant</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Filière</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Inscription</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-10 bg-slate-100 rounded-lg" />
                                        </td>
                                    </tr>
                                ))
                            ) : students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <UserCircle className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{student.firstName} {student.lastName}</p>
                                                    <p className="text-xs text-slate-500">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{student.major}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getStatusColor(student.status))}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(student.enrollmentDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => router.push(`/students/${student.id}/edit`)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="icon"
                                                    onClick={() => setDeleteId(student.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Aucun étudiant trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Affichage de {(page - 1) * limit + 1} à {Math.min(page * limit, total)} sur {total}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page * limit >= total}
                            onClick={() => setPage(page + 1)}
                        >
                            Suivant <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Confirmer la suppression"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Annuler</Button>
                        <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Supprimer</Button>
                    </>
                }
            >
                <p>Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.</p>
            </Modal>
        </div>
    );
}
