/**
 * List of posts.
 */

// Component imports.
import { LoadingSpinner } from "#components/loading-spinner"
import { PostItem, PostItemLoading } from "./post-item"

// Utility imports.
import { ListPostsPost } from "#utils/data"
import { useListenPosts, usePosts } from "#utils/queries"
import { useEffect, useRef } from "react"

/**
 * List of posts component.
 */
interface PostListProps {
  className?: string
}
export function PostsList({ className = "" }: PostListProps) {
  // Use hooks.
  const {
    data = [],
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePosts()
  const { data: realtime } = useListenPosts()
  const scrollBoxRef = useRef<HTMLDivElement>(null)

  /**
   * Function to handle key presses for navigation.
   */
  function handleKeyDown(key: string) {
    const scrollSensitivity = 100
    const ref = scrollBoxRef.current
    if (!ref) return
    if (key === "k") {
      ref.scroll({
        top: ref.scrollTop - scrollSensitivity,
        behavior: "smooth",
      })
    } else if (key === "j") {
      ref.scroll({
        top: ref.scrollTop + scrollSensitivity,
        behavior: "smooth",
      })
    }
  }

  // Automatically focus the scrollable box.
  useEffect(() => {
    scrollBoxRef.current?.focus()
  }, [])

  /**
   * Function to handle scrolling for infinite page loading.
   */
  function handleScroll() {
    const ref = scrollBoxRef.current
    if (!ref) return
    const h = ref.scrollHeight - ref.clientHeight
    const t = ref.scrollTop
    const offset = ref.clientHeight * 2
    if (t >= h - offset && !isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }

  // Strip duplcates (react-query not behaving well with realtime fetch from
  // firebase)
  // TODO: Workshopping a better implementation where realtime data will be
  // automatically added to the query data, but this is functional for now.
  const items = [...realtime, ...data].reduce((prev, curr) => {
    for (const x of prev) {
      if (x.postId === curr.postId) {
        return prev
      }
    }
    return [...prev, curr]
  }, [] as ListPostsPost[])

  // Return JSX.
  return (
    <div
      className={`${className} overflow-y-scroll max-h-full`}
      ref={scrollBoxRef}
      onScroll={() => handleScroll()}
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e.key)}
    >
      <ul className="space-y-4 py-4 px-2">
        {isLoading
          ? [1, 2, 3].map((x) => <PostItemLoading key={x} />)
          : items.map((item) => (
              <PostItem
                key={item.postId}
                authorId={item.author.uid}
                body={item.body}
                postId={item.postId}
                published={item.published}
              />
            ))}
      </ul>
      {hasNextPage && <LoadingSpinner />}
      {!isLoading && !hasNextPage && (
        <p className="text-sm text-center mb-5 text-gray-500">no more posts</p>
      )}
    </div>
  )
}
