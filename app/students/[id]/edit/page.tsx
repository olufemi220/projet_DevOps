"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { studentService } from '@/services/studentService';
import { Student } from '@/types/student';
import StudentForm from '@/components/students/StudentForm';
import { useToast } from '@/components/ui/ToastProvider';
import { Loader2 } from 'lucide-react';

export default function EditStudentPage() {
    const { id } = useParams();
    const { showToast } = useToast();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await studentService.getStudentById(id as string);
                setStudent(response.data);
            } catch (err: any) {
                showToast(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStudent();
    }, [id, showToast]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="text-slate-500 font-medium animate-pulse">Chargement de l'étudiant...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
                <p className="text-slate-500 font-medium">Étudiant non trouvé.</p>
            </div>
        );
    }

    return <StudentForm initialData={student} isEdit />;
}
