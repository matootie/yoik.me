/**
 * Main application entrypoint.
 */

// External imports.
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"

// Local imports.
import "#utils/firebase"
import { AuthProvider } from "#utils/auth"
import { App as Shell } from "#app"

// Find the virtual DOM root.
const root = document.getElementById("root")
if (!root) throw new Error("Missing root")

/**
 * Application component.
 */
function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Router>
          <Shell />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

// Render the application to the virtual DOM root.
createRoot(root).render(<App />)
