import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#3a3a3c] bg-[#1c1c1e] px-3 py-2 text-sm text-[#f5f5f7] placeholder:text-[#636366] transition-all duration-200 focus:outline-none focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#2c2c2e]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
