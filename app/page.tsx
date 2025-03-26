"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Code2, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            <span className="text-xl font-bold">CodeCollab</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/create"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Start Coding
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <motion.h1
              className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Real-time collaborative coding <br className="hidden sm:inline" />
              for pairs made simple.
            </motion.h1>
            <motion.p
              className="max-w-[750px] text-lg text-muted-foreground sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Connect with a partner and code together in real-time. Perfect for pair programming, interviews, and
              teaching.
            </motion.p>
          </div>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/create"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Create Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/join"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Join Session
            </Link>
          </motion.div>
        </section>

        <section className="border-t bg-muted/40">
          <div className="container py-12 md:py-16 lg:py-24">
            <motion.div
              className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Real-time Editing</h3>
                <p className="text-muted-foreground">
                  See changes as they happen with instant synchronization between both users.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Private Sessions</h3>
                <p className="text-muted-foreground">
                  Password-protected sessions ensure only you and your partner can access your code.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    <path d="M12 3a6 6 0 0 1-9 9 9 9 0 0 0 9-9Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium">Modern Experience</h3>
                <p className="text-muted-foreground">
                  Enjoy a sleek interface with powerful code editing capabilities.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container py-12 md:py-16 lg:py-24">
          <motion.div
            className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How it works</h2>
              <p className="text-muted-foreground">
                Getting started with CodeCollab is simple. Create a session, share the link and password with your
                partner, and start coding together instantly.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <span>Create a new coding session</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </div>
                  <span>Set a password and share the session link</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </div>
                  <span>Code together in real-time</span>
                </li>
              </ul>
              <div>
                <Link
                  href="/create"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Try it now
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-1 shadow-sm">
              <div className="rounded bg-muted px-4 py-3 font-mono text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">session.js</div>
                  <div className="flex space-x-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              <pre className="p-4 text-sm">
                <code className="language-javascript">
                  {`// Collaborative code editor
import { createEditor } from 'monaco-editor';
import { io } from 'socket.io-client';

// Initialize the editor
const editor = createEditor('#editor', {
  language: 'javascript',
  theme: 'vs-dark'
});

// Connect to the collaboration server
const socket = io('/session/abc123', {
  auth: { password: '********' }
});

// Listen for changes from your partner
socket.on('code-change', (change) => {
  editor.applyEdits(change);
});

// Send your changes to your partner
editor.onDidChangeContent((event) => {
  socket.emit('code-change', event.changes);
});`}
                </code>
              </pre>
            </div>
          </motion.div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} CodeCollab. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

