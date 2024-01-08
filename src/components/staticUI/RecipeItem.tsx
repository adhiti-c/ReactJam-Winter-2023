import React, { useEffect, useState } from 'react'
import { GameState } from '../../logic_v2/types'
import { CakeLayerType, isPlacableIngredient } from '../../logic_v2/cakeTypes';
import { PlayerIndexToCharacterIcon } from '../../logic_v2/assetMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function RecipeItem({ img, ingredient, game }: { img: string, ingredient: CakeLayerType, game: GameState }) {
  // loop through the inventory to find out who owns what
  let owner: number | null = null;
  let index = 0;
  for (const player of Object.values(game.players)) {
    const inventory = player.inventory;
    if (isPlacableIngredient(ingredient) && inventory.includes(ingredient)) {
      owner = player.number;
      break;
    }
    index++;
  }

  const [isPlaced, setIsPlaced] = useState(false)

  useEffect(() => {
    // check if this item is already placed down whenever the newLayer changes
    setIsPlaced(game.newLayer.includes(ingredient))
  }, [game.newLayer])
  return (
    <>
   <div className={`recipe-step-contain ${!isPlaced ? "disabled-recipe-item" : null}`} >
      <div className="recipe-item">
        
      <div >
        <img src={img} />
        {
          isPlaced ?
            <div className="check-contain">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            : null
        }

      </div>
      </div>
      {owner !== null ? <img src={PlayerIndexToCharacterIcon[owner].gameIcon} /> : null}
      </div>
         {/* figure out who owns this item, if anyone */}
      {/* rn this is in the success state */}
      
      
    </>
  )
}

export default RecipeItem
