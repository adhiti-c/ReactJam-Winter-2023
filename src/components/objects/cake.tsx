// contains cake object and cake logic
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";

import { PlacableIngredient } from "../../logic_v2/cakeTypes";

export default function Cake({ texture, position, setBlockInMotion }: { texture: PlacableIngredient, position: Vector3, setBlockInMotion: React.Dispatch<React.SetStateAction<boolean>> }) {

    // make this layer movable by default
    const [dynamic, setDynamic] = useState<boolean>(true);

    let colorMap = undefined;
    if (texture === "eggs") {
        colorMap = useTexture("/src/assets/wheatBlockTest.svg")
    }

    useEffect(() => {
        // this object is falling
        setBlockInMotion(true);
    }, [])

    //* args = arguments (width, height, depth)
    const size: [width?: number | undefined, height?: number | undefined, depth?: number | undefined] = [.7, 0.35, 0.7]

    return (
        <RigidBody type={dynamic ? "dynamic" : "fixed"} onContactForce={() => {
            // stop gravity
            setDynamic(false);
            // block is stopped
            setBlockInMotion(false);
            // combine
            Rune.actions.combine();
        }}>
            <RoundedBox position={position}
                args={size} >
                <meshStandardMaterial map={colorMap} />
            </RoundedBox >
        </RigidBody>
    )
}
