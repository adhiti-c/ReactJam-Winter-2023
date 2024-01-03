// contains player object and player logic
import React, { useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

//Player Movement
export default function Camera({ cakes }: { cakes: JSX.Element[] }) {

  const initialPos = [1, 0, 1]
  const initialCameraVector = new Vector3(initialPos[0], initialPos[1], initialPos[2]);
  const camera = useThree(state => state.camera);
  const [cameraVector, setCameraVector] = useState<Vector3>(initialCameraVector)

  useEffect(() => {
    // recalculate the vector
    // const newCamPos = new Vector3(initialPos[0], initialPos[1] + cakes.length * 0.25, initialPos[2])
    const newCamPos = new Vector3(initialPos[0], initialPos[1] + cakes.length * 0.25, initialPos[2])

    setCameraVector(newCamPos)
  }, [cakes])

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
