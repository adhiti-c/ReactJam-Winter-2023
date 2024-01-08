import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons';
//* component for high score screen
function loss({score}:{score: number}) {
  return (
    <div className='high-score-contain'>
      <div className="high-score-item">
            <h2><span>High score!</span></h2>
            <div className="score-item">
                <FontAwesomeIcon icon={faStar}/>
                <h1>{score}</h1>
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
