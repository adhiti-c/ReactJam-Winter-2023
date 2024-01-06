import React from 'react'
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
  return (
    <>
      {/* figure out who owns this item, if anyone */}
      {/* rn this is in the success state */}
      {owner !== null ? <img src={PlayerIndexToCharacterIcon[owner].gameIcon} /> : null}
      <div className='recipe-item'>
        <img src={img} />
        <div className="check-contain">
          <FontAwesomeIcon icon={faCheck} />
        </div>
      </div>
    </>
  )
}

export default RecipeItem
