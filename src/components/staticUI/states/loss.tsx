import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { GameState } from '../../../logic_v2/types';
//* component for high score screen
function loss({ game }: { game: GameState }) {
  return (
    <div className='high-score-contain'>
      <div className="high-score-item">
        <h2><span>High score!</span></h2>
        <div className="score-item">
          <FontAwesomeIcon icon={faStar} />
          <h1>{game.score}</h1>
        </div>
        <div>
          Try Again? {game.timeLeft > 0 ? (game.timeLeft / 1000).toFixed(0) : 0}
        </div>
      </div>
      {/* <button className='main-button'>
        <FontAwesomeIcon icon={faReplay}/>
            Replay
      </button> */}
    </div>
  )
}

export default loss
