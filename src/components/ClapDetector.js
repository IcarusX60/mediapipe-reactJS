import React from 'react';

const ClapDetector = ({ leftWrist, rightWrist }) => {
  const calculateDistance = () => {
    if (!leftWrist || !rightWrist) {
      return 0;
    }

    // Calculate the Euclidean distance between the left and right wrists
    const dx = leftWrist.x - rightWrist.x;
    const dy = leftWrist.y - rightWrist.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance;
  };

  const distanceThreshold = 0.2; // Define the threshold for clap detection
  const distance = calculateDistance();
  const isClapDetected = distance <= distanceThreshold;

  return (
    <div>
      <p>Distance between wrists: {distance}</p>
      {isClapDetected ? <p>Clap detected!</p> : <p>No clap detected</p>}
    </div>
  );
};

export default ClapDetector;
