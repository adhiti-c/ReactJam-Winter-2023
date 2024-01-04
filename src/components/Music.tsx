import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Music = ({ isPlaying, setPlaying, play, ready }: { isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: Function, ready: boolean }) => {

    //* when button clicked, run toggleLobby function
    const handleButtonClick = () => {
        if (!isPlaying) {
            play();
            setPlaying(true);
        }
        // move both players to the game screen
        Rune.actions.setGamePhase({ phase: "playing" });
    };

    //* start game
    // no parenthesis bc only one element inside return statement
    return (
        <button className={`main-button ${ready ? null : "disable"}`} onClick={handleButtonClick}>
            <FontAwesomeIcon icon={faPlay} />
            Play
        </button>);
};
export default Music