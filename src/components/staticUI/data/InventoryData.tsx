
import Butter from './assets/butterIcon.svg'
import Egg from './assets/eggIcon.svg'
type InventoryItem = {
    icon: string; 
    iconName: string;
  };
  
  const InventoryData: InventoryItem[] = [
    {icon: Egg, iconName: "eggs",},
    {icon: Butter, iconName: "butter",},
]
export default InventoryData