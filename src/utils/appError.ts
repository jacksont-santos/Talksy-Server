export class AppError {
    public readonly statusCode: number;
    public readonly message: string | string[];
  
    constructor(statusCode: number, message?: string | string[],) {
      this.statusCode = statusCode;
      this.message = message;
    }
  }