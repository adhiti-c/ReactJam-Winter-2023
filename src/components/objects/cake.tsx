// cake object and any logic associated with it

// contains cake object and cake logic
import React, { useState, KeyboardEvent, useRef, Suspense  } from "react";
import {TextureLoader} from "three";
import { RoundedBox, useTexture } from '@react-three/drei';
import { Physics, RigidBody} from "@react-three/rapier";
import { Canvas, useLoader } from '@react-three/fiber'
import Logo from "../assets/wheatBlockTest.svg";
import { PlacableIngredient } from "../../logic_v2/cakeTypes";

export default function Cake({texture}: {texture: PlacableIngredient}) {
    var colorMap = undefined;
    if (texture === "eggs"){
        colorMap = useTexture("/src/assets/wheatBlockTest.svg")}

    return(
        <RigidBody>
            <mesh>
                <RoundedBox position={[0,2.1,0]}
                    args={[.7, 0.3, 0.7]}>
                    <meshStandardMaterial map={colorMap}/>
                </RoundedBox >
            </mesh>
        </RigidBody>
    )
}

export function cakeDrop() { 
return(
        <Cake texture="eggs"/>
    )
}