/**
 * Toast utilities.
 */

// External imports.
import t from "react-hot-toast"

// Component imports.
import { Toast } from "#components/toast"

/**
 * Spawn a toast.
 */
interface ToastOptions {
  variant?: "success" | "error"
  title: string
  body: string
}
export function toast({ variant = "success", title, body }: ToastOptions) {
  t.custom((x) => (
    <Toast
      toast={x}
      variant={variant}
      title={title}
      body={body}
    />
  ))
}
