// A simple logger utility that can be expanded later

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogContext {
  [key: string]: any
}

class Logger {
  private logToConsole(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const contextString = context ? JSON.stringify(context) : ""

    // In production, you might want to use a proper logging service
    console[level](`[${timestamp}] [${level.toUpperCase()}] ${message} ${contextString}`)
  }

  debug(message: string, context?: LogContext) {
    this.logToConsole("debug", message, context)
  }

  info(message: string, context?: LogContext) {
    this.logToConsole("info", message, context)
  }

  warn(message: string, context?: LogContext) {
    this.logToConsole("warn", message, context)
  }

  error(message: string, context?: LogContext) {
    this.logToConsole("error", message, context)
  }
}

export const logger = new Logger()
