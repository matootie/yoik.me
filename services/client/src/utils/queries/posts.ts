/**
 * Hooks for post related API calls.
 */

// External imports.
import { useEffect, useState } from "react"

// Local imports.
import {
  GetPostPost,
  ListPostsPost,
  ListenPostsPost,
  getPost,
  listPosts,
  listenPosts,
  createPost,
} from "#utils/data"
import { useUser } from "#utils/auth"
import { useInfiniteQuery } from "react-query"

/**
 * Hook to handle creating a post.
 */
interface CreateOptions {
  body: string
  onSuccess: () => void
}
export function useCreatePost() {
  const [loading, setLoading] = useState<boolean>(false)
  const { user, isLoading } = useUser(true)

  function create({ body, onSuccess }: CreateOptions) {
    if (isLoading) return
    setLoading(true)
    createPost({ body, author: user.uid }).then(() => {
      onSuccess()
      setLoading(false)
    })
  }

  return { create, isLoading: loading }
}

/**
 * Hook to handle getting a single post.
 * TODO: Replace functionality with react-query to leverage caching.
 */
interface UsePostOptions {
  postId: string
}
export function usePost({ postId }: UsePostOptions) {
  const [data, setData] = useState<GetPostPost | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getPost({ postId }).then(({ item }) => {
      setData(item)
      setLoading(false)
    })
  }, [])

  return { data, isLoading: loading }
}

/**
 * Hook to use a list of posts with pagination.
 */
export function usePosts() {
  const details = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      return await listPosts({ limit: 10, cursor: pageParam })
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    staleTime: Infinity,
  })
  if (details.data) {
    // Reformat data before returning.
    const data: ListPostsPost[] = []
    for (const page of details.data.pages) {
      data.push(...page.items)
    }
    // Return details with reformatted data.
    return {
      ...details,
      data,
    }
  } else {
    // Return details.
    return details
  }
}

/**
 * Hook to listen for incoming posts from Firebase.
 */
export function useListenPosts() {
  const [data, setData] = useState<ListenPostsPost[]>([])

  useEffect(() => {
    const { unsubscribe } = listenPosts({
      onData: setData,
    })
    return unsubscribe
  }, [])

  return { data }
}
