import axios from 'axios';
import { API_URL } from '../config.js';


export const register = async (body) => {
    try {
        const response = await axios.post(API_URL + "/user/register", body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        
        console.log('Error fetching user:', error);
        return{
            success: false,
            message: 'Error al interntar registarse'
        };
    }
}

export const login = async (body) => {
    try {
        const response = await axios.post(API_URL + "/user/login", body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching user:', error);
        return{
            success: false,
            message: 'Error al interntar iniciar sesion'
        };
    }
}

export const createDocente = async (body) => {
    try {
        const response = await axios.post(API_URL + "/user/create-professor", body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching user:', error);
        return{
            success: false,
            message: 'Error al crear docente'
        };
    }
}

export const getAllProfessors = async () => {
    try {
        const response = await axios.get(API_URL + "/user/all/professors", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });

        // Hacer la petición con el token
        return response.data;
    } catch (error) {
        console.log('Error fetching professors:', error);
        return {
            success: false,
            message: 'Error al obtener los docentes'
        };
    }
}

export const createEstudiante = async (body) => {
    try {
        const response = await axios.post(API_URL + "/user/create-student", body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });

        // Hacer la petición con el token
        return response.data;
    } catch (error) {
        console.log('Error fetching user:', error);
        return{
            success: false,
            message: 'Error al crear estudiante'
        };
    }
}

export const getAllStudents = async () => {
    try {
        const response = await axios.get(API_URL + "/user/all/students", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });

        // Hacer la petición con el token
        return response.data;   
    } catch (error) {
        console.log('Error fetching students:', error);
        return {
            success: false,
            message: 'Error al obtener los estudiantes'
        };
    }
}

export const updateUser = async (userId, body) => {
    try {
        const response = await axios.put(API_URL + `/user/update/${userId}`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching user:', error);
        return{
            success: false,
            message: 'Error al actualizar el docente'
        };
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(API_URL + `/user/delete/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching user:', error);
        return{
            success: false, 
            message: 'Error al eliminar el docente'
        };
    }
}








