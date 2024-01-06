import React, { useState } from 'react'
import PlayerItem from '../../PlayerItem'
import Logo from '../../../assets/sweetStackLogo.svg'
import Music from '../../Music'
import { GameState } from '../../../logic_v2/types'
import Background from '../../../assets/lobbyBackground.svg'
import Profile from '../../../assets/profilePlaceholder.png'
// import into a different doc
import cowIcon from '../../../assets/characters/cowLobby.svg'
import chickenIcon from '../../../assets/characters/chickenLobby.svg'
import PlayerItemEmpty from '../../PlayerItemEmpty'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import useSound from "use-sound";
import clickSound from '../../../assets/clickSound.wav'
import TutorialIUI from './tutorial'
const Lobby = ({ game, isPlaying, setPlaying, play }: { game: GameState, isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: Function }) => {

  const [ready, setReady] = useState<boolean>(game.ready);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
//   when tutorial is clicked
const [playClickSound] = useSound(clickSound, {volume: 0.5})
const handleTutorialClick = () => {
    playClickSound();
    
    setShowTutorial(true);
};

const handleTutorialHover = () => {
    playClickSound();
}
  return (
    <div className='lobby-contain'>
      
      <div className="lobby-content">
      <img src={Logo} />
      {/* players ready up */}
      <div className="players-contain">
        <PlayerItem
          profile={Profile}
          username='epikcow'
          UserType='cow'
          UserTypeIcon= {cowIcon}
        />
        <PlayerItem
          profile={Profile}
          username='coolchick'
          UserType='chicken'
          UserTypeIcon= {chickenIcon}
        />
        {/* <PlayerItemEmpty /> */}
      </div>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '8px'}}>

     
      <Music isPlaying={isPlaying} setPlaying={setPlaying} play={play} ready={ready}
        />
        {/* how to play tutorial */}
         <button className='tutorial-button' onClick={handleTutorialClick} onMouseEnter={handleTutorialHover}>
           <div className="icon-contain">
           <FontAwesomeIcon icon={faQuestion} />
           </div>
            How to play
        </button>
        {showTutorial && <TutorialIUI />}
        </div>
        </div>
    </div>
  )
}

export default Lobby
