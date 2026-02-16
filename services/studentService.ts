import api from './api';
import { Student, StudentCreateInput, StudentUpdateInput, ApiResponse } from '@/types/student';

export const studentService = {
    getStudents: async (page = 1, limit = 10, search = ''): Promise<ApiResponse<Student[]>> => {
        const response = await api.get('/students', {
            params: { page, limit, search },
        });
        return response.data;
    },

    getStudentById: async (id: string): Promise<ApiResponse<Student>> => {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },

    createStudent: async (student: StudentCreateInput): Promise<ApiResponse<Student>> => {
        const response = await api.post('/students', student);
        return response.data;
    },

    updateStudent: async (id: string, student: StudentUpdateInput): Promise<ApiResponse<Student>> => {
        const response = await api.put(`/students/${id}`, student);
        return response.data;
    },

    deleteStudent: async (id: string): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    },
};
