import { create } from 'zustand';
import type { ToastMessage } from '../types';

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage['type'], onUndo?: () => void) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (message: string, type: ToastMessage['type'], onUndo?: () => void) => {
    const id = `toast-${Date.now()}`;
    const toast: ToastMessage = { id, message, type, onUndo };
    
    set(state => ({
      toasts: [...state.toasts, toast]
    }));

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 5000);
  },

  removeToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  }
}));
