import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Utilizar las variables JWT_SECRET y JWT_EXPIRES_IN desde el archivo .env
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

// Generar un token JWT
export const generateJWT = (correo: string): string => {
    const payload = { correo };
    return jwt.sign(payload, secret as jwt.Secret, { expiresIn });
};

// Verificar un token JWT
export const verifyJWT = (token: string): any => {
    try {
        return jwt.verify(token, secret as jwt.Secret);
    } catch (err) {
        throw new Error('Token inválido');
    }
};
