import React from 'react'
import { GameState } from '../logic_v2/types'

export function generateFinalContainerStyle(img: string) {
  return {
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    // borderRadius: '22px',
    overflow: 'hide',
    border: '4px solid #fff',
    padding: '0',
  }
}

function FinalRecipeItem({ img, feedbackState }: { img: string, feedbackState: boolean }) {
  const finalContainerStyle = generateFinalContainerStyle(img);

  // const isSuccess = game && game.feedback === 'success';

  return (
    <div style={finalContainerStyle} className={`final-recipe-item${feedbackState ? ' final-recipe-success' : ''}`}>
      {/* <img src={img} /> */}
    </div>
  )
}

export default FinalRecipeItem
