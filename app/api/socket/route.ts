import { NextResponse } from "next/server"

// This is just a placeholder API route
// The actual Socket.io server runs separately in server.js
export async function GET() {
  return NextResponse.json({
    message: "Socket.io server runs separately. See server.js",
  })
}

