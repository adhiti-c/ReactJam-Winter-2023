import React from 'react'

function RecipeItem({img}: {img: string,}) {
  return (
    <div className='recipe-item'>
      <img src={img}/>
    </div>
  )
}

export default RecipeItem
