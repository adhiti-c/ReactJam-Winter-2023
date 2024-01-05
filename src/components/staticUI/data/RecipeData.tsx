//* this will be the holy bible of all asset data
// from data/staticUI/components/assets
import Butter from "../../../assets/butterIcon.svg";
import Egg from "../../../assets/eggIcon.svg";
import Wheat from "../../../assets/wheatIcon.svg";
import Chocolate from "../../../assets/chocolateIcon.svg";
import Straw from "../../../assets/carrotIcon.svg";
import Carrot from "../../../assets/strawberryCake.svg";
import { PlacableIngredient } from "../../../logic_v2/cakeTypes";
//? each element has: 
//? name
//? static ui icon
//? 3d asset (model OR material)
type RecipeItem = {
    //* identifier label
    Name: PlacableIngredient;
    //* static UI
    StaticIcon: string;
    //* 3d asset material or 3d asset
    Model: string;
    //* final goal contained in "next up"

}
const RecipeData: RecipeItem[] = [
    //* ingredients
    // egg
    {Name: "eggs", StaticIcon: Egg, Model: EggBlock},
    //* flavors
    // carrot
]

export default RecipeData