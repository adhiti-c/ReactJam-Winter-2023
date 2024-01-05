import RecipeItem from './RecipeItem'
import FinalRecipeItem from '../FinalRecipeItem'

import { LayerToAssetMap } from '../../logic_v2/assetMap'
import { GameState } from '../../logic_v2/types'

type Recipe = {
  imgPlayer1: string;
  imgPlayer2: string;
  imgFinal: string;
  game: GameState
  // ingredient: string[]; 
};
function Recipe({ imgPlayer1, imgPlayer2, imgFinal, game }: Recipe) {


  // parse the current hint
  const hint = game.hint;
  const recipe = hint.recipe;
  const goal = hint.name

  return (
    <div className='recipe-contain'>
      {
        recipe.recipe.map((component) => {
          return (
            <>
              <div className="recipe-contain-step">
                <RecipeItem
                  img={LayerToAssetMap[component].icon}
                />
              </div>
              <div className="line-contain">
                <div></div>
                <div className="line"></div>
              </div>
            </>
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
