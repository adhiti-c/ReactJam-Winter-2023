// contains cake object and cake logic
import React, { useState, KeyboardEvent, useRef, Suspense  } from "react";
import { Vector3 } from "three";
import { RoundedBox } from '@react-three/drei';
import { Physics, RigidBody} from "@react-three/rapier";

import Cake from './cake';

export default function Platform() {
    return(
        <Suspense>  
            <Physics>
                <RigidBody type = "fixed">
                        <RoundedBox position={[0,-.5,0]} args={[.8, 0.1, 0.8]}>
                            <meshStandardMaterial />
                        </RoundedBox >
                </RigidBody>
            </Physics>
      </Suspense>
    )
}