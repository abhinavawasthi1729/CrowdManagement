import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrafficControl = ({ routeCount }) => {
  const [trafficState, setTrafficState] = useState(
    Array(routeCount).fill(false)
  );
  const [loading, setLoading] = useState(true);

  // Fetch current traffic data on mount
  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/traffic');
        const stateArray = Array(routeCount).fill(false);

        res.data.forEach(({ routeId, congested }) => {
          const id = parseInt(routeId);
          if (!isNaN(id) && id < routeCount) {
            stateArray[id] = congested;
          }
        });

        setTrafficState(stateArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching traffic data:', err);
      }
    };

    fetchTrafficData();
  }, [routeCount]);

  const handleToggle = async (index) => {
    const updated = [...trafficState];
    updated[index] = !updated[index];
    setTrafficState(updated);

    await axios.post('http://localhost:5000/api/traffic/', {
      routeId: index.toString(),
      congested: updated[index],
      delay: updated[index] ? '5 mins' : '0',
    });
  };

  if (loading) return <p>Loading traffic data...</p>;

  return (
    <div style={{ margin: '1rem', textAlign: 'center' }}>
      <h3>Simulate Traffic</h3>
      {Array(routeCount)
        .fill(null)
        .map((_, index) => (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            <button onClick={() => handleToggle(index)}>
              {trafficState[index]
                ? `Remove Congestion from Route ${index}`
                : `Add Congestion to Route ${index}`}
            </button>
          </div>
        ))}
    </div>
  );
};

export default TrafficControl;