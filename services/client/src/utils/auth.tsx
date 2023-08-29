/**
 * Auth utilities.
 */

// External imports.
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { Navigate, redirect, useLocation } from "react-router-dom"

// Component imports.
import { LoadingSpinner } from "#components/loading-spinner"

// Utility imports.
import {
  FirebaseUser,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signOut,
} from "#utils/firebase"
import { getColor, getName } from "#utils/id"

/**
 * Hook to retrieve the current auth state.
 *
 * Use this in pages and components where you need to access login/logout
 * functionality.
 * In most cases, just redirect to /login or /logout instead. Or, even better,
 * use the LoginButton and LogoutButton components.
 */
export function useAuth() {
  return useContext(AuthContext)
}

/**
 * Hook to retrieve the currently logged in user.
 *
 * Can conveniently be used to automatically redirect the user to login if there is no auth, in that way the user is either always available or the auth state is loading.
 */
type UseUserOutput =
  | {
      user: undefined
      isLoading: true
    }
  | {
      user: User
      isLoading: false
    }
type UseUserNoUser = {
  user: undefined
  isLoading: false
}
export function useUser(required: true): UseUserOutput
export function useUser(required: false): UseUserOutput | UseUserNoUser
export function useUser(): UseUserOutput | UseUserNoUser
export function useUser(
  required: boolean = false
): UseUserOutput | UseUserNoUser {
  // Get the user and loading state from auth context.
  const { user, loading } = useContext(AuthContext)
  // If not loading and there is no user...
  if (!loading && !user) {
    // If we require the user, then redirect.
    if (required) redirect("/login")
    // Otherwise, return UseUserNoUser type.
    return { user: undefined, isLoading: false }
  }
  // If there is no user but we are loading...
  if (!user || loading) {
    // Return that variation of UseUserOutput.
    return { user: undefined, isLoading: true }
  }
  // Otherwise, return the user!
  return { user, isLoading: false }
}

/**
 * Component to force authentication to view the subtree.
 *
 * Use this to force a user to authenticate before viewing a page or component.
 */
interface RequireAuthProps {
  children: ReactNode
}
export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()
  // Get auth from context.
  const { user, loading, error } = useContext(AuthContext)

  // Display full screen loading if loading.
  // TODO: provide more control over loading view, no use for this now.
  if (loading) {
    return (
      <LoadingSpinner
        className="h-screen w-screen"
        size="lg"
      />
    )
  }

  // If the user doesn't exist, send them to login.
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  // If the user exists, show the children.
  if (user) {
    return <>{children}</>
  }

  // Otherwise, show an error.
  return <span>{error || "An unknown error has occurred"}</span>
}

/** Lower level things */

// Extended interface of Firebase User.
interface User extends FirebaseUser {
  color: string
  username: string
}

// Interface representing auth state.
interface AuthState {
  user?: User
  loading: boolean
  error?: string
  login: (callback: CallableFunction) => Promise<void>
  logout: (callback: CallableFunction) => Promise<void>
}

// Create an auth context.
const AuthContext = createContext<AuthState>({
  loading: true,
  login: async () => {},
  logout: async () => {},
})

/**
 * Hook to provide auth state.
 */
function useProvideAuth(): AuthState {
  const [user, setUser] = useState<User | undefined>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>()

  // Listen for any changes with auth and update state accordingly.
  useEffect(() => {
    setLoading(true)
    setError(undefined)
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          ...user,
          color: getColor(user.uid),
          username: getName(user.uid),
        })
        setLoading(false)
      } else {
        setUser(undefined)
        setLoading(false)
      }
    })
    return unsubscribe
  }, [setUser])

  // Function to handle logging in and updating auth state.
  // Currently only anonymous logins are supported.
  const login = async (callback: CallableFunction) => {
    setLoading(true)
    setError(undefined)
    const auth = getAuth()
    try {
      setPersistence(auth, browserLocalPersistence)
      const { user } = await signInAnonymously(auth)
      setUser({
        ...user,
        color: getColor(user.uid),
        username: getName(user.uid),
      })
      setLoading(false)
      callback()
    } catch {
      setError("An unknown error occurred")
      setLoading(false)
    }
  }

  // Function to handle logging out and updating auth state.
  const logout = async (callback: CallableFunction) => {
    setLoading(true)
    setError(undefined)
    const auth = getAuth()
    try {
      await signOut(auth)
      setUser(undefined)
      setLoading(false)
      callback()
    } catch {
      setError("An unknown error occurred")
      setLoading(false)
    }
  }

  // Return the auth state.
  return {
    user,
    loading,
    error,
    login,
    logout,
  }
}

/**
 * Auth provider component.
 */
interface AuthProviderProps {
  children: ReactNode
}
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
