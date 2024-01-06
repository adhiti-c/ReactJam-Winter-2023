// contains cake object and cake logic
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { LayerToAssetMap } from "../../logic_v2/assetMap";
import useSound from 'use-sound';
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'


import { CakeLayerType } from "../../logic_v2/cakeTypes";
import CombineSound from "../../assets/blockSound.wav"
import ObjModel from "./objModel";
export default function Cake({ texture, position, setBlockInMotion }: { texture: CakeLayerType, position: Vector3, setBlockInMotion: React.Dispatch<React.SetStateAction<boolean>> }) {

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

    //* args = arguments (width, height, depth)
    const size: [width?: number | undefined, height?: number | undefined, depth?: number | undefined] = [.7, 0.35, 0.7]
    // trigger audio for combine
    // html audio component that sets the initial audio state to null
    // audioRef used to play audio when triggered
    // const audioRef= useRef<HTMLAudioElement | null > (null)
    const [play] = useSound(CombineSound, { volume: 0.5, loop: false });


    return (
        <RigidBody type={dynamic ? "dynamic" : "fixed"} colliders={isBlenderObj ? "cuboid" : "hull"} onContactForce={() => {
            if (dynamic) {
                // stop gravity
                setDynamic(false);
                // block is stopped
                setBlockInMotion(false);
                // combine
                Rune.actions.combine();
                // checks that if audioRef is called, then it points to "audio" contained under return
                play();
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
