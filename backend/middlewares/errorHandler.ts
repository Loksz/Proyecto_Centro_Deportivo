import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log del error

    const statusCode = err.statusCode || 500; // Código de estado por defecto 500
    const message = err.message || 'Error interno del servidor'; // Mensaje de error por defecto

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

export default errorHandler;
