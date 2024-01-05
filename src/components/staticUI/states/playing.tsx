import { useEffect, useState } from "react"
import NextUp from "../NextUp";
import Recipe from "../Recipe";
import InventorySlot from "../InventorySlot";
import { LayerToAssetMap } from "../../../logic_v2/assetMap";
import { GameState } from "../../../logic_v2/types";
import { PlacableIngredient } from "../../../logic_v2/cakeTypes";
import CakeReg from "../../../assets/regularCake.svg";
import SuccessSound from "../../../assets/successSound.wav";
import FailureSound from "../../../assets/failureSound.wav";
import { Player } from "rune-games-sdk";

/**
 * the props to this UI are: the game state, the ingredient currently selected (passed in from the parent which remembers the state), and a useState function to change this selected ingredient
 * it works identically as if we had the useState in this file.
 */
export default function PlayingUI({ game, selectedIngredient, setSelectedIngredient, player }: { game: GameState, selectedIngredient: PlacableIngredient[], setSelectedIngredient: React.Dispatch<React.SetStateAction<PlacableIngredient[]>>, player: Player }) {
    const handleInventoryClick = (ingredient: PlacableIngredient) => {
        // if the list of ingredients includes the index
        const newSelectedIngredient = selectedIngredient.includes(ingredient)
            ? // then only include elements not equal to the ingredient
            selectedIngredient.filter((i) => i !== ingredient)
            : // else assign the selectedIngredient array to the new index clicked
            [ingredient];
        setSelectedIngredient(newSelectedIngredient);
        console.log(
            `Ingredient ${ingredient} is selected: ${newSelectedIngredient.includes(
                ingredient,
            )}`,
        );
    };

    let feedback;
    // trigger audio sfx for success
    useEffect(( )=> {
        if(game.feedback === "success") {
            playSuccessSound();
        }
    }, [game.feedback])
    const playSuccessSound = () => {
        const successSound = document.getElementById('successSound') as HTMLAudioElement;
        if (successSound) {
            successSound.play();
            console.log('Success sound played!');
        }
    };
    // trigger audio for failure
    useEffect(()=> {
        if(game.feedback === "failure") {
            playFailureSound();
        }
    }, [game.feedback])
    const playFailureSound = () => {
        const failureSound = document.getElementById('failureSound') as HTMLAudioElement;
        if (failureSound) {
            failureSound.play();
        }
    }
    switch (game.feedback) {
        case "waiting":
            feedback =
                null
            break;
        case "success":
            feedback =
                <div className="feedback success">
                    Success!
                    <audio id="successSound" preload="auto">
                        <source src={SuccessSound} type="audio/wav" />
                    </audio>
                </div>
            break;
        case "failure":
            feedback =
                <div className="feedback failure">
                    Wrong Ingredient!
                    <audio id="failureSound" preload="auto">
                        <source src={FailureSound} type="audio/wav" />
                    </audio>
                </div>
                
            break;
        case "encourage":
            feedback =
                <div className="encourage-feedback">
                    Keep Going!
                </div>
            break;
    }

    // timer calculations
    //   math stuff
    // turn ms into sec
    // since you're using using an if then operator in game: gamestate, you must also use the same operator check in the const
    const totalSeconds = game ? Math.floor(game.timeLeft / 1000) : 0;
    const minutes = game ? Math.floor(totalSeconds / 60) : 0;
    // align seconds relative to minutes. calculates the remainder which is the seconds left (ignoring minutes)
    const seconds = game ? totalSeconds % 60 : 0;
    // $ allows you to embed operators in a string
    // minutes:if seconds under 10, add 0 seconds
    const formattedTimer = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

    return (
        <>
            <div className="top-section">
                <div className="state-contain">

                    {/* <div>{layers}</div> */}

                    <div className="score-contain">
                        <img src={CakeReg} alt="" />
                        <h2>{game.score}</h2>
                    </div>
                    <div className="timer-contain">
                        <h1>{formattedTimer}</h1>
                    </div>

                    <NextUp layerName={game.goals.current} />
                    {/* show all the cake layers */}
                </div>
                <div className="recipe-section">
                    <Recipe game={game} />
                </div>
            </div>

            {feedback}

            <div className="inventory-contain">
                {/* maps each ingredient to an inventoryslot */}
                {game.players[player.playerId].inventory.map((ingredient, index) => {
                    if (ingredient) {
                        const ingredientIcon = LayerToAssetMap[ingredient].icon;
                        if (ingredientIcon) {
                            return (
                                <InventorySlot
                                    key={index}
                                    icon={ingredientIcon}
                                    onClick={() => handleInventoryClick(ingredient)}
                                    className={
                                        selectedIngredient.includes(ingredient) ? "selected" : ""
                                    }
                                />
                            )
                        }
                    }
                    return null;
                })}
            </div>
        </>
    )
}