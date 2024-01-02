// from data/staticUI/components/assets
import Butter from "../../../assets/butterIcon.svg";
import Egg from "../../../assets/eggIcon.svg";
import Wheat from "../../../assets/wheatIcon.svg";
import Chocolate from "../../../assets/chocolateIcon.svg";
import Straw from "../../../assets/carrotIcon.svg";
import Carrot from "../../../assets/strawberryCake.svg";
import { PlacableIngredient } from "../../../logic_v2/cakeTypes";
type InventoryItem = {
  icon: string;
  iconName: PlacableIngredient;
};

const InventoryData: InventoryItem[] = [
  { icon: Egg, iconName: "eggs" },
  { icon: Butter, iconName: "butter" },
  { icon: Wheat, iconName: "flour" },
  { icon: Chocolate, iconName: "chocolate" },
  { icon: Straw, iconName: "strawberry" },
  { icon: Carrot, iconName: "carrot" },
];
export default InventoryData;
