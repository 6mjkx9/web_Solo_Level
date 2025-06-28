"use client"

import { useState } from "react"

type ToastProps = {
  id?: number
  title: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description, duration = 5000 }: ToastProps) => {
    const id = Date.now()
    const newToast = { id, title, description, duration }
    setToasts((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, duration)
  }

  return { toast, toasts }
}
