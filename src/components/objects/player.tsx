// contains player object and player logic
import React, { useState, KeyboardEvent, useRef } from "react";
import { Vector3 } from "three";

export default function Player({ controllable, position }: { controllable: boolean, position?: Vector3 }) {
  // if the player is controllable, then player position should be controlled via arrow keys
  let pos = new Vector3(0, 0, 0);
  if (controllable) {
    pos = PlayerMove();
  } else {
    // otherwise, we control it using the inputted state
    // player is not controllable
    if (!position) {
      // a position should always be given
      throw new Error("")
    } else {
      pos = position
    }
  }
  return (
    <mesh position={new Vector3(pos.x, pos.y, pos.z)}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  )
}

//Player Movement
function PlayerMove(): Vector3 {
  const [position, setPosition] = useState([0, 0, 0]);
  const moveSpeed = 0.1;
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const handleMove = (e: KeyboardEvent): void => {
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
      console.log("right", position[0]);
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


  return new Vector3(position[0], position[1], position[2])

}