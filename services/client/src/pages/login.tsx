/**
 * Login page.
 */

// External imports.
import { useEffect } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

// Component imports.
import { LoadingSpinner } from "#components/loading-spinner"

// Utility imports.
import { useAuth } from "#utils/auth"

/**
 * Login page component.
 */
export function LoginPage() {
  // Use hooks.
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Determine where to redirect to after logging in.
  const { from } = location.state || { from: { pathname: "/" } }

  // Wrapper function to log in and redirect.
  function login() {
    auth.login(() => {
      navigate(from, { replace: true })
    })
  }

  // Start logging in immediately on component load.
  useEffect(() => {
    login()
  }, [])

  // If user data is present, redirect.
  if (auth.user) {
    return (
      <Navigate
        to={from}
        replace
      />
    )
  }

  // Show a temporary "logging in" view.
  // Currently just a spinner but can be something more fun in the future.
  return (
    <LoadingSpinner
      className="h-screen w-screen"
      size="lg"
    />
  )
}
