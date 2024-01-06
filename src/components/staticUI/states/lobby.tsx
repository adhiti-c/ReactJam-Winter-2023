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
const Lobby = ({ game, isPlaying, setPlaying, play }: { game: GameState, isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: Function }) => {

  const [ready, setReady] = useState<boolean>(game.ready);

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
      <Music isPlaying={isPlaying} setPlaying={setPlaying} play={play} ready={ready}
        />
        </div>
    </div>
  )
}

export default Lobby
