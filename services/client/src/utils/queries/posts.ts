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
  ListPostsOutput,
} from "#utils/data"
import { useUser } from "#utils/auth"
import { InfiniteData, useInfiniteQuery, useQueryClient } from "react-query"

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
  const queryClient = useQueryClient()

  const details = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      return await listPosts({ limit: 10, cursor: pageParam })
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  useListenPosts({
    onNewData: (data) => {
      // @ts-ignore
      queryClient.setQueryData(["posts"], (existing) => {
        // @ts-ignore
        const x: InfiniteData<ListPostsOutput> = existing
        const b = x.pages.map((page, index) => {
          if (index === 0) {
            return {
              items: [data, ...page.items],
              cursor: page.cursor,
            }
          }
          return page
        })
        return {
          pages: b,
          pageParams: x.pageParams,
        }
      })
    },
  })

  if (details.data) {
    // Reformat data before returning.
    console.log(details.data)
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
interface UseListenPostsOptions {
  onData?: (data: ListenPostsPost[]) => void
  onNewData?: (data: ListenPostsPost) => void
}
export function useListenPosts({ onData, onNewData }: UseListenPostsOptions) {
  useEffect(() => {
    const { unsubscribe } = listenPosts({
      onData,
      onNewData,
    })
    return unsubscribe
  }, [])
}
