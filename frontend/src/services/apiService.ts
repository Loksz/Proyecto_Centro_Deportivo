import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Asegúrate de que este es el puerto correcto de tu backend

export const fetchData = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/data`); // Reemplaza con la ruta de tu API
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Manejo de errores
    }
};
