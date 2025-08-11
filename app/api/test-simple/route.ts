export async function GET() {
  return Response.json({
    message: "API route working",
    timestamp: new Date().toISOString(),
    env_check: process.env.STRIPE_WEBHOOK_SECRET ? "secret_exists" : "no_secret",
  })
}

export async function POST() {
  return Response.json({
    message: "POST working",
    timestamp: new Date().toISOString(),
    env_check: process.env.STRIPE_WEBHOOK_SECRET ? "secret_exists" : "no_secret",
  })
}
