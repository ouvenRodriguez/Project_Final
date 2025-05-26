import axios from 'axios';
import { API_URL } from '../config.js';


export const createProjectAdvance = async (projectId, body) => {
    try {
        const formData = new FormData();
        formData.append('date', body.date);
        formData.append('description', body.description);
        
        // Append each document file
        if (body.documents && body.documents.length > 0) {
            body.documents.forEach((doc, index) => {
                formData.append('documents', doc);
            });
        }
        
        // Append each photo file
        if (body.photos && body.photos.length > 0) {
            body.photos.forEach((photo, index) => {
                formData.append('photos', photo);
            });
        }

        const response = await axios.post(API_URL + `/milestone/${projectId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error creating project advance:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al crear el avance del proyecto'
        };
    }
}

export const getProjectAdvances = async (projectId) => {
    try {
        const response = await axios.get(API_URL + `/milestone/${projectId}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching project advances:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al obtener los avances del proyecto'
        };
    }
}

export const updateProjectAdvance = async (projectId, advanceId, body) => {
    try {
        const advanceData = {
            date: body.date,
            description: body.description,
            documents: body.documents || [],
            photos: body.photos || []
        };

        const response = await axios.put(API_URL + `/milestone/${projectId}/advance/${advanceId}`, advanceData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error updating project advance:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al actualizar el avance del proyecto'
        };
    }
}

export const deleteProjectAdvance = async (projectId, advanceId) => {
    try {
        const response = await axios.delete(API_URL + `/milestone/${projectId}/advance/${advanceId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error deleting project advance:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al eliminar el avance del proyecto'
        };
    }
}

