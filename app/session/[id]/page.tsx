"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Copy, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { validateSession } from "@/lib/actions"
import { toast } from "sonner"
import CodeEditor from "@/components/code-editor"
import { io, type Socket } from "socket.io-client"
import { motion } from "framer-motion"
import OutputPanel from "@/components/output-panel"

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = params.id as string
  const password = searchParams.get("password") || ""

  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [sessionData, setSessionData] = useState<any>(null)
  const [connectedUsers, setConnectedUsers] = useState(0)
  const [error, setError] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  const [output, setOutput] = useState<string[]>([])
  const [runError, setRunError] = useState<string>("")
  const [codeContent, setCodeContent] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let socketInstance: Socket | null = null

    const initializeSession = async () => {
      try {
        if (!sessionId || !password) {
          setError("Session ID and password are required")
          setIsLoading(false)
          return
        }

        const result = await validateSession(sessionId, password)
        if (!result.valid) {
          setError("Invalid session or password")
          setIsLoading(false)
          return
        }

        // Connect to socket
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
        socketInstance = io(socketUrl, {
          auth: { sessionId, password },
          reconnectionAttempts: 3,
          timeout: 5000,
        })

        socketInstance.on("connect", () => {
          setSocket(socketInstance)
          setIsValid(true)
          setSessionData(result.session)
        })

        socketInstance.on("users", setConnectedUsers)
        socketInstance.on("session_full", () => setError("Session is full (2/2 users)"))
        socketInstance.on("connect_error", (err) => {
          console.error("Connection error:", err)
          setError(err.message || "Failed to connect to session")
        })

      } catch (err) {
        console.error("Session error:", err)
        setError("Failed to initialize session")
      } finally {
        setIsLoading(false)
      }
    }

    initializeSession()

    return () => {
      socketInstance?.disconnect()
    }
  }, [sessionId, password])

  // Error handling for socket connection
  useEffect(() => {
    if (socket) {
      const handleDisconnect = () => setError("Disconnected from server")
      socket.on("disconnect", handleDisconnect)
      return () => {
        socket.off("disconnect", handleDisconnect)
      }
    }
  }, [socket])


  const copySessionLink = () => {
    const url = `${window.location.origin}/session/${sessionId}`
    navigator.clipboard.writeText(url)
    toast("Link copied. Share this link with your partner")
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setRunError("")
    setOutput([])
  
    try {
      // Capture console output
      const logs: string[] = []
      const originalConsole = {
        log: console.log.bind(console) as typeof console.log,
        error: console.error.bind(console) as typeof console.error,
        warn: console.warn.bind(console) as typeof console.warn,
        info: console.info.bind(console) as typeof console.info,
      };
      
  
      // Override console methods
      (['log', 'error', 'warn', 'info'] as const).forEach((method) => {
        // @ts-ignore - Temporarily override console methods
        console[method] = (...args: any[]) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg.toString()
          ).join(' '))
          originalConsole[method](...args)
        }
      })
  
      // Execute code safely
      const fn = new Function(codeContent)
      const result = fn()
  
      // Handle async code
      if (result instanceof Promise) {
        await result
      }
  
      // Restore original console methods
      Object.assign(console, originalConsole)
      setOutput(logs)
    } catch (error) {
      setRunError((error as Error).message)
    } finally {
      setIsRunning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button className="mt-4 w-full" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Session</AlertTitle>
            <AlertDescription>The session ID or password is incorrect.</AlertDescription>
          </Alert>
          <Button className="mt-4 w-full" onClick={() => router.push("/join")}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-col h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="border-b bg-background p-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">{sessionData?.name || "Coding Session"}</h1>
            <Badge variant={connectedUsers === 2 ? "default" : "outline"}>
              <Users className="mr-1 h-3 w-3" />
              {connectedUsers}/2 users
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={copySessionLink}>
              <Copy className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        <div className="flex-1 flex flex-col border-r w-[50%]">
          <CodeEditor 
            sessionId={sessionId} 
            socket={socket}
            onCodeChange={setCodeContent}
            onRun={handleRunCode}
            isRunning={isRunning}
          />
        </div>
        <div className="w-[50%]">
          <OutputPanel output={output} error={runError} />
        </div>
        
      </main>
    </motion.div>
  )
}

