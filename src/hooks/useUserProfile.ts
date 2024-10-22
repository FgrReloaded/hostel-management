import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useUserStore } from '../stores/userStore'
import { getProfile } from '@/actions/student/student'

export function useUserProfile() {
  const { status } = useSession()
  const { userProfile, setUserProfile } = useUserStore()

  useEffect(() => {
    async function fetchUserProfile() {
      if (status === 'authenticated' && !userProfile) {
        try {
          const profile = await getProfile();
          if (profile.error) {
            return;
          }
          if (profile.data) {
            setUserProfile(profile.data)
          }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }
  }

    fetchUserProfile()
  }, [status, userProfile, setUserProfile])

return { userProfile, isLoading: status === 'loading' }
}