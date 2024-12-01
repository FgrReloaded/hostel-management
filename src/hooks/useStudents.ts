import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getAllStudents } from '@/actions/admin/student'
import { useStudentStore } from '@/stores/studentStore'

export function useStudents() {
  const { status } = useSession()
  const { students, setStudents } = useStudentStore()

  useEffect(() => {
    async function fetchUserProfile() {
      if (status === 'authenticated' && !students) {
        try {
          const studentsData = await getAllStudents();
          if (studentsData.error) {
            return;
          }
          if (studentsData.data) {
            setStudents(studentsData.data)
          }
        } catch (error) {
          console.error('Error fetching students:', error)
        }
      }
    }

    fetchUserProfile()
  }, [status, students, setStudents])

  return { students, isLoading: status === 'loading', setStudents }
}