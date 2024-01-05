import React from 'react'


function PlayerItem({game, players}:{profile: string, username: string, userType: string}) {
  return (
    <div className='player-item'>
      <img src={profile} alt="" />
      <h2>{username}</h2>
    </div>
  )
}

export default PlayerItem
