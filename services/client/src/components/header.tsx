/**
 * Header.
 */

// Component imports.
import { LogoutButton } from "#components/logout-button"
import { LoginButton } from "#components/login-button"
import { CreatePostModal } from "#components/posts"

// Utility imports.
import { useUser } from "#utils/auth"

/**
 * Header component.
 */
interface HeaderProps {
  title?: string
  withPostButton?: boolean
}
export function Header({ title, withPostButton = false }: HeaderProps) {
  // Use hooks.
  const { user, isLoading: userLoading } = useUser()

  // Return JSX.
  return (
    <div className="bg-gray-200 px-2 py-5 shadow z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <span
            className="text-red-500"
            style={
              user
                ? {
                    color: user.color,
                  }
                : undefined
            }
          >
            Yoik.ME
          </span>{" "}
          {title || ""}
        </h1>
        {user ? (
          <>
            {withPostButton && (
              <CreatePostModal
                className="bg-red-500 rounded-lg py-1 px-1.5 text-white text-sm"
                style={user ? { backgroundColor: user.color } : undefined}
              >
                New post
              </CreatePostModal>
            )}
          </>
        ) : (
          <LoginButton className="bg-red-500 rounded-lg py-1 px-1.5 text-white text-sm">
            Log in
          </LoginButton>
        )}
      </div>
      {userLoading ? (
        <>
          <div className="border border-b-black border-opacity-10 mx-6 my-2" />
          <p>
            <span className="block bg-gray-300 h-[24px] w-64 rounded animate-pulse" />
          </p>
        </>
      ) : (
        user && (
          <>
            <div className="border border-b-black border-opacity-10 mx-6 my-2" />
            <p>
              Logged in as{" "}
              <span
                className="font-bold"
                style={{ color: user.color }}
              >
                {user.username}
              </span>
            </p>
            <LogoutButton className="text-xs hover:underline text-gray-600">
              Click here to log out
            </LogoutButton>
          </>
        )
      )}
    </div>
  )
}
