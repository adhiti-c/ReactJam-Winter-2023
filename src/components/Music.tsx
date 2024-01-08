import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import useSound from "use-sound";
import clickSound from '../assets/clickSound.wav'

const Music = ({ isPlaying, setPlaying, play, enableReady, playerIsReady }: { isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: any, enableReady: boolean, playerIsReady: boolean }) => {
    //* sound trigger
    const [playClickSound] = useSound(clickSound, { volume: 0.5 })
    //* when button clicked, run toggleLobby function
    const handleButtonClick = () => {

        // play music
        if (!isPlaying) {
            play();
            setPlaying(true);
            playClickSound();

        }

        if (enableReady) {
            // set the current player's ready status as ready
            Rune.actions.toggleReady();
        }
    };

    const handleButtonHover = () => {
        if (enableReady) {
            playClickSound();
        }
    }

    //* start game
    // no parenthesis bc only one element inside return statement
    // note: "enableReady" shows whether the game has enough people to start
    // playerIsReady is true if the current player is ready to play
    return (
        <button className={`main-button ${enableReady && !playerIsReady ? null : "disable"}`} onClick={handleButtonClick} onMouseEnter={handleButtonHover}>
            {
                playerIsReady ?
                    "Not Ready"
                    :
                    <>
                        <FontAwesomeIcon icon={faPlay} />
                        Ready
                    </>
            }

        </button>);
};
export default Music