/**
 * Login button.
 */

// External imports.
import { ReactNode } from "react"
import { Link } from "react-router-dom"

/**
 * Login button component.
 */
interface LoginButtonProps {
  children?: ReactNode
  className?: string
}
export function LoginButton({ children, className = "" }: LoginButtonProps) {
  // Return JSX.
  return (
    <Link
      to="/login"
      className={`${className}`}
    >
      {children}
    </Link>
  )
}
