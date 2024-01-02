import React from 'react'
import RecipeItem from './RecipeItem'
import Cow from '../../assets/cow.svg'
import Chicken from '../../assets/chicken.svg'
import InventoryData from './data/InventoryData'
import FinalRecipeItem from '../FinalRecipeItem'

type Recipe = {
    imgPlayer1: string;
    imgPlayer2: string;
    imgFinal: string;
    // ingredient: string[]; 
  };
function Recipe({imgPlayer1, imgPlayer2, imgFinal, ingredient}:Recipe) {
  return (
    <div className='recipe-contain'>
        <div className="recipe-contain-step">
            <img src={Cow}/>
             <RecipeItem
        img ={imgPlayer1}
        // ingredient = {mapIngredientImg(ingredient)}
      />
        </div>
        <div className="line-contain">
            <div></div>
        <div className="line"></div>
        </div>
        <div className="recipe-contain-step">
        <img src={Chicken}/>
             <RecipeItem
        img ={imgPlayer2}
        // ingredient = {mapIngredientImg(ingredient)}
      />
        </div>
        <div className="recipe-contain-step">
            <div></div>
            <div className="line-contain">
                <div className="line"></div>
            </div>
        </div>
            {/* nts: need to change this into another component */}
        <div className="recipe-contain-step">
           <div></div>
            <FinalRecipeItem
                img ={imgFinal}
            />
        </div>
     
    </div>
  )
}

// map ingredients to recipe items
// function mapIngredientImg(ingredient: string[]): RecipeItem[] {
//     // map array of ingredients 
//     return ingredient.map((ingredient) => {
//         const inventoryItem = InventoryData.map((item) => item.iconName === ingredient)
//         return{icon: inventoryItem?.icon, iconName: ingredient}
//     }
//     )
// }

export default Recipe
