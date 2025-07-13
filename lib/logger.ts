type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    this.logs.push(entry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output with appropriate method
    const consoleMethod = level === "error" ? "error" : level === "warn" ? "warn" : level === "debug" ? "debug" : "log"

    if (data) {
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data)
    } else {
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`)
    }
  }

  info(message: string, data?: any) {
    this.log("info", message, data)
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data)
  }

  error(message: string, data?: any) {
    this.log("error", message, data)
  }

  debug(message: string, data?: any) {
    this.log("debug", message, data)
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level)
    }
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()
