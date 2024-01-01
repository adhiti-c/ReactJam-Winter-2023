// cake object and any logic associated with it

// contains cake object and cake logic
import React, { useState, KeyboardEvent, useRef, Suspense  } from "react";
import {TextureLoader} from "three";
import { RoundedBox, useTexture } from '@react-three/drei';
import { Physics, RigidBody} from "@react-three/rapier";
import { Canvas, useLoader } from '@react-three/fiber'
import Logo from "../assets/wheatBlockTest.svg";

export default function Cake() {
    const cube = useRef();
    const colorMap = useTexture("/src/assets/wheatBlockTest.svg")
    const [hover, setHover] = useState(false);
    const drop = () =>{
        
    };
    

    
    return(
        <RigidBody>
            <mesh>
                <RoundedBox position={[0,2,0]} onPointerEnter={()=> setHover(true)} 
                    onPointerLeave={()=> setHover(false)} 
                    onClick={drop}
                    args={[.7, 0.3, 0.7]}>
                    <meshStandardMaterial map={colorMap}/>
                </RoundedBox >
            </mesh>
        </RigidBody>
    )
}


function CakeDrop() {

}
