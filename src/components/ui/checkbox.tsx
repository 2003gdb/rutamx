"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked: controlledChecked, defaultChecked, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)

    // Use controlled value if provided, otherwise use internal state
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked

      // Update internal state if uncontrolled
      if (controlledChecked === undefined) {
        setInternalChecked(newChecked)
      }

      onCheckedChange?.(newChecked)
      props.onChange?.(e)
    }

    return (
      <label className="relative inline-flex cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          className={cn(
            // Override default appearance
            "appearance-none",
            // Size and shape
            "h-5 w-5 shrink-0 rounded",
            // Border - blue like the button (ALWAYS VISIBLE)
            "border-2 border-[#1e40af]",
            // Background
            "bg-white",
            // Interaction states
            "cursor-pointer transition-all",
            "hover:border-[#1e3a8a] hover:bg-blue-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Checked state - fill with blue
            "checked:bg-[#1e40af] checked:border-[#1e40af]",
            className
          )}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            border: isChecked ? '2px solid #1e40af' : '2px solid #1e40af',
            backgroundColor: isChecked ? '#1e40af' : '#ffffff',
          }}
          {...props}
        />
        {isChecked && (
          <Check
            className="absolute inset-0 m-auto h-4 w-4 text-white pointer-events-none"
            strokeWidth={3}
          />
        )}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
