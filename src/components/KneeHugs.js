import React, { useState, useEffect } from 'react';

const KneeHugs = ({ landmarks }) => {
  const isValidCoordinate = (coordinate) => {
    // Define the valid range for the coordinates
    const minX = 0;
    const maxX = 1;
    const minY = 0;
    const maxY = 1;

    // Check if the coordinate falls within the valid range
    return (
      coordinate &&
      coordinate.x >= minX &&
      coordinate.x <= maxX &&
      coordinate.y >= minY &&
      coordinate.y <= maxY
    );
  };

  const leftKnee = landmarks && landmarks[0]?.[25];
  const rightKnee = landmarks && landmarks[0]?.[26];
  const chest = landmarks && landmarks[0]?.[11];

  const areKneesVisible = isValidCoordinate(leftKnee) && isValidCoordinate(rightKnee);

  const [startExercise, setStartExercise] = useState(false);
  const [finalDistance, setFinalDistance] = useState(null);
  const [prevFinalDistance, setPrevFinalDistance] = useState(null);
  const [counter, setCounter] = useState(0);

  const calculateDistance = () => {
    if (isValidCoordinate(leftKnee) && isValidCoordinate(rightKnee) && isValidCoordinate(chest)) {
      const distanceXLeft = Math.abs(leftKnee.x - chest.x);
      const distanceYLeft = Math.abs(leftKnee.y - chest.y);
      const distanceLeft = Math.sqrt(distanceXLeft ** 2 + distanceYLeft ** 2);

      const distanceXRight = Math.abs(rightKnee.x - chest.x);
      const distanceYRight = Math.abs(rightKnee.y - chest.y);
      const distanceRight = Math.sqrt(distanceXRight ** 2 + distanceYRight ** 2);

      const minDistance = Math.min(distanceLeft, distanceRight);
      setFinalDistance(minDistance.toFixed(2));
    }
  };

  useEffect(() => {
    if (!startExercise) {
      return;
    }

    calculateDistance();

    if (prevFinalDistance !== null && finalDistance !== null && finalDistance < 0.2 && prevFinalDistance >= 0.2) {
      setCounter((prevCount) => prevCount + 1);
    }

    setPrevFinalDistance(finalDistance);
  }, [startExercise, leftKnee, rightKnee, chest, prevFinalDistance, finalDistance]);

  const handleStartExercise = () => {
    setStartExercise(true);
  };

  return (
    <div>
      {areKneesVisible ? (
        <div>
          <p>Knees are visible</p>
          {!startExercise && (
            <button onClick={handleStartExercise}>Start Knee Hugs Exercise</button>
          )}
          {startExercise && (
            <div>
              <p>Knee hugs exercise started!</p>
              <p>Distance between left knee and chest: {finalDistance || 'N/A'} units</p>
              <p>Number of times distance below 0.2: {counter}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Knees are not visible</p>
      )}
     </div>
  );
};

export default KneeHugs;