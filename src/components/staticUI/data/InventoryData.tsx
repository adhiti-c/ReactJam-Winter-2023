
import Butter from "../../../assets/butterIcon.svg"
import Egg from '../../../assets/eggIcon.svg'
import { PlacableIngredient } from "../../../logic_v2/cakeTypes";
type InventoryItem = {
  icon: string;
  iconName: PlacableIngredient;
};

const InventoryData: InventoryItem[] = [
  { icon: Egg, iconName: "eggs", },
  { icon: Butter, iconName: "butter", },
]
export default InventoryData