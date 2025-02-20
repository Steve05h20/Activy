import { defineStore } from 'pinia'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
    counter: 0,
  }),

  actions: {
    addToast(message: string, type: Toast['type'] = 'info', duration: number = 5000) {
      const id = ++this.counter
      const toast: Toast = {
        id,
        message,
        type,
        duration,
      }
      this.toasts.push(toast)

      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id)
        }, duration)
      }
    },

    removeToast(id: number) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    success(message: string, duration?: number) {
      this.addToast(message, 'success', duration)
    },

    error(message: string, duration?: number) {
      this.addToast(message, 'error', duration)
    },

    warning(message: string, duration?: number) {
      this.addToast(message, 'warning', duration)
    },

    info(message: string, duration?: number) {
      this.addToast(message, 'info', duration)
    }
  }
})
