// the game world, including the cake, syrup, players, and items
/// <reference types="vite-plugin-svgr/client" />
import Platform from "./objects/platform";
import { useState, Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GameState } from "../logic_v2/types";
import { PlacableIngredient } from '../logic_v2/cakeTypes';
import Cake from './objects/cake';
import { Physics, RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import PlayingUI from "../components/staticUI/states/playing";
import TutorialUI from "../components/staticUI/states/tutorial";
import Camera from "./objects/camera";
import Lobby from "./staticUI/states/lobby";
// fix the typing error: https://github.com/joshwcomeau/use-sound/issues/135#issuecomment-1723305858
import useSound from 'use-sound';
import cafeSound from '../assets/sweet cafe.mp3'
import { Player, Players } from "rune-games-sdk";

export default function Game({ game, player, players }: { game: GameState, player: Player, players: Players }) {

    // handle the music
    const [isPlaying, setPlaying] = useState(false);

    // this is the play function called when the button is clicked
    const [play] = useSound(cafeSound, { volume: 0.5, loop: true });

    // the cake objects
    const [cakes, setCakes] = useState<any[]>([]);

    // the topmost layer
    const [newLayer, setNewLayer] = useState<JSX.Element[]>([]);

    // a block is falling
    const [blockInMotion, setBlockInMotion] = useState(false);

    // selected ingredient
    const [selectedIngredient, setSelectedIngredient] = useState<PlacableIngredient[]>([]);

    const handleDrop = () => {
        if (selectedIngredient.length === 0) {
            // nothing is selected
            return;
        } else {
            // wait until any blocks falling have stopped
            if (!blockInMotion) {
                // push the action to rune
                Rune.actions.placeIngredient({ ingredient: selectedIngredient[0] });
                // console.log(cakes)
                // const cakeCount = cakes.length
                // setCakes([...cakes, <Cake position={new Vector3(0, 1 + cakes.length * 0.5, 0)} texture={"eggs"} key={cakeCount} />]);
            }
        }
    }

    useEffect(() => {
        // only rerender if no block is in motion
        if (!blockInMotion) {
            rerenderNewLayer();
        }
    }, [game.newLayer]);

    useEffect(() => {
        if (!blockInMotion) {
            // handle putting new things into the cake
            rerenderCake();
        }
        // we need to process any cake updates after a collision happened... rip
    }, [game.cake]);

    function rerenderCake() {
        // handle the new layer
        // whenever the new layer changes, update the rendered cakes
        const gameStateCakeLength = game.cake.length;
        const currentCakeLength = cakes.length;
        // has something new been added?
        if (gameStateCakeLength > currentCakeLength) {
            console.log("cake layer has changed")
            // something new has been added
            // create more blocks in the new layer
            let additionalBlocks: JSX.Element[] = [];
            // TODO: instead, can we iterate through each and only spawn in new blocks?
            for (let i = currentCakeLength; i < gameStateCakeLength; i++) {
                // create more blocks
                additionalBlocks.push(
                    <Cake position={new Vector3(0, 1 + ((cakes.length + currentCakeLength) * 0.5), 0)} texture={"eggs"} key={"cake-" + i} setBlockInMotion={setBlockInMotion} />
                )
            }
            // now add it into the state
            // TODO: will this create some sort of collision type of race condition?
            setCakes([...cakes, ...additionalBlocks])
        }
    }

    useEffect(() => {
        // if the block is no longer in motion, handle rerenders
        if (!blockInMotion) {
            rerenderNewLayer();
        }
    }, [blockInMotion]);

    function rerenderNewLayer() {
        // handle the new layer
        // whenever the new layer changes, update the rendered cakes
        const gameStateLayerLength = game.newLayer.length;
        const currentLayerLength = newLayer.length;
        // has something new been added?
        if (gameStateLayerLength > currentLayerLength) {
            // something new has been added
            // create more blocks in the new layer
            let additionalBlocks: JSX.Element[] = [];
            // TODO: instead, can we iterate through each and only spawn in new blocks?
            for (let i = currentLayerLength; i < gameStateLayerLength; i++) {
                // create more blocks
                console.log("new block added")
                additionalBlocks.push(
                    <Cake position={new Vector3(0, 1 + ((cakes.length + currentLayerLength) * 0.5), 0)} texture={"eggs"} key={"new-layer-" + i} setBlockInMotion={setBlockInMotion} />
                )
            }
            // now add it into the state
            // TODO: will this create some sort of collision type of race condition?
            setNewLayer([...newLayer, ...additionalBlocks])
        } else if (gameStateLayerLength < currentLayerLength) {
            // I'm gonna assume that only top layers are removed
            if (gameStateLayerLength === 0) {
                // wipe it
                setNewLayer([]);
            } else {
                // slice it
                setNewLayer(newLayer.slice(0, gameStateLayerLength));
            }
        } else {
            // should be the same thing
        }
    }

    // add or remove the timer depending on the game state
    let gameTimerHTML;

    switch (game.phase) {
        case "lobby":
            gameTimerHTML = <Lobby game={game} isPlaying={isPlaying} play={play} setPlaying={setPlaying} />;
            break;
        case "tutorial":
            gameTimerHTML = <TutorialUI />;
            break;
        case "playing":
            gameTimerHTML = <PlayingUI game={game} selectedIngredient={selectedIngredient} setSelectedIngredient={setSelectedIngredient} player={player} />
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
            <Canvas
                // camera={{ position: [1, 0, 1] }}
                onClick={handleDrop}>
                <Camera cakes={cakes} />
                <Suspense>
                    <Physics gravity={[0, -15, 0]}
                        colliders="hull"
                    >
                        {...cakes}
                        {...newLayer}
                        <Platform />
                        <ambientLight args={[0x000000]} />
                        <directionalLight position={[10, 10, 10]} />
                    </Physics>
                </Suspense>
            </Canvas>
        </>
    )
}