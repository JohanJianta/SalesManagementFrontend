import axios from 'axios';

const BASE_URL = 'http://ec2-18-139-110-33.ap-southeast-1.compute.amazonaws.com:3000';

export const getClusterById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/clusters/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cluster:', error);
    throw error;
  }
};
