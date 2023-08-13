/**
 * Logout page.
 */

// External imports.
import { useEffect } from "react"
import { useNavigate, useLocation, Navigate } from "react-router-dom"

// Local imports
import { useAuth } from "#utils/auth"

/**
 * Logout page component.
 */
export function LogoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  const { from } = location.state || { from: { pathname: "/" } }

  function logout() {
    auth.logout(() => {
      navigate("/", { replace: true })
    })
  }

  useEffect(() => {
    logout()
  }, [])

  if (!auth.user) {
    return (
      <Navigate
        to={from}
        replace
      />
    )
  }

  if (auth.loading) {
    return <h3>Loading...</h3>
  }

  return <h3>Logging out...</h3>
}
