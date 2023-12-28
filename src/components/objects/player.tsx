// contains player object and player logic
import React, { useState, KeyboardEvent, useRef } from "react";

export default function Player() {
  return (
    <PlayerMove/>
  )
}

//Player Movement
const PlayerMove: React.FC = () => {
    const [position, setPosition] = useState([0, 0, 0]);
    const moveSpeed = 0.1;
    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    const handleMove = (e: KeyboardEvent):void => {
      const newPosition = [...position];
      if (e.key === "a") {
        newPosition[0] -= moveSpeed;
        newPosition[2] += moveSpeed;
        console.log("left", e.key);
        console.log(windowSize.current[0]);
        console.log(position[0]);
      } else if (e.key === "d") {
        newPosition[0] += moveSpeed;
        newPosition[2] -= moveSpeed;
        console.log("right", e.key);
      } else if (e.key === "w") {
        newPosition[0] -= moveSpeed;
        newPosition[2] -= moveSpeed;
        console.log("up", e.key);
      } else if (e.key === "s") {
        newPosition[0] += moveSpeed;
        newPosition[2] += moveSpeed;
        console.log("down", e.key);
      }
      setPosition(newPosition);
    };
  
    // Attach keydown event listener when the component mounts
    React.useEffect(() => {
      const keydownHandler = (event: Event): void => {
        handleMove(event as unknown as KeyboardEvent<Element>);
      };
      
      document.addEventListener("keydown", keydownHandler);
      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener("keydown", keydownHandler);
      };
    }, [position]);
    

    return (
        <mesh position={[position[0], position[1], position[2]]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
    )
}