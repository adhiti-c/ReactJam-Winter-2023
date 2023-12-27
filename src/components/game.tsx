// the game world, including the cake, syrup, players, and items
import { Canvas } from '@react-three/fiber';
import Player from './objects/player';

export default function Game() {

    return (
        <Canvas>
            <ambientLight />
            <Player />
        </Canvas>
    )
}