// contains player object and player logic
import React, { useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

export function calculateCurrentCameraY(yPos: number): number {
  const yPosDivisionFactor = 1.5; // use this for general gameplay
  // const yPosDivisionFactor = 5; // use this to confirm cake asset positioning
  return -1 * yPos / yPosDivisionFactor
}

export default function Camera({ yPos }: { yPos: number | undefined }) {
  // change this to affect the camera's zoom
  // larger is more zoomed out
  const zoomFactor = 3;

  const initialXandZ = 1;
  const initialPos = [initialXandZ + zoomFactor, 0, initialXandZ + zoomFactor]
  const initialCameraVector = new Vector3(initialPos[0], initialPos[1], initialPos[2]);
  const camera = useThree(state => state.camera);
  const [cameraVector, setCameraVector] = useState<Vector3>(initialCameraVector)


  useEffect(() => {
    let newCamPos: Vector3;
    if (yPos === undefined) {
      // initial position of 0
      newCamPos = new Vector3(initialPos[0], initialPos[1], initialPos[2]);
    } else {
      // recalculate the vector

      const newXandZ = initialXandZ + zoomFactor
      newCamPos = new Vector3(newXandZ, calculateCurrentCameraY(yPos), newXandZ)
    }

    setCameraVector(newCamPos)
  }, [yPos]);

  useFrame(() => {
    // move camera to right position
    // camera.position.set(initialCameraPosition[0], initialCameraPosition[1] + cakes.length, initialCameraPosition[2])
    // camera.position.x = initialCameraPosition[0];
    // camera.position.y = initialCameraPosition[1] + (cakes.length * 0.1);
    // camera.position.z = initialCameraPosition[2];
    camera.position.lerp(cameraVector, 0.025);
    camera.rotation.set(0, 0.8, 0)
  });

  return (
    <mesh />
  )
}
