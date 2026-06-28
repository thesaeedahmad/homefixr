/**
 * AppError — an error that carries an HTTP status code.
 *
 * The service layer throws these (e.g. new AppError(409, '...')) to express
 * business outcomes WITHOUT importing anything from Express. The central error
 * handler reads `status` and produces the response. This keeps business logic
 * independent of the web framework (Clean Architecture / SOLID).
 */
export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}
