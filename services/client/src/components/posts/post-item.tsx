/**
 * Post item.
 */

// External imports.
import moment from "moment"
import { Link } from "react-router-dom"

// Utility imports.
import { getName, getColor } from "#utils/id"

/**
 * Post item component.
 */
interface PostItemProps {
  postId: string
  authorId: string
  body: string
  published: Date
  loading?: boolean
  as?: any
  className?: string
  clickable?: boolean
  [key: string]: any
}
export function PostItem({
  postId,
  authorId,
  body,
  published,
  loading = false,
  as: As = "li",
  clickable = false,
  className = "",
  ...rest
}: PostItemProps) {
  // Get some necessary info.
  const username = getName(authorId)
  const color = getColor(authorId)

  if (loading)
    return (
      <As
        {...rest}
        className={`animate-pulse bg-gray-200 border border-black border-opacity-0 rounded-lg h-[66px] ${className} select-none`}
      ></As>
    )

  return (
    <As
      {...rest}
      className={`bg-gray-100 border border-black border-opacity-5 shadow rounded-lg p-2 ${className} relative ${
        clickable ? "select-none" : ""
      }`}
    >
      <p>{body}</p>
      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <p style={{ color }}>{username}</p>
        <p>{moment(published).fromNow()}</p>
      </div>
      {clickable && (
        <Link
          to={`/posts/${postId}`}
          className="absolute inset-0"
        />
      )}
    </As>
  )
}

/**
 * Shortcut to show a post item in loading state.
 */
interface PostItemLoadingProps {
  as?: any
  className?: string
  [key: string]: any
}
export function PostItemLoading({
  as,
  className,
  ...rest
}: PostItemLoadingProps) {
  return (
    <PostItem
      postId=""
      authorId=""
      body=""
      published={new Date()}
      loading
      as={as}
      className={className}
      {...rest}
    />
  )
}
