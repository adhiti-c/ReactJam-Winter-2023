import useSound from 'use-sound';
import cafeSound from '../assets/sweet cafe.mp3'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons';
interface musicProps {
    // toggleLobby: () => void;
    setGamePhase: React.Dispatch<React.SetStateAction<string>>;
    // setLobbyOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Music: React.FC<musicProps> = ({setGamePhase}) => {
    const [isPlaying, setPlaying] = useState(false);
    // this is the play function called when the button is clicked
    const [play] = useSound(cafeSound, { volume: 0.5, loop: true });
//* when button clicked, run toggleLobby function
    const handleButtonClick = () => {
        if (!isPlaying) {
            play();
            setPlaying(true); 
            setGamePhase('playing');
        }
       
    };
    
    //* start game
    // no parenthesis bc only one element inside return statement
    return <button className= 'main-button' onClick={handleButtonClick}>
       <FontAwesomeIcon icon={faPlay} />
        Play</button>;
  };
export default Music