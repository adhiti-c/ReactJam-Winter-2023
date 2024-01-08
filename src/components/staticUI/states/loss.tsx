import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { GameState } from '../../../logic_v2/types';
import LossSound from "../../../assets/lossSound.wav";
//* component for high score screen
function loss({ game }: { game: GameState }) {

  useEffect(() => {
    playSound("lossSound")
  }, [])

  function playSound(soundId: string) {
    const sound = document.getElementById(soundId) as HTMLAudioElement;
    if (sound) {
      sound.play();
    }
  }

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
      <audio id="lossSound" preload="auto">
        <source src={LossSound} type="audio/wav" />
      </audio>
    </div>
  )
}

export default loss
