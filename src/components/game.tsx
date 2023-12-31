// the game world, including the cake, syrup, players, and items
import { Canvas } from '@react-three/fiber';
import Player from './objects/player';
import Camera from './objects/camera'
import { GameState } from "../logic_v2/types"

export default function Game({ game }: { game: GameState | undefined }) {

    const camera_pos = Camera();

    if (!game) {
        return <div>Loading...</div>
    }

    // add or remove the timer depending on the game state
    let gameTimerHTML;

    switch (game.phase) {
        case "tutorial":
            gameTimerHTML =
                <div className="time-left">
                    Tutorial
                </div>
            break;
        case "playing":
            gameTimerHTML =
                <div className="time-left">
                    Time Left: {`${(game.timeLeft / 1000).toFixed(3)}s`}
                </div>
            break;
        case "loss":
            gameTimerHTML =
                <div className="time-left">
                    Game Over
                </div>
            break;
    }

    return (
        <>
            {gameTimerHTML}

            <Canvas camera={{ position: [camera_pos[0], camera_pos[1], camera_pos[2]] }}>
                <Player controllable={true} />
                {/* render all other players */}
                <ambientLight args={[0xff0000]} intensity={0.5} />
                <directionalLight position={[0, 20, 10]} intensity={0.5} />
            </Canvas>
        </>
    )
}