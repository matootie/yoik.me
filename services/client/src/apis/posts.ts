/**
 * Hooks for post related API calls.
 */

// External imports.
import { useInfiniteQuery } from "react-query"

// Local imports.
import { listPosts } from "#providers/posts"

/**
 * Hook to list posts with an infinite query.
 */
export function useListPosts() {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      return await listPosts({ limit: 2, cursor: pageParam })
    },
    getNextPageParam: (lastPage, _pages) => lastPage.cursor,
  })
}
