/**
 * List of posts.
 */

// External imports.
import { useRef } from "react"

// Component imports.
import { LoadingSpinner } from "#components/loading-spinner"
import { PostItem, PostItemLoading } from "./post-item"

// Utility imports.
import { usePosts } from "#utils/queries"

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
  const scrollBoxRef = useRef<HTMLDivElement>(null)

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

  // Return JSX.
  return (
    <div
      className={`${className} overflow-y-scroll max-h-full`}
      ref={scrollBoxRef}
      onScroll={() => handleScroll()}
      tabIndex={0}
    >
      <ul className="space-y-4 py-4 px-2">
        {isLoading
          ? [1, 2, 3].map((x) => <PostItemLoading key={x} />)
          : data.map((item) => (
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
