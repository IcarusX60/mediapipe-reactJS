import React, { useEffect, useRef, useState } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
import LandmarksHandler from './LandmarksHandler';

const WebcamFeed = () => {
  const videoRef = useRef(null);
  const canvasElementRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  let runningMode = 'VIDEO';
  let webcamRunning = false;
  let lastVideoTime = -1;
  const [landmarks, setLandmarks] = useState([]);
  const [isPredictionEnabled, setPredictionEnabled] = useState(false);

  const enableCam = () => {
    if (!poseLandmarkerRef.current) {
      console.log('Wait! poseLandmarker not loaded yet.');
      return;
    }

    if (webcamRunning === true) {
      webcamRunning = false;
      setPredictionEnabled(false); // Disable predictions
    } else {
      webcamRunning = true;
      setPredictionEnabled(true); // Enable predictions
    }

    const constraints = { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', predictWebcam);
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });
  };

  const predictWebcam = () => {
    if (runningMode === 'IMAGE') {
      runningMode = 'VIDEO';
      poseLandmarkerRef.current.setOptions({ runningMode: 'VIDEO' });
    }

    const startTimeMs = performance.now();
    if (lastVideoTime !== videoRef.current.currentTime) {
      lastVideoTime = videoRef.current.currentTime;
      poseLandmarkerRef.current.detectForVideo(
        videoRef.current,
        startTimeMs,
        (result) => {
          const canvasCtx = canvasElementRef.current.getContext('2d');
          const drawingUtils = new DrawingUtils(canvasCtx);

          const { videoWidth, videoHeight } = videoRef.current;
          canvasElementRef.current.width = videoWidth;
          canvasElementRef.current.height = videoHeight;

          canvasCtx.save();
          canvasCtx.clearRect(0, 0, videoWidth, videoHeight);

          setLandmarks(result.landmarks);
          console.log(result.landmarks); // Debug statement
          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) =>
                DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(
              landmark,
              PoseLandmarker.POSE_CONNECTIONS
            );
          }
          canvasCtx.restore();
        }
      );
    }

    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  useEffect(() => {
    const createPoseLandmarker = async () => {
      console.log('Creating PoseLandmarker...');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      );
      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task',
            delegate: 'GPU',
          },
          runningMode: runningMode,
          numPoses: 4,
          minPoseDetectionConfidence: 0.4,
        }
      );
      console.log('PoseLandmarker created successfully!');
    };
    createPoseLandmarker();
  }, [runningMode]);

  return (
    <div style={{ position: 'relative' }}>
      <video id="webcam" ref={videoRef} autoPlay controls></video>
      <canvas
        id="output_canvas"
        ref={canvasElementRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
      ></canvas>
          <button id="webcamButton" onClick={enableCam}>
            {isPredictionEnabled ? 'Disable Predictions' : 'Enable Predictions'}
          </button>
      <LandmarksHandler landmarks={landmarks} />

    </div>
  );
};

export default WebcamFeed;
