import { ArrowPathIcon } from "@heroicons/react/24/outline"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}
export function LoadingSpinner({
  className,
  size = "md",
}: LoadingSpinnerProps) {
  const dimensions =
    size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6 w-6"

  return (
    <div className={`flex justify-center items-center py-4 ${className}`}>
      <ArrowPathIcon className={`${dimensions} animate-spin`} />
    </div>
  )
}
