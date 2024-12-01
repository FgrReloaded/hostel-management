import { create } from 'zustand'
import { Student as StudentType, Payment } from '@prisma/client'

interface StudentWithPayments extends StudentType {
  status?: string;
  amount?: number;
  payments: Payment[];
}


type StudentStore = {
  students: StudentWithPayments[] | null
  setStudents: (students: StudentWithPayments[] | null) => void
}

export const useStudentStore = create<StudentStore>((set) => ({
  students: null,
  setStudents: (students) => set({ students }),
}))