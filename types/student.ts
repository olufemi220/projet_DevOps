export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  enrollmentDate: string;
  major: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
}

export interface StudentCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  major: string;
  status: Student['status'];
}

export interface StudentUpdateInput extends Partial<StudentCreateInput> {}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
}
