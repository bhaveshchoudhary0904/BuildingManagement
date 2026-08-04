import { useState, useCallback } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (method, endpoint, payload = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (method === 'GET') {
        response = await api.get(endpoint);
      } else if (method === 'POST') {
        response = await api.post(endpoint, payload);
      } else if (method === 'PUT') {
        response = await api.put(endpoint, payload);
      } else if (method === 'DELETE') {
        response = await api.delete(endpoint);
      }
      
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, request };
};
