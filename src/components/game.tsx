// the game world, including the cake, syrup, players, and items
import { Canvas } from '@react-three/fiber';
// import Player from './objects/player';
import PlayerDylan from './objects/playerTestDylan';
import { useEffect } from 'react';

export default function Game() {

    return (
        <Canvas style={{ width: "100%" }}>
            <ambientLight />
            <PlayerDylan />
        </Canvas>
    )
}