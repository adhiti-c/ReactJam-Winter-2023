// the game world, including the cake, syrup, players, and items
/// <reference types="vite-plugin-svgr/client" />
import { Canvas } from '@react-three/fiber';
import Player from './objects/player';
import Camera from './objects/camera';
import { GameState } from "../logic_v2/types";
import Platform from './objects/platform';
import React, { useState, KeyboardEvent, useRef, Suspense } from "react";
import { AllInventory, PlacableIngredient } from '../logic_v2/cakeTypes';

export default function Game({ game }: { game: GameState | undefined }) {

    const camera_pos = Camera();

    if (!game) {
        return <div>Loading...</div>
    }

    // add or remove the timer depending on the game state
    let gameTimerHTML;

    // for now, just show the layers as a bunch of text. This will be fixed later, when we are able to map cake layer types to actual three.js blocks
    let layers = "";
    for (const layer of game.cake) {
        layers += layer + ", "
    }
    // now add in the new layer that is not finalized
    let newLayers = ""
    if (game.newLayer.length !== 0) {
        newLayers += "["
        for (const layer of game.newLayer) {
            newLayers += layer + ", "
        }
        newLayers += "]"
    }
    layers += newLayers
    if (layers.length === 0) {
        layers = "empty cake!"
    }

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
                    <div>
                        Next Up: {game.goals.current}
                    </div>
                    {/* <div>
                        {game.hint.name} recipe: {JSON.stringify(game.hint.recipe)}
                    </div> */}
                    <div>
                        Score: {game.score}
                    </div>
                    <div>
                        Feedback: {game.feedback}
                    </div>
                    {/* show all the cake layers */}
                    <div>
                        {layers}
                    </div>
                    {/* TODO: tie this below button action into the real game logic, this is basically the inventory */}
                    {AllInventory.map((ingredient) => {
                        return (
                            <button onClick={(e) => {
                                e.preventDefault();
                                placeIngredient(ingredient)
                            }}>
                                {ingredient}
                            </button>
                        )
                    })
                    }
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
                <Platform />
                {/* render all other players */}
                <ambientLight args={[0x000000]} />
                <directionalLight position={[10, 10, 10]} />
            </Canvas>
        </>
    )
}

// call this function when you want to place an ingredient
function placeIngredient(ingredient: PlacableIngredient) {
    Rune.actions.placeIngredient({ ingredient: ingredient })
}