// AuthService.ts
import UserDAO from '../DAO/UserDAO';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from '../models/UserModel';
import { generateJWT, verifyJWT } from '../utils/jwtHelper'; // Importar desde jwtHelper

class AuthService {
    // Método para validar las credenciales del usuario (inicio de sesión tradicional)
    public static async authenticateUser(correo: string, password: string): Promise<string> {
        const user = await UserDAO.getUserByEmail(correo);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Credenciales incorrectas');
        }

        return generateJWT(user.correo); // Usar la función centralizada
    }

    // Métodos para iniciar sesión con redes sociales (Google, Facebook, Instagram)
    public static async loginWithGoogle(token: string): Promise<string> {
        const userInfo = await this.getGoogleUserInfo(token);
        return this.socialAuthLogin(userInfo);
    }

    public static async loginWithFacebook(token: string): Promise<string> {
        const userInfo = await this.getFacebookUserInfo(token);
        return this.socialAuthLogin(userInfo);
    }

    public static async loginWithInstagram(token: string): Promise<string> {
        const userInfo = await this.getInstagramUserInfo(token);
        return this.socialAuthLogin(userInfo);
    }

    private static async socialAuthLogin(userInfo: { correo: string, nombre: string }): Promise<string> {
        let user = await UserDAO.getUserByEmail(userInfo.correo);
        if (!user) {
            // Crear un nuevo usuario si no existe, sin número de documento
            user = {
                nombre: userInfo.nombre,
                correo: userInfo.correo,
                password: '', // Sin contraseña para usuarios de redes sociales
                rol: 'usuario',
                autenticacion_social: true,
            };
            await UserDAO.createUser(user);
        }

        return generateJWT(user.correo); // Usar la función centralizada
    }

    public static verifyJWT(token: string): any {
        return verifyJWT(token); // Usar la función centralizada
    }

    // Métodos auxiliares para obtener información de las redes sociales
    private static async getGoogleUserInfo(token: string): Promise<{ correo: string, nombre: string }> {
        const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;
        const response = await axios.get(url);
        const { email, name } = response.data;
        return { correo: email, nombre: name };
    }

    private static async getFacebookUserInfo(token: string): Promise<{ correo: string, nombre: string }> {
        const url = `https://graph.facebook.com/me?fields=email,name&access_token=${token}`;
        const response = await axios.get(url);
        const { email, name } = response.data;
        return { correo: email, nombre: name };
    }

    private static async getInstagramUserInfo(token: string): Promise<{ correo: string, nombre: string }> {
        const url = `https://graph.instagram.com/me?fields=id,username&access_token=${token}`;
        const response = await axios.get(url);
        const { username } = response.data;
        return { correo: `${username}@instagram.com`, nombre: username };
    }
}

export default AuthService;
