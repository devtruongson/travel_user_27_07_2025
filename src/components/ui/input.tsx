import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full h-[60px] px-5 py-2 text-xl font-medium rounded-xl border border-blue-400  focus:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
