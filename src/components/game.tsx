// the game world, including the cake, syrup, players, and items
import { Canvas} from '@react-three/fiber';
import Player from './objects/player';


export default function Game() {

    return (
        <Canvas camera = {{ position: [2, 3, 2] }}>
            <ambientLight args={[0xff0000]} intensity={0.9} />
            <directionalLight position={[0, 20, 10]} intensity={0.5} />
            <Player />
        </Canvas>
    )
}