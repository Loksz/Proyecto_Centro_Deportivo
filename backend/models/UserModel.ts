// Interfaz para representar un usuario en el sistema
export interface User {
    id_usuario?: number;                                // ID del usuario
    nombre: string;                                    // Nombre del usuario
    correo: string;                                    // Correo electrónico del usuario (debe ser único)
    password: string;                                  // Contraseña del usuario (debe ser un hash en producción)
    num_documento?: string;                            // Número de documento de identificación del usuario (opcional, solo para instructores)
    rol?: 'usuario' | 'admin' | 'instructor';         // Rol del usuario (opcional, por defecto es 'usuario')
    autenticacion_social?: boolean;                   // Indica si el usuario se registró mediante autenticación social (por defecto es false)
    fecha_registro?: Date;                             // Fecha de registro del usuario (opcional, por defecto es 'null')
}

// Interfaz para la información de salud
export interface HealthInfo {
    id_salud?: number;                                 // ID de la información de salud (opcional para las operaciones de creación)
    id_usuario?: number;                                // ID del usuario al que pertenece la información de salud
    peso?: number;                                      // Peso del usuario (obligatorio)
    talla?: number;                                     // Talla del usuario (obligatorio)
    estado_salud?: string;                              // Estado de salud del usuario (obligatorio)
}

// Nuevo tipo para actualización
export interface UserUpdate {
    id_usuario?: number;                               // ID del usuario (opcional para las operaciones de actualización)
    nombre?: string;                                   // Nombre del usuario (opcional para actualización)
    correo: string;                                    // Correo electrónico del usuario (debe ser único)
    autenticacion_social?: boolean;                    // Indica si el usuario se registró mediante autenticación social (por defecto es false)
    peso: number;                                      // Peso del usuario (obligatorio)
    talla: number;                                     // Talla del usuario (obligatorio)
    estado_salud: string;                              // Estado de salud del usuario (obligatorio)
}

// Nueva interfaz que combina User y HealthInfo
export interface UserWithHealthInfo extends User {
    peso: number;                                      // Peso del usuario (obligatorio)
    talla: number;                                     // Talla del usuario (obligatorio)
    estado_salud: string;                              // Estado de salud del usuario (obligatorio)
}

// Clase que representa el modelo de Usuario
class UserModel {
    constructor(public user: User, public healthInfo?: HealthInfo) {
        // Se pueden agregar inicializaciones adicionales si es necesario
    }

    // Método para retornar el objeto usuario como un JSON
    public toJSON() {
        return {
            id_usuario: this.user.id_usuario,                     // ID del usuario
            nombre: this.user.nombre,                              // Nombre del usuario
            correo: this.user.correo,                              // Correo electrónico del usuario
            password: this.user.password,                          // Incluir la contraseña (encriptada)
            num_documento: this.user.num_documento,              // Número de documento del usuario
            rol: this.user.rol || 'usuario',                      // Rol del usuario (por defecto es 'usuario')
            autenticacion_social: this.user.autenticacion_social || false, // Indica si se registró mediante autenticación social (por defecto es false)
            fecha_registro: this.user.fecha_registro,             // Fecha de registro del usuario
            healthInfo: this.healthInfo ? {
                id_salud: this.healthInfo.id_salud,
                peso: this.healthInfo.peso,
                talla: this.healthInfo.talla,
                estado_salud: this.healthInfo.estado_salud
            } : undefined // Información de salud si existe
        };
    }
}

// Exporta la clase UserModel para su uso en otras partes de la aplicación
export default UserModel;
