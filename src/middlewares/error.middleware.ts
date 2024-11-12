import { Request, Response, NextFunction } from 'express';

// Middleware untuk menangani error 404 (Not Found)
export function errorNotFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    message: 'Resource not found',
  });
}

// Middleware untuk menangani error server secara umum
export function errorServerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);  // Log error di console untuk debugging

  // Jika ada error yang lebih spesifik
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    // Anda bisa menambahkan detail lebih lanjut untuk keperluan development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
