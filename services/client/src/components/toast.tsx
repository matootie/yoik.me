/**
 * Toast.
 */

// External imports.
import { Fragment } from "react"
import toast, { Toast as ToastType } from "react-hot-toast"
import { Transition } from "@headlessui/react"
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

/**
 * Toast component.
 */
interface ToastProps {
  toast: ToastType
  variant: "error" | "success"
  title: string
  body: string
}
export function Toast({ toast: t, variant, title, body }: ToastProps) {
  return (
    <Transition
      show={t.visible}
      appear={true}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="-translate-y-2 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-indigo-500 ring-opacity-5 bg-gray-100">
        <div className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {variant === "success" ? (
                <CheckCircleIcon
                  className="h-8 w-8 text-white bg-green-500 rounded-full"
                  aria-hidden="true"
                />
              ) : (
                <ExclamationCircleIcon
                  className="h-8 w-8 text-white bg-red-500 rounded-full"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text font-medium">{title}</p>
              <p className="mt-1 text-sm">{body}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => toast.dismiss(t.id)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}
