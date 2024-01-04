import React from 'react'

function PlayerItem({profile, username, userType}:{profile: string, username: string, userType: string}) {
  return (
    <div className='player-item'>
      <img src={profile} alt="" />
      <h2>{username}</h2>
      <p>{userType}</p>
    </div>
  )
}

export default PlayerItem
