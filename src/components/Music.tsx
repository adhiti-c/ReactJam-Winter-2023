import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import useSound from "use-sound";
import clickSound from '../assets/clickSound.wav'

const Music = ({ isPlaying, setPlaying, play, ready }: { isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: Function, ready: boolean}) => {
 //* sound trigger
 const [playClickSound] = useSound(clickSound, {volume: 0.5})
    //* when button clicked, run toggleLobby function
    const handleButtonClick = () => {
        
          
        if (!isPlaying) {
            play();
            setPlaying(true);
            playClickSound();
            
        }
        // move both players to the game screen
        Rune.actions.setGamePhase({ phase: "playing" });
    };

   const handleButtonHover = () => {
    playClickSound();
   }
    
    //* start game
    // no parenthesis bc only one element inside return statement
    return (
        <button className={`main-button ${ready ? null : "disable"}`} onClick={handleButtonClick} onMouseEnter={handleButtonHover}>
            <FontAwesomeIcon icon={faPlay} />
            Play
        </button>);
};
export default Music