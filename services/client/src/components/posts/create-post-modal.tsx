/**
 * Create post modal.
 */

// External imports.
import { Fragment, ReactNode, useLayoutEffect, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"

// Component imports.
import { LoadingSpinner } from "#components/loading-spinner"

// Utility imports.
import { useUser } from "#utils/auth"
import { useCreatePost } from "#utils/queries"

/**
 * Create post modal component.
 */
interface CreatePostModalProps {
  children?: ReactNode
  className?: string
  [key: string]: any
}
export function CreatePostModal({
  children,
  className = "",
  ...rest
}: CreatePostModalProps) {
  // Use hooks.
  const { user } = useUser()
  const [open, setOpen] = useState<boolean>(false)
  const htmlRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState<string>("")
  const { create, isLoading } = useCreatePost()

  useLayoutEffect(() => {
    if (!htmlRef?.current) return
    htmlRef.current.style.height = "inherit"
    htmlRef.current.style.height = `${htmlRef.current.scrollHeight}px`
  }, [value])

  function handleClose() {
    setOpen(false)
    setTimeout(() => setValue(""), 200)
  }

  function handleSubmit() {
    if (isLoading) return
    create({
      body: value,
      onSuccess: () => {
        handleClose()
      },
    })
  }

  // Return JSX.
  return (
    <>
      <button
        className={`${className}`}
        onClick={() => setOpen(true)}
        disabled={open}
        {...rest}
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
          onClose={() => handleClose()}
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
            <div className="fixed inset-0 bg-black bg-opacity-30" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    What&apos;s on your mind?
                  </Dialog.Title>

                  <div className="mt-4 flex justify-stretch">
                    <textarea
                      className="w-full p-2 bg-gray-100 rounded-lg"
                      onChange={(e) => setValue(e.target.value)}
                      ref={htmlRef}
                      style={{
                        resize: "none",
                      }}
                      value={value}
                      maxLength={240}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleSubmit()
                        }
                      }}
                    />
                  </div>

                  <div className="mt-4 flex justify-end items-center">
                    {!isLoading && (
                      <span
                        className={`block mr-auto text-xs select-none hover:cursor-default ${
                          value.length >= 240
                            ? "text-red-600"
                            : value.length >= 220
                            ? "text-orange-600"
                            : value.length >= 200
                            ? "text-yellow-700"
                            : "text-transparent"
                        }`}
                      >
                        {value.length}
                      </span>
                    )}
                    <LoadingSpinner
                      size="sm"
                      className={`mr-4 py-0 ${
                        isLoading ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:grayscale disabled:text-stone-300 disabled:animate-pulse"
                      style={user ? { backgroundColor: user.color } : undefined}
                      disabled={isLoading}
                      onClick={() => handleSubmit()}
                    >
                      Post
                    </button>
                  </div>

                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:ring rounded-md p-0.5"
                    onClick={() => handleClose()}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
