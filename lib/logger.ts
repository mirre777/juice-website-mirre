interface LogContext {
  [key: string]: any
}

class Logger {
  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : ""
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
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
}

export const logger = new Logger()
