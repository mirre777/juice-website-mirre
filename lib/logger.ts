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

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : ""
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  private formatLog(level: LogEntry["level"], message: string, context?: LogContext): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: this.getRequestId(),
    }
  }

  private getRequestId(): string {
    // In a real app, this would come from request headers or context
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private output(logEntry: LogEntry) {
    const logString = JSON.stringify(logEntry, null, this.isDevelopment ? 2 : 0)

    switch (logEntry.level) {
      case "error":
        console.error(logString)
        break
      case "warn":
        console.warn(logString)
        break
      case "debug":
        if (this.isDevelopment) {
          console.debug(logString)
        }
        break
      default:
        console.log(logString)
    }
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage("info", message, context))
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("warn", message, context))
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatMessage("error", message, context))
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, context))
    }
  }

  // Trainer-specific logging methods
  trainerCreated(tempId: string, email: string) {
    this.info("Trainer profile created", {
      event: "trainer_created",
      tempId,
      email,
      timestamp: new Date().toISOString(),
    })
  }

  trainerActivated(trainerId: string, tempId: string, paymentIntentId: string) {
    this.info("Trainer profile activated", {
      event: "trainer_activated",
      trainerId,
      tempId,
      paymentIntentId,
      timestamp: new Date().toISOString(),
    })
  }

  trainerContentUpdated(trainerId: string, contentKeys: string[]) {
    this.info("Trainer content updated", {
      event: "trainer_content_updated",
      trainerId,
      contentKeys,
      timestamp: new Date().toISOString(),
    })
  }

  paymentProcessed(paymentIntentId: string, amount: number, currency: string) {
    this.info("Payment processed successfully", {
      event: "payment_processed",
      paymentIntentId,
      amount,
      currency,
      timestamp: new Date().toISOString(),
    })
  }

  apiRequest(method: string, path: string, statusCode: number, duration: number) {
    this.info("API request completed", {
      event: "api_request",
      method,
      path,
      statusCode,
      duration,
      timestamp: new Date().toISOString(),
    })
  }
}

export const logger = new Logger()
