/**
 * Logout button.
 */

// External imports.
import { Fragment, ReactNode, useState } from "react"
import { Link } from "react-router-dom"
import { Dialog, Transition } from "@headlessui/react"

// Utility imports.
import { useUser } from "#utils/auth"
import { XMarkIcon } from "@heroicons/react/24/outline"

/**
 * Logout button component.
 */
interface LogoutButtonProps {
  children?: ReactNode
  className?: string
}
export function LogoutButton({ children, className = "" }: LogoutButtonProps) {
  // Use hooks.
  const { user } = useUser()
  const [open, setOpen] = useState<boolean>(false)

  // Return JSX.
  return (
    <>
      <button
        className={`${className}`}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      <Transition
        appear
        show={open}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-50 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Are you sure?
                  </Dialog.Title>

                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:ring rounded-md p-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  <div className="mt-4 flex justify-stretch">
                    <p>
                      If you log out you will lose the identity{" "}
                      <span
                        className="font-semibold text-red-500"
                        style={user ? { color: user.color } : undefined}
                      >
                        {user?.username || ""}
                      </span>{" "}
                      forever. Make sure you really want to do this!
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end items-center">
                    <Link
                      to="/logout"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:grayscale disabled:text-stone-300 disabled:animate-pulse"
                      style={user ? { backgroundColor: user.color } : undefined}
                    >
                      I am sure, log me out!
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
