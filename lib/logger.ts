interface LogContext {
  [key: string]: any
}

interface LogData {
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  context?: LogContext
  requestId?: string
  userId?: string
  trainerId?: string
}

// Simple logger to avoid complex object conversion issues
class SimpleLogger {
  private isDev = process.env.NODE_ENV === "development"

  info(message: string, data?: Record<string, any>) {
    const timestamp = new Date().toISOString()
    const logData = data ? JSON.stringify(data, null, 2) : ""
    console.log(`[${timestamp}] INFO: ${message}${logData ? "\n" + logData : ""}`)
  }

  warn(message: string, data?: Record<string, any>) {
    const timestamp = new Date().toISOString()
    const logData = data ? JSON.stringify(data, null, 2) : ""
    console.warn(`[${timestamp}] WARN: ${message}${logData ? "\n" + logData : ""}`)
  }

  error(message: string, data?: Record<string, any>) {
    const timestamp = new Date().toISOString()
    const logData = data ? JSON.stringify(data, null, 2) : ""
    console.error(`[${timestamp}] ERROR: ${message}${logData ? "\n" + logData : ""}`)
  }

  debug(message: string, data?: Record<string, any>) {
    if (this.isDev) {
      const timestamp = new Date().toISOString()
      const logData = data ? JSON.stringify(data, null, 2) : ""
      console.debug(`[${timestamp}] DEBUG: ${message}${logData ? "\n" + logData : ""}`)
    }
  }
}

export const logger = new SimpleLogger()
