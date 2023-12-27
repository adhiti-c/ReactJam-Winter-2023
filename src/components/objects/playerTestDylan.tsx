import { Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

// contains player object and player logic
export default function PlayerDylan() {


    // know the current position
    const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));

    const state = useThree();
    const moveSpeed = 0.01;

    useFrame(() => {
        // handle player movement
        const pointer = state.pointer;
        const threshold = 0.005;
        let newPos = new Vector3(position.x, position.y, position.z);
        // only move if the pointer is at a certain position from the base/origin in x direction
        if (pointer.x < -1 * threshold) {
            console.log("LEFT")
            newPos.x = newPos.x - moveSpeed;
        } else if (pointer.x > threshold) {
            newPos.x = newPos.x + moveSpeed;
            console.log("RIGHT")
        }

        if (pointer.y < -1 * threshold) {
            newPos.y = newPos.y - moveSpeed;
            console.log("DOWN")
        } else if (pointer.y > threshold) {
            newPos.y = newPos.y + moveSpeed;
            console.log("UP")
        }
        setPosition(new Vector3(newPos.x, newPos.y, newPos.z));
    })

    return (
        <mesh position={position}>
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    )
}

function playerController() {

}