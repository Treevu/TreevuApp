import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { TreevuLevel } from '@/types/common'
import { type User } from '@/types/user'

interface UserState {
  // Estado
  user: User | null
  isLoading: boolean
  error: string | null
  
  // Acciones
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  addTreevus: (amount: number) => void
  clearUser: () => void
  completeLesson: (lessonId: string) => void
  prestigeUp: () => void
  redeemTreevusForReward: (reward: any) => void
  signOut: () => void
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial - Usuario estático
        user: {
          id: 'static-user-id',
          name: 'Usuario Demo',
          email: 'usuario@demo.com',
          picture: '',
          level: TreevuLevel.Arbusto,
          progress: {
            expensesCount: 25,
            formalityIndex: 0.7
          },
          treevus: 2500,
          isProfileComplete: true,
          kudosSent: 10,
          kudosReceived: 15,
          documentId: '12345678',
          registrationDate: '2024-01-15T00:00:00Z',
          lastActivityDate: '2024-12-14T00:00:00Z',
          rewardsClaimedCount: 3,
          engagementScore: 85,
          fwiTrend: 'improving' as const,
          streak: {
            count: 15,
            lastDate: '2024-12-14'
          },
          redeemedRewards: [],
          completedLessons: ['lesson-1', 'lesson-2'],
          tribeId: 'tribe-1',
          featuredBadge: 'pioneer' as const
        },
        isLoading: false,
        error: null,
        
        // Acciones
        setUser: (user) => set({ user, error: null }, false, 'setUser'),
        
        updateUser: (updates) => set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }), false, 'updateUser'),
        
        addTreevus: (amount) => set((state) => ({
          user: state.user ? { 
            ...state.user, 
            treevus: state.user.treevus + amount 
          } : null
        }), false, `addTreevus(${amount})`),
        
        completeLesson: (lessonId) => set((state) => ({
          user: state.user ? {
            ...state.user,
            completedLessons: [...(state.user.completedLessons || []), lessonId]
          } : null
        }), false, `completeLesson(${lessonId})`),
        
        prestigeUp: () => set((state) => ({
          user: state.user ? {
            ...state.user,
            prestigeLevel: (state.user.prestigeLevel || 0) + 1,
            level: TreevuLevel.Brote // Reset level
          } : null
        }), false, 'prestigeUp'),
        
        redeemTreevusForReward: (reward) => {
          const state = get()
          if (state.user && state.user.treevus >= reward.costInTreevus) {
            set({
              user: {
                ...state.user,
                treevus: state.user.treevus - reward.costInTreevus,
                rewardsClaimedCount: state.user.rewardsClaimedCount + 1,
                redeemedRewards: [...(state.user.redeemedRewards || []), {
                  rewardId: reward.id,
                  title: reward.title,
                  icon: reward.icon,
                  date: new Date().toISOString(),
                  costInTreevus: reward.costInTreevus,
                  description: reward.description
                }]
              }
            }, false, `redeemReward(${reward.id})`)
          }
        },
        
        signOut: () => set({ 
          user: null, 
          error: null 
        }, false, 'signOut'),
        
        clearUser: () => set({ 
          user: null, 
          error: null 
        }, false, 'clearUser')
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ 
          user: state.user 
        })
      }
    ),
    { name: 'User Store' }
  )
)

export default useUserStore