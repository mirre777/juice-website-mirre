interface LogLevel {
  INFO: "info"
  WARN: "warn"
  ERROR: "error"
  DEBUG: "debug"
}

const LOG_LEVELS: LogLevel = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  DEBUG: "debug",
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`

    if (data) {
      return `${baseMessage} ${JSON.stringify(data, null, 2)}`
    }

    return baseMessage
  }

  info(message: string, data?: any): void {
    const formattedMessage = this.formatMessage(LOG_LEVELS.INFO, message, data)
    console.log(formattedMessage)
  }

  warn(message: string, data?: any): void {
    const formattedMessage = this.formatMessage(LOG_LEVELS.WARN, message, data)
    console.warn(formattedMessage)
  }

  error(message: string, error?: any): void {
    const formattedMessage = this.formatMessage(LOG_LEVELS.ERROR, message, error)
    console.error(formattedMessage)

    // In production, you might want to send errors to a logging service
    if (!this.isDevelopment) {
      // Send to logging service (e.g., Sentry, LogRocket, etc.)
    }
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(LOG_LEVELS.DEBUG, message, data)
      console.debug(formattedMessage)
    }
  }
}

export const logger = new Logger()
