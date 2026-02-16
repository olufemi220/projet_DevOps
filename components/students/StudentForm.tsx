"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { studentService } from '@/services/studentService';
import { StudentCreateInput, Student } from '@/types/student';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { ArrowLeft, Save } from 'lucide-react';

interface StudentFormProps {
    initialData?: Student;
    isEdit?: boolean;
}

export default function StudentForm({ initialData, isEdit = false }: StudentFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<StudentCreateInput>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        major: '',
        status: 'Active',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof StudentCreateInput, string>>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber || '',
                dateOfBirth: initialData.dateOfBirth?.split('T')[0] || '',
                major: initialData.major,
                status: initialData.status,
            });
        }
    }, [initialData]);

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!formData.firstName) newErrors.firstName = 'Prénom requis';
        if (!formData.lastName) newErrors.lastName = 'Nom de famille requis';
        if (!formData.email) newErrors.email = 'Email requis';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email invalide';
        if (!formData.major) newErrors.major = 'Filière requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (isEdit && initialData?.id) {
                await studentService.updateStudent(initialData.id, formData);
                showToast('Étudiant mis à jour avec succès', 'success');
            } else {
                await studentService.createStudent(formData);
                showToast('Étudiant créé avec succès', 'success');
            }
            router.push('/students');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof StudentCreateInput]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-4 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Retour
                </button>
                <h1 className="text-3xl font-bold text-slate-900">
                    {isEdit ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
                </h1>
                <p className="text-slate-500 mt-1">
                    {isEdit ? 'Mettez à jour les informations de l\'étudiant.' : 'Renseignez les informations pour créer un nouvel étudiant.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Prénom"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        placeholder="Jean"
                        required
                    />
                    <Input
                        label="Nom"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        placeholder="Dupont"
                        required
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="jean.dupont@example.com"
                        required
                    />
                    <Input
                        label="Téléphone"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+33 6 00 00 00 00"
                    />
                    <Input
                        label="Date de naissance"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                    <Input
                        label="Filière"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        error={errors.major}
                        placeholder="Informatique"
                        required
                    />

                    <div className="w-full space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-0.5">Statut</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 appearance-none"
                        >
                            <option value="Active">Actif</option>
                            <option value="Inactive">Inactif</option>
                            <option value="Graduated">Diplômé</option>
                            <option value="Suspended">Suspendu</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.push('/students')}>
                        Annuler
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {isEdit ? 'Enregistrer les modifications' : 'Créer l\'étudiant'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
