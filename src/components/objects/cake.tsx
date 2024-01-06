// contains cake object and cake logic
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { LayerToAssetMap } from "../../logic_v2/assetMap";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { CakeLayerType } from "../../logic_v2/cakeTypes";

export default function Cake({ texture, position, setBlockInMotion }: { texture: CakeLayerType, position: Vector3, setBlockInMotion: React.Dispatch<React.SetStateAction<boolean>> }) {

    // make this layer movable by default
    const [dynamic, setDynamic] = useState<boolean>(true);

    let colorMap = undefined;
    const block = LayerToAssetMap[texture].block;
    const isBlenderObj = LayerToAssetMap[texture].isBlenderObj
    if (isBlenderObj) {
        colorMap = useLoader(GLTFLoader, block);
    } else {
        // load the texture using useTexture
        colorMap = useTexture(block);
    }

    // if (texture === "eggs") {
    //     colorMap = useTexture("/src/assets/textures/wheatBlock.svg")
    // }

    useEffect(() => {
        // this object is falling
        setBlockInMotion(true);
    }, [])

    //* args = arguments (width, height, depth)
    const size: [width?: number | undefined, height?: number | undefined, depth?: number | undefined] = [.7, 0.35, 0.7]

    return (
        <RigidBody type={dynamic ? "dynamic" : "fixed"} colliders={isBlenderObj ? "cuboid" : "hull"} onContactForce={() => {
            if (dynamic) {
                // stop gravity
                setDynamic(false);
                // block is stopped
                setBlockInMotion(false);
                // combine
                Rune.actions.combine();
            }
        }}>
            {
                isBlenderObj ?
                    <mesh position={position} scale={0.3}>
                        <primitive object={colorMap.scene} />
                    </mesh>
                    :
                    <RoundedBox position={position}
                        args={size} >
                        <meshStandardMaterial map={colorMap} />
                    </RoundedBox >
            }
        </RigidBody>
    )
}
