// contains player object and player logic
import { Canvas } from "@react-three/fiber";
import React, { useState, KeyboardEvent, useRef } from "react";

//Player Movement
export default function Camera() {
    const [position_c, setPosition] = useState([2, 2, 2]);
    const moveSpeed = 0.1;
    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    const handleMove = (e: KeyboardEvent):void => {
      const newPosition = [...position_c];
      if (e.key === "a") {
        newPosition[0] -= moveSpeed;
        newPosition[2] += moveSpeed;
        console.log("left_c", e.key);
        console.log(windowSize.current[0]);
        console.log(position_c[0]);
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
    }, [position_c]);
    

    return (
        position_c
    )
}