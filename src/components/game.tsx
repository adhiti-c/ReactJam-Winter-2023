// the game world, including the cake, syrup, players, and items
/// <reference types="vite-plugin-svgr/client" />
import Platform from "./objects/platform";
import { useState, Suspense } from "react";
import { Canvas } from '@react-three/fiber';
import Camera from './objects/camera';
import { GameState } from "../logic_v2/types";
import { PlacableIngredient } from '../logic_v2/cakeTypes';
import Cake from './objects/cake';
import { Physics, RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import PlayingUI from "../components/staticUI/states/playing";
import TutorialUI from "../components/staticUI/states/tutorial";

export default function Game({ game }: { game: GameState }) {


    // the cake objects
    const [cakes, setCakes] = useState<any[]>([]);

    // selected ingredient
    const [selectedIngredient, setSelectedIngredient] = useState<PlacableIngredient[]>([]);

    const handleDrop = () => {
        if (selectedIngredient.length === 0) {
            // nothing is selected
            return;
        } else {
            // push the action to rune
            Rune.actions.placeIngredient({ ingredient: selectedIngredient[0] });
            console.log(cakes)
            const cakeCount = cakes.length
            setCakes([...cakes, <Cake position={new Vector3(0, 1, 0)} texture={"eggs"} key={cakeCount} />]);
        }
    }

    const camera_pos = Camera();

    // add or remove the timer depending on the game state
    let gameTimerHTML;

    // for now, just show the layers as a bunch of text. This will be fixed later, when we are able to map cake layer types to actual three.js blocks
    let layers = "";

    for (const layer of game.cake) {
        layers += layer + ", ";
    }
    // now add in the new layer that is not finalized
    let newLayers = "";
    if (game.newLayer.length !== 0) {
        newLayers += "[";
        for (const layer of game.newLayer) {
            newLayers += layer + ", ";
        }
        newLayers += "]";
    }
    layers += newLayers;
    if (layers.length === 0) {
        layers = "empty cake!";
    }

    switch (game.phase) {
        case "tutorial":
            gameTimerHTML = <TutorialUI />;
            break;
        case "playing":
            gameTimerHTML = <PlayingUI game={game} selectedIngredient={selectedIngredient} setSelectedIngredient={setSelectedIngredient} />
            break;
        case "loss":
            // gameTimerHTML =
            //     <div className="time-left">
            //         Game Over
            //     </div>
            break;
    }


    return (
        <>
            {gameTimerHTML}
            <Canvas camera={{ position: [camera_pos[0], camera_pos[1], camera_pos[2]] }}
                onClick={handleDrop}>
                <Suspense>
                    <Physics gravity={[0, -15, 0]} colliders="hull">
                        {...cakes}
                        <RigidBody type="fixed">
                            <Platform />
                        </RigidBody>
                        {/*<Player controllable={true} /> */}
                        {/* render all other players */}
                        <ambientLight args={[0x000000]} />
                        <directionalLight position={[10, 10, 10]} />
                    </Physics>
                </Suspense>
            </Canvas>
        </>
    )
}