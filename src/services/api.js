import axios from 'axios';

const BASE_URL = 'http://add-yor-server-url/';

export const getMemberPatients = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/members?patients=true`,
    );
    return response.data;
  } catch (error) {
    throw new Error('Error fetching member patients:', error);
  }
};

export const getMemberDoctors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/members?doctors=true`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching member doctors:', error);
  }
};

export const getOpportunity = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/opportunities/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error opportunities', error);
  }
};

export const createOpportunities = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/opportunities`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error creating opportunities', error);
  }
};

export const updateOpportunity = async (data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/opportunities/${data.id}`,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error('Error creating opportunities', error);
  }
};

export const createMember = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/members`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error creating opportunities', error);
  }
};

export const searchOpportunity = async (data) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/v1/patients?query=${data}`,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error('Error creating opportunities', error);
  }
};
