import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#0a84ff] text-white hover:bg-[#409cff] shadow-sm hover:shadow focus-visible:ring-2 focus-visible:ring-[#0a84ff]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
        destructive: "bg-[#ff453a] text-white hover:bg-[#ff6961] shadow-sm hover:shadow focus-visible:ring-2 focus-visible:ring-[#ff453a]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
        outline: "border border-[#3a3a3c] bg-[#1c1c1e] text-[#f5f5f7] hover:bg-[#2c2c2e] hover:border-[#636366] focus-visible:ring-2 focus-visible:ring-[#0a84ff]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
        secondary: "bg-[#2c2c2e] text-[#f5f5f7] hover:bg-[#3a3a3c] focus-visible:ring-2 focus-visible:ring-[#0a84ff]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
        ghost: "text-[#f5f5f7] hover:bg-[#2c2c2e] focus-visible:ring-2 focus-visible:ring-[#0a84ff]/20",
        link: "text-[#0a84ff] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#0a84ff]/20",
        premium: "bg-gradient-to-b from-[#409cff] to-[#0a84ff] text-white shadow-md hover:shadow-lg hover:from-[#64b5f6] hover:to-[#409cff] focus-visible:ring-2 focus-visible:ring-[#0a84ff]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
      },
      size: {
        default: "h-10 px-5 py-2 text-[0.9375rem] rounded-[10px]",
        sm: "h-8 px-3.5 text-[0.8125rem] rounded-lg",
        lg: "h-12 px-8 text-base rounded-xl",
        xl: "h-14 px-10 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-[10px]",
        "icon-sm": "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
