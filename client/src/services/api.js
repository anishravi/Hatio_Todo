import axios from "axios";

const API_URL = "/api";
const token = localStorage.getItem("token");

export const getProjects = async () => {
    const response = await axios.get(`${API_URL}/projects`, {
        headers: {
          token: token,
        },
      })
      .then((response) => response.data)
      .catch((error) => console.log(error));
    return response;
};

export const fetchProjectById = async (projectId) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}`, {
      headers: {
        token: token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.log(error));
  return response;
};

export const createProject = async (project) => {
  try {
    const response = await axios.post(`${API_URL}/projects`, project, {
      headers: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const editProjectDetails = async (projectId,projectdetail) => {
  try {
    const response = await axios.put(`${API_URL}/projects/${projectId}`, projectdetail, {
      headers: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const getTasks = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`,{
      headers: {
        token: token,
      }});
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error);
    throw error;
  }
};
export const getTaskById = async (taskId,projectId) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}/tasks/${taskId}`,{
      headers: {
        token: token,
      }});
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error);
    throw error;
  }
};

export const createTask = async (projectId, task) => {
  try {
    const response = await axios.post(
      `${API_URL}/projects/${projectId}/tasks`,
      task,
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating task for project ${projectId}:`, error);
    throw error;
  }
};

export const editTask = async (taskId,taskdetail,projectId) => {
  try {
      const response = await axios.patch(`${API_URL}/projects/${projectId}/tasks/${taskId}`,taskdetail,{
        headers: {
            token: token,
        },
      });
      return response.data;
  } catch (error) {
      throw new Error(`Error editing task: ${error.message}`);
  }
};

export const deleteTask = async (taskId,projectId) => {
  try {
      const response = await axios.delete(`${API_URL}/projects/${projectId}/tasks/${taskId}`,
        {
          headers: {
              token: token,
          },
        }
      );
      return response.data;
  } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
  }
};