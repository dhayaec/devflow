import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: "sm" | "default" | "lg"
}

const sizeClasses = {
  sm: "size-6 text-xs",
  default: "size-8 text-sm",
  lg: "size-10 text-base",
}

function Avatar({
  className,
  src,
  alt,
  fallback,
  size = "default",
  ...props
}: AvatarProps) {
  if (src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          className="size-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {fallback ?? "?"}
    </div>
  )
}

export { Avatar }
