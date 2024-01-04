// contains cake object and cake logic
import React, { useState, KeyboardEvent, useRef, Suspense } from "react";
import { TextureLoader, Vector3 } from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Canvas, useLoader } from "@react-three/fiber";
import Logo from "../assets/wheatBlockTest.svg";

import { PlacableIngredient } from "../../logic_v2/cakeTypes";
import { CakeLayer } from "../../logic/types";

export default function Cake({texture, position}: {texture: PlacableIngredient, position: Vector3} ) {
    var colorMap = undefined;
    if (texture === "eggs"){
        colorMap = useTexture("/src/assets/wheatBlockTest.svg")}
    return(
      //* Rigidbody = physics block in space
        <RigidBody>
          {/* position sets position in 3d space */}
            <RoundedBox position={position}
            //* args = arguments (width, height, depth)
                args={[.7, .35, 0.7]} >
                <meshStandardMaterial map={colorMap}/>
            </RoundedBox >
        </RigidBody>
    )
}
