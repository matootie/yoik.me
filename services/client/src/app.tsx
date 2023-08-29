/**
 * Main application.
 */

// External imports.
import { Route, Routes } from "react-router-dom"

// Page imports.
import { HomePage } from "#pages/home"
import { LoginPage } from "#pages/login"
import { LogoutPage } from "#pages/logout"

/**
 * Main application component.
 */
export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/logout"
        element={<LogoutPage />}
      />
    </Routes>
  )
}
