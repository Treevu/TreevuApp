import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Store para alertas
interface AlertState {
  alert: {
    message: string
    type: 'info' | 'warning' | 'danger' | 'success'
    action?: {
      text: string
      onClick: () => void
    }
  } | null
  
  setAlert: (alert: AlertState['alert']) => void
  clearAlert: () => void
}

const useAlertStore = create<AlertState>()(
  devtools(
    (set) => ({
      alert: null,
      
      setAlert: (alert) => {
        console.log('setAlert called with:', alert)
        set({ alert }, false, 'setAlert')
      },
      
      clearAlert: () => set({ alert: null }, false, 'clearAlert')
    }),
    { name: 'Alert Store' }
  )
)

// Store para modal
interface ModalState {
  isOpen: boolean
  modalType: string | null
  modalProps: any
  
  openModal: (type: string, props?: any) => void
  closeModal: () => void
}

const useModalStore = create<ModalState>()(
  devtools(
    (set) => ({
      isOpen: false,
      modalType: null,
      modalProps: {},
      
      openModal: (type, props = {}) => set({
        isOpen: true,
        modalType: type,
        modalProps: props
      }, false, `openModal(${type})`),
      
      closeModal: () => set({
        isOpen: false,
        modalType: null,
        modalProps: {}
      }, false, 'closeModal')
    }),
    { name: 'Modal Store' }
  )
)

// Store para tribus
interface TribesState {
  tribes: any[]
  missions: any[]
  
  setTribes: (tribes: any[]) => void
  acceptMission: (missionId: string) => void
  sendKudos: (data: any) => void
}

const useTribesStore = create<TribesState>()(
  devtools(
    (set, get) => ({
      tribes: [
        {
          id: 'tribe-1',
          name: 'Tribu Demo',
          members: [
            {
              id: 'static-user-id',
              name: 'Usuario Demo',
              kudosReceived: 15,
              kudosSent: 10
            }
          ],
          collectiveKudos: 250
        }
      ],
      missions: [],
      
      setTribes: (tribes) => set({ tribes }, false, 'setTribes'),
      
      acceptMission: (missionId) => {
        console.log('acceptMission called with:', missionId)
      },
      
      sendKudos: (data) => {
        console.log('sendKudos called with:', data)
      }
    }),
    { name: 'Tribes Store' }
  )
)

import useModalStoreNew from './useModalStore'

export { useAlertStore, useModalStore, useTribesStore, useModalStoreNew }