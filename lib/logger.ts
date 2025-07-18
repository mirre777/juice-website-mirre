export interface LogContext {
  [key: string]: any
}

export class Logger {
  static info(message: string, context?: LogContext) {
    console.log(`[INFO] ${message}`, context ? JSON.stringify(context, null, 2) : "")
  }

  static warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context ? JSON.stringify(context, null, 2) : "")
  }

  static error(message: string, context?: LogContext) {
    console.error(`[ERROR] ${message}`, context ? JSON.stringify(context, null, 2) : "")
  }

  static debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, context ? JSON.stringify(context, null, 2) : "")
    }
  }
}

export const logger = Logger
