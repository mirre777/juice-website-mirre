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
  private isLoggingDisabled = process.env.DISABLE_FIREBASE_LOGGING === "true"

  private formatMessage(level: string, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString()
    const logData = data ? ` | ${JSON.stringify(data)}` : ""
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${logData}`
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
    // Skip Google logging utilities entirely
    if (this.isLoggingDisabled) {
      const simpleLog = `[${logEntry.timestamp}] ${logEntry.level.toUpperCase()}: ${logEntry.message}`

      switch (logEntry.level) {
        case "error":
          console.error(simpleLog, logEntry.context || "")
          break
        case "warn":
          console.warn(simpleLog, logEntry.context || "")
          break
        case "debug":
          if (this.isDevelopment) {
            console.debug(simpleLog, logEntry.context || "")
          }
          break
        default:
          console.log(simpleLog, logEntry.context || "")
      }
      return
    }

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

  info(message: string, data?: LogData): void {
    if (this.isLoggingDisabled) {
      console.log(this.formatMessage("info", message, data))
      return
    }
    console.log(this.formatMessage("info", message, data))
  }

  warn(message: string, data?: LogData): void {
    if (this.isLoggingDisabled) {
      console.warn(this.formatMessage("warn", message, data))
      return
    }
    console.warn(this.formatMessage("warn", message, data))
  }

  error(message: string, data?: LogData): void {
    if (this.isLoggingDisabled) {
      console.error(this.formatMessage("error", message, data))
      return
    }
    console.error(this.formatMessage("error", message, data))
  }

  debug(message: string, data?: LogData): void {
    if (process.env.NODE_ENV === "development") {
      if (this.isLoggingDisabled) {
        console.debug(this.formatMessage("debug", message, data))
        return
      }
      console.debug(this.formatMessage("debug", message, data))
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

  // Firebase-specific logging methods
  firebaseError(operation: string, error: any, context?: LogData) {
    this.error(`Firebase ${operation} failed`, {
      event: "firebase_error",
      operation,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
      timestamp: new Date().toISOString(),
    })
  }

  configurationError(service: string, missing: string[], context?: LogData) {
    this.error(`${service} configuration error`, {
      event: "configuration_error",
      service,
      missing,
      ...context,
      timestamp: new Date().toISOString(),
    })
  }

  apiError(endpoint: string, statusCode: number, error: any, requestId?: string) {
    this.error(`API endpoint error: ${endpoint}`, {
      event: "api_error",
      endpoint,
      statusCode,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      requestId,
      timestamp: new Date().toISOString(),
    })
  }
}

export const logger = new Logger()
