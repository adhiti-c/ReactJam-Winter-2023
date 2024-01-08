import RecipeItem from './RecipeItem'
import FinalRecipeItem from '../FinalRecipeItem'

import { LayerToAssetMap } from '../../logic_v2/assetMap'
import { GamePhase, GameState } from '../../logic_v2/types'
import { Fragment } from 'react'

type Recipe = {
  game: GameState,
  feedbackState: boolean,
  clientPlayerId: string,
  // ingredient: string[]; 
};
function Recipe({ game, feedbackState, clientPlayerId }: Recipe) {


  // parse the current hint
  const hint = game.hint;
  const recipe = hint.recipe;
  const goal = hint.name

  return (
    <div className="recipe-wrapper">
      <div className="make-contain">
        <h2>create</h2>
        <img src={LayerToAssetMap[goal].icon} alt="" />
      </div>
      <div className='recipe-contain'>
        {
          recipe.recipe.map((component, index) => {
            return (
              <Fragment key={`recipe-step-${index}`}>

                <RecipeItem
                  img={LayerToAssetMap[component].icon}
                  game={game}
                  ingredient={component}
                  clientPlayerId={clientPlayerId}
                />
                {/* only show + on not the last recipe box */}
                {
                  index !== recipe.recipe.length - 1 ?
                    <div className="recipe-operator-contain">
                      <h2>+</h2>
                    </div>
                    : null
                }
              </Fragment>
            )
          })
        }
        {/* <div className="recipe-contain-step"> */}
        <div className="recipe-operator-contain">
          <h2>=</h2>
        </div>
        <FinalRecipeItem
          img={LayerToAssetMap[goal].icon}
          feedbackState={feedbackState}
        />
        {/* </div> */}
      </div></div>
  )
}

export default Recipe
