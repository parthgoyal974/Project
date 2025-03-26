"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface OutputPanelProps {
  output: string[]
  error?: string
}

export default function OutputPanel({ output, error }: OutputPanelProps) {
  return (
    <div className="h-full bg-muted/50 p-4 overflow-auto">
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="font-mono text-sm whitespace-pre-wrap">
        {output.map((line, index) => (
          <div key={index} className="mb-1">
            {`> ${line}`}
          </div>
        ))}
      </div>
    </div>
  )
}