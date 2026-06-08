import React, { useEffect, useState } from 'react';

export default function ApiHealth() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => setStatus({ error: err.message }));
  }, []);

  if (!status) return <div>Checking AI service...</div>;
  if (status.error) return <div>Error: {status.error}</div>;

  return (
    <div className="api-health">
      <h3>AI service health</h3>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
