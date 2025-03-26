"use server"

import { db } from "@/lib/db"
import { randomUUID } from "crypto"

export async function createSession(name: string, password: string) {
  try {
    const session = await db.session.create({
      data: {
        id: randomUUID(),
        name,
        password,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })

    return session.id
  } catch (error) {
    console.error("Failed to create session:", error)
    throw new Error("Failed to create session")
  }
}

export async function validateSession(sessionId: string, password: string) {
  try {
    const session = await db.session.findUnique({
      where: {
        id: sessionId,
      },
    })

    if (!session) {
      return { valid: false }
    }

    if (session.password !== password) {
      return { valid: false }
    }

    // Check if session is expired
    if (session.expiresAt && new Date() > session.expiresAt) {
      return { valid: false }
    }

    return {
      valid: true,
      session: {
        id: session.id,
        name: session.name,
        createdAt: session.createdAt,
      },
    }
  } catch (error) {
    console.error("Failed to validate session:", error)
    throw new Error("Failed to validate session")
  }
}

