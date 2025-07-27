import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border border:blue-400 w-full min-h-56 px-5 py-4 text-xl font-medium rounded-xl cursor-pointer focus:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
