/**
 * Minimal logging utility.
 *
 * We deliberately avoid a logging library (e.g. winston) at this stage to keep
 * the project simple (KISS). This wrapper gives us consistent, timestamped log
 * lines and a single place to upgrade logging later if needed.
 */
type Level = 'info' | 'warn' | 'error';

function write(level: Level, message: string, meta?: unknown): void {
  const time = new Date().toISOString();
  const line = `[${time}] ${level.toUpperCase()} ${message}`;
  if (meta !== undefined) {
    console[level](line, meta);
  } else {
    console[level](line);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => write('info', message, meta),
  warn: (message: string, meta?: unknown) => write('warn', message, meta),
  error: (message: string, meta?: unknown) => write('error', message, meta),
};
