import { useState, useEffect } from 'react';
import api from '../services/api';

export function useProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/proposals')
      .then(res => setProposals(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { proposals, loading, error };
}
