import axios from '../plugin/axios';

// Project interfaces
interface Project {
  id: number;
  name: string;
  image: string;
  amount: string;
  duration: string;
  about: string;
  duration_start: string;
  duration_end: string;
}

// Create project interface
interface CreateProjectData {
  projectName: string;
  projectAmount: string;
  startDate: string;
  endDate: string;
  aboutProject: string;
  employees?: Array<{
    lastName: string;
    firstName: string;
    middleInitial: string;
    designation: string;
  }>;
}

// API response interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getAllProjects = (): Promise<Project[]> => {
  const token = localStorage.getItem('eprojex_auth_token');
  
  if (!token) {
    return Promise.reject(new Error('Authentication token not found'));
  }
  
  return new Promise((resolve, reject) => {
    axios.get('project/all/')
      .then((response) => {
        // First, log the response to see its structure
        console.log('API Response:', response.data);
        
        // Case 1: If the API returns { success: true, data: [...] } structure
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
          if (response.data.success) {
            resolve(response.data.data);
          } else {
            reject(new Error(response.data.message || 'Failed to fetch projects'));
          }
        } 
        // Case 2: If the API directly returns the array of projects
        else if (Array.isArray(response.data)) {
          resolve(response.data);
        }
        // Case 3: If the API has a different structure
        else if (response.data && typeof response.data === 'object') {
          // Check common alternative properties
          if (Array.isArray(response.data.results)) {
            resolve(response.data.results);
          } else if (Array.isArray(response.data.projects)) {
            resolve(response.data.projects);
          } else {
            // If we can't find the data, reject with a helpful error
            console.error('Unexpected API response structure:', response.data);
            reject(new Error('Unexpected API response structure'));
          }
        } else {
          reject(new Error('Invalid response format'));
        }
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        reject(error);
      });
  });
};

/**
 * Creates a new project
 * @param projectData The project data to create
 * @returns Promise with the created project
 */
export const createProject = (projectData: CreateProjectData): Promise<Project> => {
  const token = localStorage.getItem('eprojex_auth_token');
  
  if (!token) {
    return Promise.reject(new Error('Authentication token not found'));
  }
  
  // Transform the data to match the required JSON structure
  const transformedData = {
    name: projectData.projectName,
    amount: projectData.projectAmount,
    duration_start: projectData.startDate,
    duration_end: projectData.endDate,
    about: projectData.aboutProject,
    employee: projectData.employees || []
  };
  
  return new Promise((resolve, reject) => {
    axios.post('project/all/', transformedData)
      .then((response) => {
        // Log the response for debugging
        console.log('Create Project Response:', response.data);
        
        // SUCCESS: If we get here with a 2xx status code, consider it a success
        // regardless of the response structure
        
        // Case 1: If API returns { success: true, data: {...} } format
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
          if (response.data.success) {
            resolve(response.data.data);
          } else {
            reject(new Error(response.data.message || 'Failed to create project'));
          }
        }
        // Case 2: If API directly returns the created project object
        else if (response.data && typeof response.data === 'object') {
          resolve(response.data);
        }
        // Case 3: If API returns some other success indication
        else {
          // Just resolve with whatever we got since we received a 2xx status
          resolve(response.data || { success: true });
        }
      })
      .catch((error) => {
        console.error('Error creating project:', error);
        reject(error);
      });
  });
};
/**
 * Deletes a project by ID
 * @param projectId The ID of the project to delete
 * @returns Promise with the deletion result
 */
export const deleteProject = (projectId: number): Promise<any> => {
  const token = localStorage.getItem('eprojex_auth_token');
  
  if (!token) {
    return Promise.reject(new Error('Authentication token not found'));
  }
  
  return new Promise((resolve, reject) => {
    axios.delete(`project/all/${projectId}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then((response) => {
      if (response.data.success) {
        resolve(response.data.data);
      } else {
        reject(new Error(response.data.message || 'Failed to delete project'));
      }
    })
    .catch((error) => {
      console.error('Error deleting project:', error);
      reject(error);
    });
  });
};