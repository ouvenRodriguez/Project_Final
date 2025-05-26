import axios from 'axios';
import { API_URL } from '../config.js';


export const createProject = async (body) => {
    try {
        // Transform the data to match the schema
        const projectData = {
            title: body.title,
            area: body.area,
            objectives: body.objectives,
            dateStart: body.schedule.startDate,
            dateEnd: body.schedule.endDate,
            budget: body.budget,
            institution: body.institution,
            team: body.teamMembers,
            comments: body.observations,
            status: 'Formulación' // Default status as per schema
        };

        const response = await axios.post(API_URL + "/project/create" , projectData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        }); 

        return response.data;
    } catch (error) {
        console.log('Error creating project:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al crear el proyecto'
        };
    }
}

export const getAllProjects = async () => {
    try {
        const response = await axios.get(API_URL + "/project/all", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching projects:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al obtener los proyectos'
        };
    }
}

export const getAllStudentProjects = async () => {
    try {
        const response = await axios.get(API_URL + "/project/all/student", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching student projects:', error);
        return {
            success: false,
            message: 'Error al obtener los proyectos del estudiante'
        };
    }
}

export const updateProject = async (projectId, body) => {
    try {
        const projectData = {
            title: body.title,
            area: body.area,
            objectives: body.objectives,
            dateStart: body.schedule.startDate,
            dateEnd: body.schedule.endDate,
            budget: body.budget,
            institution: body.institution,
            team: body.teamMembers,
            comments: body.observations
        };

        const response = await axios.put(API_URL + `/project/update/${projectId}`, projectData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error updating project:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al actualizar el proyecto'
        };
    }
}

export const deleteProject = async (projectId) => {
    try {
        const response = await axios.delete(API_URL + `/project/delete/${projectId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error deleting project:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al eliminar el proyecto'
        };
    }
}

export const updateStatus = async (projectId, body) => {
    try {
        const response = await axios.put(API_URL + `/project/update-status/${projectId}`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${localStorage.getItem('@token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error updating project status:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al actualizar el estado del proyecto'
        };
    }
}



