// contains player object and player logic
import React, { useState, KeyboardEvent } from "react";

export default function Player() {
  return (
    <PlayerMove/>
  )
}

//Player Movement
function PlayerMove() {
    const [position, setPosition] = useState([0, 0, 0]);
    const moveSpeed = 0.1;

    const handleMove = (e: React.KeyboardEvent):void => {
      const newPosition = [...position];
      if (e.key === "a") {
        newPosition[0] -= moveSpeed;
        newPosition[2] += moveSpeed;
        console.log("left", e.key);
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
        const handleKeyDown = (e: KeyboardEvent) => {
            handleMove(e);
          };

        document.addEventListener("keydown", handleKeyDown);
  
      // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [position]);
    

    return (
        <mesh position={[position[0], position[1], position[2]]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
    )
}