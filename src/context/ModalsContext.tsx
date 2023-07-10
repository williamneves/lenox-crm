// ** React Imports ** //
import React, { createContext, useReducer, useContext } from 'react'
import { type ModalProps as MantineModalProps } from '@mantine/core'

// ** Modal Imports ** //
import TestModal, { type TestModalProps } from 'src/views/modals/custom/CustomerModalForm'
import SecondModal, { type SecondModalProps } from 'src/views/modals/custom/SecondModal'

// ** Modal Ids ** //
export enum ModalId {
  TestModal = 'TestModal',
  SecondModal = 'SecondModal'
}

// ** Modal Props ** //
type ModalProps = {
  [ModalId.TestModal]: AllModalProps<TestModalProps>
  [ModalId.SecondModal]: AllModalProps<SecondModalProps>
}

// ** Type Definitions ** //
type AllModalProps<T> = {
  mantineProps?: MantineModalProps
  specificProps?: T
}


export type ModalData<T extends ModalId> = {
  isOpen: boolean
  modalProps?: AllModalProps<ModalProps[T]['specificProps']>
  onClose: () => void
  keepMounted?: boolean
}

type Action<T extends ModalId> =
  | {
      type: 'OPEN_MODAL'
      modalId: T
      modalProps?: AllModalProps<ModalProps[T]['specificProps']>
      onClose?: () => void
      keepMounted?: boolean
    }
  | { type: 'CLOSE_MODAL'; modalId: T }
  | { type: 'CLOSE_ALL' }

type ModalsContextType = {
  closeAll: () => void
  openModal: <T extends ModalId>(
    modalId: T,
    modalProps?: AllModalProps<ModalProps[T]['specificProps']>,
    onClose?: () => void,
    keepMounted?: boolean
  ) => void
  closeModal: (modalId: ModalId) => void
  modals: {
    [K in ModalId]?: ModalData<K>
  }
}

// ** Modal Components ** //
const MODAL_COMPONENTS = {
  TestModal: TestModal,
  SecondModal: SecondModal
}

// ** Reducer Function ** //
const reducer = <T extends ModalId>(
  state: ModalsContextType['modals'],
  action: Action<T>
) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        [action.modalId]: {
          isOpen: true,
          modalProps: action.modalProps,
          onClose: action.onClose || (() => null),
          keepMounted: action.keepMounted
        }
      }
    case 'CLOSE_MODAL':
      return { ...state, [action.modalId]: { ...state[action.modalId], isOpen: false } }
    case 'CLOSE_ALL':
      return {}
  }
}

// ** Context Related Code ** //
const defaultModalsContext: ModalsContextType = {
  closeAll: () => {
    throw new Error('closeAll was called outside of a ModalsProvider')
  },
  openModal: () => {
    throw new Error('openModal was called outside of a ModalsProvider')
  },
  closeModal: () => {
    throw new Error('closeModal was called outside of a ModalsProvider')
  },
  modals: {}
}

const ModalsContext = createContext<ModalsContextType>(defaultModalsContext)

export const CustomModalsProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, dispatch] = useReducer(reducer, {})

  const closeAll = () => {
    dispatch({ type: 'CLOSE_ALL' })
  }

  const closeModal = (modalId: keyof ModalProps) => {
    dispatch({ type: 'CLOSE_MODAL', modalId: modalId as ModalId }) // cast modalId to Modal
  }

  const openModal = <K extends keyof ModalProps>(
    modalId: K,
    modalProps?: ModalProps[K],
    onClose?: () => void,
    keepMounted?: boolean
  ) => {
    dispatch({
      type: 'OPEN_MODAL',
      modalId: modalId as ModalId,
      modalProps: modalProps as AllModalProps<ModalProps[K]['specificProps']>,
      onClose: onClose || (() => closeModal(modalId)),
      keepMounted
    })
  }

  return (
    <ModalsContext.Provider
      value={{
        modals,
        // @ts-ignore
        openModal,
        closeModal,
        closeAll
      }}
    >
      <ModalRenderer />
      {children}
    </ModalsContext.Provider>
  )
}

// Create Custom Hook
export const useModals = () => {
  const context = useContext(ModalsContext)

  if (!context) {
    throw new Error('useModals must be used within a ModalsProvider')
  }

  return context
}

// ** Modal Renderer Component ** //
const ModalRenderer = () => {
  const { modals } = useContext(ModalsContext)

  return (
    <>
      {Object.entries(modals).map(([id, modalData]) => {
        if (!modalData) {
          return null
        }

        const SpecificModal = MODAL_COMPONENTS[id as keyof typeof MODAL_COMPONENTS]

        if (!SpecificModal) {
          console.error(`No modal component found for id "${id}"`)
          return null
        }

        // Only render the modal if isOpen is true or keepMounted is true
        if (modalData.isOpen || modalData.keepMounted) {
          return (
            // @ts-ignore
            <SpecificModal
              {...modalData}
              keepMounted={modalData.keepMounted}
              key={id}
              isOpen={modalData.isOpen}
              onClose={modalData.onClose}
            />
          )
        }

        return null
      })}
    </>
  )
}
