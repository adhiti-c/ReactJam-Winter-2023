import React, { useState } from 'react'
import PlayerItem from '../../PlayerItem'
import Logo from '../../../assets/sweetStackLogo.svg'
import Music from '../../Music'
interface lobbyProps {
    setGamePhase: React.Dispatch<React.SetStateAction<string>>;
}
const lobby:React.FC<lobbyProps> = ({setGamePhase}) => {
    // const [setGamePhase] = useState(true);

    // const toggleLobby = () => {
    //     setLobbyOpen((lobby)=> !lobby);
    // };
  return (
    <div className='lobby-contain'>
      <img src={Logo}/>
      {/* players ready up */}
      <div className="players-contain">
        <Music setGamePhase={setGamePhase}
        />
      </div>
    </div>
  )
}

export default lobby
