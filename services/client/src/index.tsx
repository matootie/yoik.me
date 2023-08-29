/**
 * Main application entrypoint.
 */

// External imports.
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"

// Application import.
import { App } from "#app"

// Utility imports.
import "#utils/firebase"
import { AuthProvider } from "#utils/auth"

// Stylesheet imports.
import "#styles"

// Find the virtual DOM root.
const root = document.getElementById("root")!

// Render the application to the virtual DOM root.
createRoot(root).render(
  <QueryClientProvider client={new QueryClient()}>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </QueryClientProvider>
)
