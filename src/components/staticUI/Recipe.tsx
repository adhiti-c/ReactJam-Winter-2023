import RecipeItem from './RecipeItem'
import FinalRecipeItem from '../FinalRecipeItem'

import { LayerToAssetMap } from '../../logic_v2/assetMap'
import { GameState } from '../../logic_v2/types'
import { Fragment } from 'react'

type Recipe = {
  game: GameState
  // ingredient: string[]; 
};
function Recipe({ game }: Recipe) {


  // parse the current hint
  const hint = game.hint;
  const recipe = hint.recipe;
  const goal = hint.name

  return (
    <div className='recipe-contain'>
      {
        recipe.recipe.map((component, index) => {
          return (
            <Fragment key={`recipe-step-${index}`}>
              <div className="recipe-contain-step" >
                <RecipeItem
                  img={LayerToAssetMap[component].icon}
                  game={game}
                  ingredient={component}
                />
              </div>
              <div className="line-contain">
                <div></div>
                <div className="line"></div>
              </div>
            </Fragment>
          )
        })
      }
      <div className="recipe-contain-step">
        <div></div>
        <FinalRecipeItem
          img={LayerToAssetMap[goal].icon}
        />
      </div>

    </div>
  )
}

export default Recipe
