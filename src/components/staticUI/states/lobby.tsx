import React, { useState } from 'react'
import PlayerItem from '../../PlayerItem'
import Logo from '../../../assets/sweetStackLogo.svg'
import Music from '../../Music'
import { GameState } from '../../../logic_v2/types'

const Lobby = ({ game, isPlaying, setPlaying, play }: { game: GameState, isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: Function }) => {

  const [ready, setReady] = useState<boolean>(game.ready);

  return (
    <div className='lobby-contain'>
      <img src={Logo} />
      {/* players ready up */}
      <div className="players-contain">
        <Music isPlaying={isPlaying} setPlaying={setPlaying} play={play} ready={ready}
        />
      </div>
    </div>
  )
}

export default Lobby
