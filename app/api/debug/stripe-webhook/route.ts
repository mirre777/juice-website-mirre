import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const mask = (val?: string, visible = 6) => {
  if (!val) return "(unset)"
  const tail = val.slice(-visible)
  return `***${tail}`
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : undefined
  const expected = process.env.DEBUG_TOKEN

  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  const host = request.headers.get("host")
  const xfHost = request.headers.get("x-forwarded-host")
  const xfProto = request.headers.get("x-forwarded-proto")

  const s1 = process.env.STRIPE_WEBHOOK_SECRET
  const s2 = process.env.STRIPE_WEBHOOK_SECRET_2
  const s3 = process.env.STRIPE_WEBHOOK_SECRET_FALLBACK

  return NextResponse.json({
    ok: true,
    env: {
      vercel: !!process.env.VERCEL,
      node_env: process.env.NODE_ENV,
      project_id: process.env.FIREBASE_PROJECT_ID ? "(set)" : "(unset)",
    },
    request: {
      host,
      "x-forwarded-host": xfHost,
      "x-forwarded-proto": xfProto,
      url: request.url,
    },
    webhookSecrets: {
      STRIPE_WEBHOOK_SECRET: mask(s1),
      STRIPE_WEBHOOK_SECRET_2: mask(s2),
      STRIPE_WEBHOOK_SECRET_FALLBACK: mask(s3),
    },
  })
}
