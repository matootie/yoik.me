/**
 * Logout page.
 */

// External imports.
import { useEffect } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useQueryClient } from "react-query"

// Component imports.
import { LoadingSpinner } from "#components/loading-spinner"

// Utility imports.
import { useAuth } from "#utils/auth"

/**
 * Logout page component.
 */
export function LogoutPage() {
  // Use hooks.
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Determine where to redirect if already logged out.
  const { from } = location.state || { from: { pathname: "/" } }

  // Wrapper function to log out and redirect.
  function logout() {
    auth.logout(() => {
      queryClient.refetchQueries(["posts"])
      navigate("/", { replace: true })
    })
  }

  // Start logging out immediately on component load.
  useEffect(() => {
    logout()
  }, [])

  // If user data is not present, redirect back.
  if (!auth.user) {
    return (
      <Navigate
        to={from}
        replace
      />
    )
  }

  // Show a temporary "logging out" view.
  // Currently just a spinner but also logging out is so fast there is no point in making this view more fun.
  return (
    <LoadingSpinner
      className="h-screen w-screen"
      size="lg"
    />
  )
}
