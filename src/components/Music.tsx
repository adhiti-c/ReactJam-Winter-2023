import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Music = ({ isPlaying, setPlaying, play }: { isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: Function }) => {

    //* when button clicked, run toggleLobby function
    const handleButtonClick = () => {
        if (!isPlaying) {
            play();
            setPlaying(true);
        }
    };

    //* start game
    // no parenthesis bc only one element inside return statement
    return (
        <button className='main-button' onClick={handleButtonClick}>
            <FontAwesomeIcon icon={faPlay} />
            Play
        </button>);
};
export default Music