import UserDAO from '../DAO/UserDAO';
import { HealthInfo, User, UserUpdate } from '../models/UserModel';
import bcrypt from 'bcrypt';

class UserService {
    // Método para registrar un nuevo usuario
    public static async registerUser(user: User, healthData: { peso: number, talla: number, estado_salud: string }): Promise<void> {
        // Verificar si el correo ya está registrado
        const userExists = await UserDAO.userExists(user.correo);
        if (userExists) {
            throw new Error('El correo ya está registrado');
        }

        // Encriptar la contraseña antes de guardarla
        user.password = await bcrypt.hash(user.password, 10);

        // Guardar el usuario en la base de datos
        await UserDAO.createUser(user);

        // Guardar la información de salud
        const healthInfo: HealthInfo = {
            id_usuario: user.id_usuario || 0, // El ID del usuario debe ser recuperado de la BD al insertar el usuario
            peso: healthData.peso,
            talla: healthData.talla,
            estado_salud: healthData.estado_salud
        };

        await UserDAO.createHealthInfo(healthInfo);
    }

    // Método para actualizar el perfil de un usuario
    public static async updateUser(user: UserUpdate, correoLogueado: string): Promise<void> {
        // Asegurarse de que el correo proporcionado en la actualización es el mismo que el del usuario autenticado
        if (user.correo !== correoLogueado) {
            throw new Error('No tiene permiso para actualizar este usuario');
        }

        // Verificar que el usuario existe
        const userExists = await UserDAO.userExists(user.correo);
        if (!userExists) {
            throw new Error('El usuario no existe');
        }

        // Actualizar el usuario en la base de datos, excluyendo la contraseña
        await UserDAO.updateUser(user); // Actualiza los datos del usuario

        // Crear un objeto de salud solo si se proporciona la información
        const healthInfo: Partial<HealthInfo> = {};
        if (user.peso !== undefined) healthInfo.peso = user.peso;
        if (user.talla !== undefined) healthInfo.talla = user.talla;
        if (user.estado_salud !== undefined) healthInfo.estado_salud = user.estado_salud;

        // Actualizar la información de salud si se proporciona
        if (Object.keys(healthInfo).length > 0) {
            // Se debe obtener el ID del usuario para actualizar la información de salud
            const userId = await UserDAO.getUserIdByEmail(correoLogueado);
            if (userId) {
                await UserDAO.updateHealthInfo({
                    id_usuario: userId,
                    ...healthInfo
                } as HealthInfo);
            } else {
                throw new Error('Usuario no encontrado');
            }
        }
    }
}

export default UserService;
