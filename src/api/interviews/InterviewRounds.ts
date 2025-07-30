import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

// GET /api/interview-rounds/{id}
export const fetchInterviewRound = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/interview-rounds/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /api/interview-rounds/{id}
export const updateInterviewRound = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/interview-rounds/${id}`, reqData, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/interview-rounds/{id}
export const deleteInterviewRound = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/interview-rounds/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/interview-rounds
export const fetchAllInterviewRounds = async () => {
  try {
    const response = await axios.get(`${API_URL}api/interview-rounds`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/interview-rounds
export const createInterviewRound = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/interview-rounds`, reqData, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/interview-rounds/contact/{contactId}
export const fetchInterviewRoundsByContact = async (contactId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/interview-rounds/contact/${contactId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/interview-rounds/contact/{contactId}/job/{jobId}
export const fetchInterviewRoundsByContactAndJob = async (contactId: number, jobId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/interview-rounds/contact/${contactId}/job/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};