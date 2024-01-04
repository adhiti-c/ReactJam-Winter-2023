import { useState } from "react"
import NextUp from "../NextUp";
import Recipe from "../Recipe";
import InventoryData from "../data/InventoryData";
import InventorySlot from "../InventorySlot";
import { GameState } from "../../../logic_v2/types";
import { PlacableIngredient } from "../../../logic_v2/cakeTypes";
import CakeReg from "../../../assets/regularCake.svg";

/**
 * the props to this UI are: the game state, the ingredient currently selected (passed in from the parent which remembers the state), and a useState function to change this selected ingredient
 * it works identically as if we had the useState in this file.
 */
export default function PlayingUI({ game, selectedIngredient, setSelectedIngredient }: { game: GameState, selectedIngredient: PlacableIngredient[], setSelectedIngredient: React.Dispatch<React.SetStateAction<PlacableIngredient[]>> }) {
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
                    <Recipe
                        imgPlayer1=""
                        imgPlayer2=""
                        imgFinal=""
                    />
                </div>
            </div>



            {/* <div>

            {JSON.stringify(game.hint.recipe)}
            {game.hint.name} 
          </div> */}
            <div className="inventory-contain">
                {/* maps each ingredient to an inventoryslot */}
                {InventoryData.slice(0, 3).map((ingredient, index) => (
                    <InventorySlot
                        key={index}
                        icon={ingredient.icon}
                        onClick={() => handleInventoryClick(ingredient.iconName)}
                        className={
                            selectedIngredient.includes(ingredient.iconName) ? "selected" : ""
                        }
                    />
                ))}
            </div>
        </>
    )
}