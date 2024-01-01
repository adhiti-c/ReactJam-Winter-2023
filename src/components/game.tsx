// the game world, including the cake, syrup, players, and items
/// <reference types="vite-plugin-svgr/client" />
import { Canvas } from '@react-three/fiber';
import Player from './objects/player';
import Camera from './objects/camera';
import { GameState } from "../logic_v2/types";
import Platform from './objects/platform';
import React, { useState, KeyboardEvent, useRef, Suspense} from "react";

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
                {/*<Player controllable={true} /> */}
                <Platform/> 
                {/* render all other players */}
                <ambientLight args={[0x000000]} />
                <directionalLight position={[10, 10, 10]} />
            </Canvas>
        </>
    )
}