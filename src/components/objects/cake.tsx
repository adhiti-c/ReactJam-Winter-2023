// contains cake object and cake logic
import { forwardRef, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { LayerToAssetMap } from "../../logic_v2/assetMap";
import useSound from 'use-sound';

import { CakeLayerType } from "../../logic_v2/cakeTypes";
import CombineSound from "../../assets/blockSound.wav"
import ObjModel from "./objModel";
export default function Cake({ texture, index, position, setBlockInMotion, setCakeYPosition, cakeYPos }: { texture: CakeLayerType, index?: number, position: Vector3, setBlockInMotion: React.Dispatch<React.SetStateAction<boolean>>, setCakeYPosition?: React.Dispatch<React.SetStateAction<number[]>>, cakeYPos?: number[] }) {

    // make this layer movable by default
    const [dynamic, setDynamic] = useState<boolean>(true);

    let colorMap = undefined;
    const assetMap = LayerToAssetMap[texture]
    const block = assetMap.block;
    const isBlenderObj = assetMap.isBlenderObj
    if (!isBlenderObj) {
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


    const rigidBody = useRef<RapierRigidBody>(null);

    //* args = arguments (width, height, depth)
    const size: [width?: number | undefined, height?: number | undefined, depth?: number | undefined] = [.7, 0.35, 0.7]
    // trigger audio for combine
    // html audio component that sets the initial audio state to null
    // audioRef used to play audio when triggered
    // const audioRef= useRef<HTMLAudioElement | null > (null)
    const [play] = useSound(CombineSound, { volume: 0.5, loop: false });

    return (
        <RigidBody type={dynamic ? "dynamic" : "fixed"} colliders={isBlenderObj ? "cuboid" : "hull"} ref={rigidBody} onContactForce={() => {
            if (dynamic) {
                // stop gravity
                setDynamic(false);
                // block is stopped
                setBlockInMotion(false);
                // combine
                Rune.actions.combine();
                // checks that if audioRef is called, then it points to "audio" contained under return
                play();

                // for tracking y position of cakes in the cake layer
                if (rigidBody.current) {
                    // create copy of all objects
                    if (setCakeYPosition && cakeYPos && index !== undefined) {
                        const pos = rigidBody.current.translation();
                        const prevPositions = [...cakeYPos];
                        // update position
                        if (prevPositions[index] !== undefined) {
                            prevPositions[index] = pos.y;
                        } else {
                            prevPositions.push(pos.y);
                        }
                        // update parent state
                        setCakeYPosition(prevPositions);
                    }
                } else {
                    console.log("rigidBody.current does not exist")
                }
            }
        }}>
            {/* contains audio info for block collides */}
            {/* if dynamic is true, audio is executed */}
            {
                isBlenderObj ?
                    <ObjModel texture={texture} position={position} />
                    :
                    <RoundedBox position={position}
                        args={size} >
                        <meshStandardMaterial map={colorMap} />
                    </RoundedBox >
            }
        </RigidBody>
    )
}
