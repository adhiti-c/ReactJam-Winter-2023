import React from 'react'

function PlayerItem({profile, username, UserTypeIcon, UserType}:{profile: string, username: string, UserTypeIcon:string, UserType: string}) {
  
return (
    <div className='player-item'>
      <img src={profile} alt="" />
      <div className="right-contain">
        <h2>{username}</h2>
        <div className='user-type-contain'>
            <img src={UserTypeIcon}/>
            <p>{UserType}</p>
        </div>
      </div>
      
    </div>
  )
}

// const playerInfo = [
//     {userType: 'cow', userTypeIcon: {cowIcon}},
//     {userType: 'chicken', userTypeIcon: {chickenIcon}},
// ]


export default PlayerItem
