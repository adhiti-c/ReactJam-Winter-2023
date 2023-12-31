// cake object and any logic associated with it

// contains cake object and cake logic
import React, { useState, KeyboardEvent, useRef, Suspense  } from "react";
import { Vector3 } from "three";
import { RoundedBox } from '@react-three/drei';
import { Physics, RigidBody} from "@react-three/rapier";

export default function Cake() {
    const cube = useRef();
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
                    <meshStandardMaterial />
                </RoundedBox >
            </mesh>
        </RigidBody>
    )
}


function CakeDrop() {

}
