/**
 * Hooks for comment related API calls.
 */

// External imports.
import { useEffect, useState } from "react"

// Local imports.
import {
  ListCommentsComment,
  ListenCommentsComment,
  listComments,
  listenComments,
} from "#utils/data"

export function useTopComment({ postId }: { postId: string }) {
  const [data, setData] = useState<ListCommentsComment | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    // TODO: get the most liked comment.
    listComments({ postId, limit: 1 }).then(({ items }) => {
      setData(items[0])
      setLoading(false)
    })
  }, [])

  return { data, isLoading: loading }
}

interface UseCommentsOptions {
  postId: string
  pageSize?: number
}
export function useComments({ postId, pageSize = 10 }: UseCommentsOptions) {
  const [cursor, setCursor] = useState<string | undefined>()
  const [existingData, setExistingData] = useState<ListCommentsComment[]>([])
  const [newData, setNewData] = useState<ListenCommentsComment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingNext, setLoadingNext] = useState<boolean>(false)

  // Initial data load.
  useEffect(() => {
    setLoading(true)
    listComments({ postId, limit: pageSize }).then(
      ({ items, cursor: newCursor }) => {
        setExistingData(items)
        setCursor(newCursor)
        setLoading(false)
      }
    )
  }, [])

  // Listen for incoming data.
  useEffect(() => {
    const { unsubscribe } = listenComments({
      postId,
      onData: setNewData,
    })
    return unsubscribe
  }, [])

  // Function to load next page.
  function next() {
    if (cursor !== undefined) {
      setLoadingNext(true)
      listComments({ postId, limit: pageSize, cursor }).then(
        ({ items, cursor: newCursor }) => {
          setExistingData([...existingData, ...items])
          setCursor(newCursor)
          setLoadingNext(false)
        }
      )
    }
  }

  return {
    isLoading: loading,
    data: [...newData, ...existingData],
    fetchNextPage: next,
    isFetchingNextPage: loadingNext,
    hasNextPage: cursor !== undefined,
  }
}
