/**
 * Home page.
 */

// External imports.
import { Fragment } from "react"
import { Link } from "react-router-dom"

// Local imports.
import { useListPosts } from "#apis/posts"
import { useUser } from "#utils/auth"

/**
 * Home page component.
 */
export function HomePage() {
  // Get user data.
  const user = useUser()

  // Fetch posts.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useListPosts()

  // Return JSX.
  return (
    <>
      <h1>Home</h1>
      {user ? (
        <>
          <p>
            Welcome, <span style={{ color: user.color }}>{user.username}</span>!
          </p>
          <Link to="/logout">Log out</Link>
        </>
      ) : (
        <>
          <p>Welcome, please login.</p>
          <Link to="/login">Log in</Link>
        </>
      )}
      <div>
        {status === "loading" && <span>Loading...</span>}
        {data && (
          <ul>
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.items.map((x) => (
                  <li key={x.postId}>
                    <p>
                      {x.body} <br />
                      <small>
                        -{" "}
                        <span style={{ color: x.author.color }}>
                          {x.author.username}
                        </span>{" "}
                        {x.published.toLocaleString()}
                      </small>
                    </p>
                  </li>
                ))}
              </Fragment>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        Fetch more
      </button>
    </>
  )
}
