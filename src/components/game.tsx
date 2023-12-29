// the game world, including the cake, syrup, players, and items
import { Canvas } from '@react-three/fiber';
import Player from './objects/player';
import Camera from './objects/camera'


export default function Game() {
    const camera_pos = Camera();
    return (
        <Canvas camera={{ position: [camera_pos[0],camera_pos[1],camera_pos[2]]}}>
            <Player/>
            <ambientLight args={[0xff0000]} intensity={0.5} />
            <directionalLight position={[0, 20, 10]} intensity={0.5} />
        </Canvas>
    )
}