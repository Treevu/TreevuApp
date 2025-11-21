import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type ProfileSubTab = 'profile' | 'learn';

interface ProfileSubnavState {
  activeTab: ProfileSubTab;
}

interface ProfileSubnavActions {
  setActiveTab: (tab: ProfileSubTab) => void;
}

const useProfileSubnavStore = create<ProfileSubnavState & ProfileSubnavActions>()(
  devtools(
    persist(
      (set) => ({
        activeTab: 'profile',
        setActiveTab: (tab) => set({ activeTab: tab }, false, `profileSubnav/setActiveTab(${tab})`)
      }),
      {
        name: 'profile-subnav'
      }
    ),
    { name: 'ProfileSubnavStore' }
  )
);

export default useProfileSubnavStore;
