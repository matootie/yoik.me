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

// Local imports.
import {
  FirebaseUser,
  browserSessionPersistence,
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
 * Use this in pages and components where the user may or may not be logged in
 * or where you need to access login/logout functionality.
 */
export function useAuth() {
  return useContext(AuthContext)
}

/**
 * Hook to retrieve the currently logged in user.
 *
 * Use this only in pages and components where the the user is guaranteed to be
 * logged in, for example in a page wrapped with the RequireAuth component.
 */
export function useUser(required: true): User
export function useUser(required: false): User | undefined
export function useUser(): User | undefined
export function useUser(required: boolean = false): User | undefined {
  const { user } = useContext(AuthContext)
  if (required && !user) {
    redirect("/login")
    return
  }
  return user
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
  // Display loading if loading.
  if (loading) {
    return <span>Loading...</span>
  }
  // If the user exists, show the children.
  if (user) {
    return <>{children}</>
  }
  // Otherwise, show an error.
  return <span>{error || "An unknown error has occurred"}</span>
}

/** Lower level things */

interface User extends FirebaseUser {
  color: string
  username: string
}

interface AuthState {
  user?: User
  loading: boolean
  error?: string
  login: (callback: CallableFunction) => Promise<void>
  logout: (callback: CallableFunction) => Promise<void>
}

const AuthContext = createContext<AuthState>({
  loading: true,
  login: async () => {},
  logout: async () => {},
})

function useProvideAuth(): AuthState {
  const [user, setUser] = useState<User | undefined>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>()

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

  const login = async (callback: CallableFunction) => {
    setLoading(true)
    setError(undefined)
    const auth = getAuth()
    try {
      setPersistence(auth, browserSessionPersistence)
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

  return {
    user,
    loading,
    error,
    login,
    logout,
  }
}

interface AuthProviderProps {
  children: ReactNode
}
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
