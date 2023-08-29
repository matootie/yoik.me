/**
 * Home page.
 */

// Component imports.
import { Header } from "#components/header"
import { PostsList } from "#components/posts"

/**
 * Home page component.
 */
export function HomePage() {
  return (
    <div className="h-screen flex flex-col">
      <Header
        title="Posts"
        withPostButton
      />
      <PostsList />
    </div>
  )
}
