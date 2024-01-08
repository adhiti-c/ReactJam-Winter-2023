import { useEffect, useState } from "react"
import NextUp from "../NextUp";
import Recipe from "../Recipe";
import InventorySlot from "../InventorySlot";
import { LayerToAssetMap, PlayerIndexToCharacterIcon } from "../../../logic_v2/assetMap";
import { GameState } from "../../../logic_v2/types";
import { PlacableIngredient } from "../../../logic_v2/cakeTypes";
import CakeReg from "../../../assets/icons/regularCake.svg";
import SuccessSound from "../../../assets/successSound.wav";
import FailureSound from "../../../assets/failureSound.wav";
import GoSound from "../../../assets/goSound.wav"
import ScoreSound from "../../../assets/scoreSound.wav"
import { Player } from "rune-games-sdk";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from '@react-spring/web'
import Arrow from '../../../assets/tutorial/arrowTutorial.svg'
import ArrowDown from '../../../assets/tutorial/arrowDownTutorial.svg'

/**
 * the props to this UI are: the game state, the ingredient currently selected (passed in from the parent which remembers the state), and a useState function to change this selected ingredient
 * it works identically as if we had the useState in this file.
 */
export default function PlayingUI({ game, selectedIngredient, setSelectedIngredient, player, dropIngredient }: { game: GameState, selectedIngredient: PlacableIngredient[], setSelectedIngredient: React.Dispatch<React.SetStateAction<PlacableIngredient[]>>, player: Player, dropIngredient: Function }) {

    /**
     * this state is true if the player has placed
     */
    const [hasPlaced, setHasPlaced] = useState(false);

    const [afk, setAfk] = useState(false);

    const [timer, setTimer] = useState(0);
    const afkThreshold = 5; // in seconds

    useEffect(() => {
        const playerInState = game.players[player.playerId]
        if (playerInState) {
            setHasPlaced(playerInState.hasPlaced);
        }
    }, [game.players]);

    // handle afk

    useEffect(() => {
        const checkAfkStatus = () => {
            if (timer >= afkThreshold) {
                setAfk(true);
            }
        };

        // increment the afk timer every second
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
            checkAfkStatus();
        }, 1000);

        // clear interval on unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [timer]);

    const resetTimer = () => {
        setTimer(0);
        // If you want to track whether the user is currently AFK, you can update the state here.
        setAfk(false);
    };

    const handleInventoryClick = (ingredient: PlacableIngredient) => {
        // reset AFK timer
        resetTimer();
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

        // actually drop the ingredient
        dropIngredient(ingredient);
    };

    let feedback;
    // trigger audio sfx for success
    useEffect(() => {
        // keep all these sound stuff in the same useEffect for the feedback
        switch (game.feedback) {
            case "success":
                playSound('successSound');
                break;
            case "failure":
                // trigger audio for failure
                playSound('failureSound');
                break;
            case "start":
                playSound('goSound');
                break;
        }
    }, [game.feedback])

    function playSound(soundId: string) {
        const sound = document.getElementById(soundId) as HTMLAudioElement;
        if (sound) {
            sound.play();
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
                    <h1>Success!</h1>
                    <audio id="successSound" preload="auto">
                        <source src={SuccessSound} type="audio/wav" />
                    </audio>
                </div>
            break;
        case "failure":
            feedback =
                <div className="feedback failure">
                    <div className="tutorial-text-contain">
                        <img src={Arrow} alt="" />
                        <h1>Follow the Recipe!</h1>
                    </div>


                    <audio id="failureSound" preload="auto">
                        <source src={FailureSound} type="audio/wav" />
                    </audio>
                </div>

            break;
        case "encourage":
            feedback =
                <div className="feedback encourage">
                    <h1> Keep Going!</h1>

                </div>
            break;
        case "streak":
            feedback =
                <div className="feedback success">
                    <h1>You're on a {game.streak} streak!</h1>
                </div>
            break;
        case "start":
            feedback =
                <div className="feedback success go">
                    <h1>Go!</h1>
                    <audio id="goSound" preload="auto">
                        <source src={GoSound} type="audio/wav" />
                    </audio>
                </div>
    }

    // timer calculations
    //   math stuff
    // turn ms into sec
    // since you're using using an if then operator in game: gamestate, you must also use the same operator check in the const
    const totalSeconds = game.timeLeft > 0 ? Math.floor(game.timeLeft / 1000) : 0;
    const minutes = Math.floor(totalSeconds / 60);
    // align seconds relative to minutes. calculates the remainder which is the seconds left (ignoring minutes)
    const seconds = totalSeconds % 60;
    // $ allows you to embed operators in a string
    // minutes:if seconds under 10, add 0 seconds
    const formattedTimer = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    //* spring animations for text
    const props = useSpring({ total: game.score });

    useEffect(() => {
        playSound("scoreSound")
    }, [game.score])

    return (
        <>
            {
                hasPlaced ? (

                    <div className="waiting-contain">
                        <h1>Waiting for the other player</h1>
                    </div>

                ) : (
                    <span>
                        {/* <div className="feedback encourage-animate">
                            <h1 className="encourage">Your turn!</h1>
                        </div> */}

                    </span>)
            }
            <div className="top-section">
                <div className="state-contain">

                    {/* <div>{layers}</div> */}
                    {/* player icons */}
                    <div className="player-icon-contain">
                        <img src={PlayerIndexToCharacterIcon[game.players[player.playerId].number].highlightGameIcon} />
                    </div>



                    <div className={`${game.feedback === "success" ? 'success-time' : ''}`}>
                        <h1>{formattedTimer}</h1>
                    </div>
                    <div className={`score-contain${game.feedback === "success" ? ' success-score' : ''}`} >
                        {/* <div className="score-contain"> */}

                        <FontAwesomeIcon icon={faStar} />
                        <h2><animated.h2>{props.total.to(x => x.toFixed(0))}</animated.h2></h2>
                    </div>
                    <audio id="scoreSound" preload="auto">
                        <source src={ScoreSound} type="audio/wav" />
                    </audio>
                    {/* <NextUp layerName={game.goals.current} /> */}
                    {/* show all the cake layers */}
                </div>
                <div className="recipe-section">
                    <Recipe game={game} feedbackState={game.feedback === "success"} clientPlayerId={player.playerId} />
                </div>
            </div>

            {feedback}
            {
                afk ?
                    <div className="feedback">
                        <div className="tutorial-text-contain">
                            <h1>Tap to drop</h1>
                            <img src={ArrowDown} alt="" />
                        </div>
                    </div>
                    : null
            }


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
                                // className={
                                //     selectedIngredient.includes(ingredient) ? "selected" : ""
                                // }
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