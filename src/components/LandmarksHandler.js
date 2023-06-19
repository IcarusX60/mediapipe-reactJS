import React, { useState } from 'react';
import ClapDetector from './ClapDetector';
import KneeHugs from './KneeHugs';

const LandmarksHandler = ({ landmarks }) => {
  const bodyPartMapping = {
    0: "Nose",
    1: "Left Eye (Inner)",
    2: "Left Eye",
    3: "Left Eye (Outer)",
    4: "Right Eye (Inner)",
    5: "Right Eye",
    6: "Right Eye (Outer)",
    7: "Left Ear",
    8: "Right Ear",
    9: "Mouth (Left)",
    10: "Mouth (Right)",
    11: "Left Shoulder",
    12: "Right Shoulder",
    13: "Left Elbow",
    14: "Right Elbow",
    15: "Left Wrist",
    16: "Right Wrist",
    17: "Left Pinky",
    18: "Right Pinky",
    19: "Left Index",
    20: "Right Index",
    21: "Left Thumb",
    22: "Right Thumb",
    23: "Left Hip",
    24: "Right Hip",
    25: "Left Knee",
    26: "Right Knee",
    27: "Left Ankle",
    28: "Right Ankle",
    29: "Left Heel",
    30: "Right Heel",
    31: "Left Foot Index",
    32: "Right Foot Index",
  };

  const isValidCoordinate = (coordinate) => {
    // Define the valid range for the coordinates
    const minX = 0;
    const maxX = 1;
    const minY = 0;
    const maxY = 1;

    // Check if the coordinate falls within the valid range
    return (
      coordinate.x >= minX &&
      coordinate.x <= maxX &&
      coordinate.y >= minY &&
      coordinate.y <= maxY
    );
  };

  const visibleBodyParts =
  landmarks && landmarks.length > 0
    ? landmarks[0].filter(isValidCoordinate).map((_, index) => bodyPartMapping[index])
    : [];

const [isClapDetectionEnabled, setClapDetectionEnabled] = useState(false);
const [isKneeHugsEnabled, setKneeHugsEnabled] = useState(false);

const handleClapDetectionClick = () => {
  setClapDetectionEnabled(!isClapDetectionEnabled);
};

const handleKneeHugsDetectionClick = () => {
  setKneeHugsEnabled(!isKneeHugsEnabled);
};

const leftWrist = landmarks && landmarks[0] && landmarks[0][15];
const rightWrist = landmarks && landmarks[0] && landmarks[0][16];

//const visibleBodyPartsString = visibleBodyParts.join(', ');

return (
  <div>
    <div>
      { /*visibleBodyParts.length > 0 ? (
        <p>{visibleBodyPartsString}</p>
      ) : (
        <p>No visible body parts</p>
      ) */}
      {isClapDetectionEnabled && leftWrist && rightWrist && (
        <ClapDetector leftWrist={leftWrist} rightWrist={rightWrist} />
      )}
      {isKneeHugsEnabled && landmarks && (
        <KneeHugs landmarks={landmarks} />
      )}
    </div>
    <button onClick={handleClapDetectionClick}>
      {isClapDetectionEnabled ? 'Disable Clap Detection' : 'Enable Clap Detection'}
    </button>
    <button onClick={handleKneeHugsDetectionClick}>
      {isKneeHugsEnabled ? 'Disable Knee Hugs Detection' : 'Enable Knee Hugs Detection'}
    </button>
  </div>
);
};

export default LandmarksHandler;