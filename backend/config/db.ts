import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables del archivo .env

class Database {
    static execute(query: string, arg1: any[]): [any] | PromiseLike<[any]> {
        throw new Error('Method not implemented.');
    }
    private static instance: mysql.Pool | null = null;

    // Método para obtener la instancia de la base de datos
    public static getInstance(): mysql.Pool {
        if (!Database.instance) {
            Database.instance = mysql.createPool({
                host: process.env.DB_HOST,      // localhost
                user: process.env.DB_USER,      // usuario_db
                password: process.env.DB_PASSWORD, // password_db
                database: process.env.DB_NAME,  // base_de_datos
                port: Number(process.env.DB_PORT) || 3306,
                waitForConnections: true,       // Esperar a que haya conexiones disponibles
                connectionLimit: 10,            // Límite de conexiones simultáneas
                queueLimit: 0,                  // No hay límite en la cola de conexiones
            });
        }
        return Database.instance;
    }
}

export default Database;
