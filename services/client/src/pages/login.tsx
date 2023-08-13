/**
 * Login page.
 */

// External imports.
import { useEffect } from "react"
import { useNavigate, useLocation, Navigate } from "react-router-dom"

// Local imports.
import { useAuth } from "#utils/auth"

/**
 * Login page component.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  const { from } = location.state || { from: { pathname: "/" } }

  function login() {
    auth.login(() => {
      navigate(from, { replace: true })
    })
  }

  useEffect(() => {
    login()
  }, [])

  if (auth.user) {
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

  return <h3>Logging in...</h3>
}
