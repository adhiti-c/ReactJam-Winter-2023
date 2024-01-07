import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { lerp } from "three/src/math/MathUtils.js";
import { calculateCurrentCameraY } from "./camera";
import { Vector3 } from "three";

export default function Syrup({ yPos }: { yPos: number | undefined }) {

    const initialYPos = -2;
    const initialXandZ = 0;
    const [currentY, setCurrentY] = useState(initialYPos);
    const [syrupPos, setSyrupPos] = useState(new Vector3(initialXandZ, initialYPos, initialXandZ))

    useEffect(() => {
        if (yPos !== undefined) {
            const newY = calculateCurrentCameraY(yPos) - 3
            setSyrupPos(new Vector3(initialXandZ, newY, initialXandZ))
            console.log(newY)
        }
    }, [yPos])

    useFrame(() => {
        if (yPos !== undefined) {
            setCurrentY(lerp(currentY, syrupPos.y, 0.025));
        }
    })

    return (
        <mesh position={[0, currentY, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={"#964B00"} />
        </mesh>
    )
}