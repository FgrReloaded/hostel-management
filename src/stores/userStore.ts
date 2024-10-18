import { create } from 'zustand'
import { Student } from '@prisma/client'

type UserStore = {
  userProfile: Student | null
  setUserProfile: (profile: Student | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
}))