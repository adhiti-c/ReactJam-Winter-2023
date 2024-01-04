import React, { useState } from 'react'
import PlayerItem from '../../PlayerItem'
import Logo from '../../../assets/sweetStackLogo.svg'
import Music from '../../Music'

const Lobby = ({ isPlaying, setPlaying, play }: { isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: Function }) => {
  // const [setGamePhase] = useState(true);

  // const toggleLobby = () => {
  //     setLobbyOpen((lobby)=> !lobby);
  // };
  return (
    <div className='lobby-contain'>
      <img src={Logo} />
      {/* players ready up */}
      <div className="players-contain">
        <Music isPlaying={isPlaying} setPlaying={setPlaying} play={play}
        />
      </div>
    </div>
  )
}

export default Lobby
