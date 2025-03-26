"use client"

import { useEffect, useState, useRef } from "react"
import { type Socket } from "socket.io-client"
import { Loader2, Play } from "lucide-react"
import Editor from "@monaco-editor/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
  { id: "python", name: "Python" },
]

interface CodeEditorProps {
  sessionId: string
  socket: Socket | null
  onCodeChange?: (content: string) => void
  onRun?: () => void
  isRunning?: boolean
}

export default function CodeEditor({ sessionId, socket, onCodeChange, onRun, isRunning }: CodeEditorProps) {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("// Start coding here\n\n")
  const [isApplyingChanges, setIsApplyingChanges] = useState(false)
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)

  // Configure Monaco before mounting
  const configureEditor = (monaco: any) => {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
      lib: ["es5", "dom", "es2015"],
      allowJs: true,
      checkJs: true,
    })

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    })

    // Add type definitions for better IntelliSense
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      declare var console: {
        log(...args: any[]): void;
        error(...args: any[]): void;
        warn(...args: any[]): void;
        info(...args: any[]): void;
      }
      declare function setTimeout(callback: () => void, ms: number): number;
      declare function clearTimeout(timeoutId: number): void;
    `, 'ts:globals.d.ts')
  }

  // Handle editor mount
  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Set up change listener
    editor.onDidChangeModelContent((event: any) => {
      if (isApplyingChanges || !socket) return

      const model = editor.getModel()
      const changes = event.changes.map((change: any) => ({
        range: {
          startLineNumber: change.range.startLineNumber,
          startColumn: change.range.startColumn,
          endLineNumber: change.range.endLineNumber,
          endColumn: change.range.endColumn
        },
        text: change.text
      }))

      socket.emit("code_delta", {
        sessionId,
        changes,
        version: model.getVersionId(),
        language
      })

      if (onCodeChange) {
        onCodeChange(editor.getValue())
      }
    })
  }

  // Handle incoming code changes
  useEffect(() => {
    if (!socket || !editorRef.current) return

    const handleCodeDelta = ({ changes, version }: any) => {
      const model = editorRef.current.getModel()
      if (!model) return

      setIsApplyingChanges(true)
      try {
        if (model.getVersionId() < version) {
          editorRef.current.executeEdits(null, changes.map((change: any) => ({
            range: new monacoRef.current.Range(
              change.range.startLineNumber,
              change.range.startColumn,
              change.range.endLineNumber,
              change.range.endColumn
            ),
            text: change.text
          })))
        }
      } finally {
        setIsApplyingChanges(false)
      }
    }

    const handleLanguageChange = (data: { language: string }) => {
      setLanguage(data.language)
      monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), data.language)
    }

    socket.on("code_delta", handleCodeDelta)
    socket.on("language_change", handleLanguageChange)

    return () => {
      socket.off("code_delta", handleCodeDelta)
      socket.off("language_change", handleLanguageChange)
    }
  }, [socket, language, sessionId])

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    if (socket) {
      socket.emit("language_change", { sessionId, language: value })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-muted/40 p-2 flex items-center justify-between">
        <div className="w-40">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          size="sm" 
          onClick={onRun}
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Run
        </Button>
      </div>
      
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        beforeMount={configureEditor}
        onMount={handleEditorMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          tabSize: 2,
          wordWrap: "on",
          suggest: {
            showWords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true
          },
          quickSuggestions: true,
          parameterHints: { enabled: true }
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      />
    </div>
  )
}