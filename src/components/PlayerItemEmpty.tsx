import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function PlayerItemEmpty() {
  return (
    <div>
        <div className='player-item play-item-empty'>
        <div className="add-contain">
            <FontAwesomeIcon icon={faPlus} />
        </div>
        <p>1 more player</p>
        
      </div>
      
    </div>
      
  
  )
}

export default PlayerItemEmpty
