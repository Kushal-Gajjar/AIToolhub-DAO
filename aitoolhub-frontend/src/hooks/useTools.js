import { useState, useEffect } from 'react';
import api from '../services/api';

export function useTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tools')
      .then(res => setTools(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { tools, loading };
}
