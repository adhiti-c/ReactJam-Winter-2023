import React from 'react'

function FinalRecipeItem({img}:{img:string}) {
  return (
    <div className='final-recipe-item'>
      <img src={img} />
    </div>
  )
}

export default FinalRecipeItem
