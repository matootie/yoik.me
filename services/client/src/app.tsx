/**
 * Main application.
 */

// External imports.
import { Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"

// Page imports.
import { HomePage } from "#pages/home"
import { LoginPage } from "#pages/login"
import { LogoutPage } from "#pages/logout"

/**
 * Main application component.
 */
export function App() {
  return (
    <>
      <Toaster position="top-left" />
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
    </>
  )
}
