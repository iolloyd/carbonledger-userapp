import { ref } from 'vue'

interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
  id: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = nextId++
    const toast: Toast = {
      message,
      type,
      id
    }
    
    toasts.value.push(toast)
    
    // Automatically remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}

// Create a ToastContainer component to display the toasts
export const ToastContainer = {
  setup() {
    const { toasts, removeToast } = useToast()

    return {
      toasts,
      removeToast
    }
  },
  template: `
    <div class="fixed bottom-4 right-4 z-50">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'mb-2 p-4 rounded-md shadow-lg',
            {
              'bg-green-500 text-white': toast.type === 'success',
              'bg-red-500 text-white': toast.type === 'error',
              'bg-blue-500 text-white': toast.type === 'info'
            }
          ]"
        >
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  `
}