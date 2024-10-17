import { User, HealthInfo, UserUpdate } from '../models/UserModel';
import db from '../config/db'; // Suponiendo que tienes una conexión a la base de datos configurada

class UserDAO {
    // Método para verificar si un usuario existe por correo
    public static async userExists(correo: string): Promise<boolean> {
        const query = 'SELECT COUNT(*) AS count FROM users WHERE correo = ?';
        const [rows] = await db.execute(query, [correo]);
        return rows[0].count > 0; // Devuelve true si hay al menos un usuario con ese correo
    }


    // Método para obtener un usuario por correo (NUEVO MÉTODO)
    public static async getUserByEmail(correo: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE correo = ?';
        const [rows] = await db.execute(query, [correo]);

        if (rows.length > 0) {
            const user: User = {
                id_usuario: rows[0].id_usuario,
                nombre: rows[0].nombre,
                correo: rows[0].correo,
                password: rows[0].password,
                num_documento: rows[0].num_documento,
                rol: rows[0].rol,
                autenticacion_social: rows[0].autenticacion_social,
            };
            return user;
        }

        return null; // Devuelve null si no se encuentra el usuario
    }

    // Método para crear un nuevo usuario
    public static async createUser(user: User): Promise<void> {
        const query = 'INSERT INTO users (nombre, correo, password, num_documento, rol, autenticacion_social) VALUES (?, ?, ?, ?, ?, ?)';
        await db.execute(query, [
            user.nombre,
            user.correo,
            user.password,
            user.num_documento,
            user.rol || 'usuario', // Rol por defecto
            user.autenticacion_social || false // Por defecto es false
        ]);
    }

    // Método para crear información de salud para un usuario
    public static async createHealthInfo(healthInfo: HealthInfo): Promise<void> {
        const query = 'INSERT INTO health_info (id_usuario, peso, talla, estado_salud) VALUES (?, ?, ?, ?)';
        await db.execute(query, [
            healthInfo.id_usuario,
            healthInfo.peso,
            healthInfo.talla,
            healthInfo.estado_salud
        ]);
    }

    // Método para obtener el ID del usuario por correo
    public static async getUserIdByEmail(correo: string): Promise<number | null> {
        const query = 'SELECT id_usuario FROM users WHERE correo = ?';
        const [rows] = await db.execute(query, [correo]);
        return rows.length > 0 ? rows[0].id_usuario : null; // Devuelve el ID del usuario o null si no se encuentra
    }

    // Método para actualizar un usuario
    public static async updateUser(user: UserUpdate): Promise<void> {
        const updates: string[] = [];
        const params: any[] = [];

        if (user.nombre !== undefined) {
            updates.push('nombre = ?');
            params.push(user.nombre);
        }
        if (user.correo !== undefined) {
            updates.push('correo = ?');
            params.push(user.correo);
        }
        if (user.autenticacion_social !== undefined) {
            updates.push('autenticacion_social = ?');
            params.push(user.autenticacion_social);
        }

        params.push(user.correo); // Correo original para la cláusula WHERE

        const query = `UPDATE users SET ${updates.join(', ')} WHERE correo = ?`;
        await db.execute(query, params);
    }

    // Método para actualizar la información de salud
    public static async updateHealthInfo(healthInfo: HealthInfo): Promise<void> {
        const updates: string[] = [];
        const params: any[] = [];

        if (healthInfo.peso !== undefined) {
            updates.push('peso = ?');
            params.push(healthInfo.peso);
        }
        if (healthInfo.talla !== undefined) {
            updates.push('talla = ?');
            params.push(healthInfo.talla);
        }
        if (healthInfo.estado_salud !== undefined) {
            updates.push('estado_salud = ?');
            params.push(healthInfo.estado_salud);
        }

        // Asegurarse de que el id_usuario esté presente para la actualización
        if (healthInfo.id_usuario !== undefined) {
            const query = `UPDATE health_info SET ${updates.join(', ')} WHERE id_usuario = ?`;
            params.push(healthInfo.id_usuario); // Agregar id_usuario al final
            await db.execute(query, params);
        }
    }
}

export default UserDAO;
