import Cake from "../../../assets/regularCake.svg";
import ChocolateCake from "../../../assets/chocolateCake.svg";
import StrawberryCake from "../../../assets/strawberryCake.svg";
import CarrotCake from "../../../assets/carrotCake.svg";

import Base from "../../../assets/baseIcon.svg";
import Frosting from "../../../assets/frostingIcon.svg";

type NextUp = {
  img: string;
  layerName: string;
};
const LayerData: NextUp[] = [
  { img: Base, layerName: "cake_base" },
  { img: Frosting, layerName: "cake_frosting" },
  { img: Cake, layerName: "basic_cake" },
  { img: ChocolateCake, layerName: "choco_cake" },
  { img: StrawberryCake, layerName: "straw_cake" },
  { img: CarrotCake, layerName: "carrot_cake" },
];
export default LayerData;
