// this is our CakeLayerType to asset bible

// import all the assets

// 2d icons
import Butter from "../assets/butterIcon.svg";
import Egg from "../assets/eggIcon.svg";
import Wheat from "../assets/wheatIcon.svg";
import Chocolate from "../assets/chocolateIcon.svg";
import Straw from "../assets/carrotIcon.svg";
import Carrot from "../assets/strawberryCake.svg";
import Sugar from "../assets/sugarIcon.svg";

import Chicken from "../assets/chicken.svg";
import Cow from "../assets/cow.svg";

// these are icons for Next Up and recipe hints
import Cake from "../assets/regularCake.svg";
import ChocolateCake from "../assets/chocolateCake.svg";
import StrawberryCake from "../assets/strawberryCake.svg";
import CarrotCake from "../assets/carrotCake.svg";
import Base from "../assets/baseIcon.svg";
import Frosting from "../assets/frostingIcon.svg";

// blender models

// import types and stuff
import { CakeLayerType } from "./cakeTypes";

interface assetInformation {
    texture?: string,
    blender?: string,
    /**
     * a 2d representation of the object. It might be in the inventory slot, or part of the recipe hint
     */
    icon: string
}

// now we use a record to enforce that we have every layer mapped to some sort of asset
export const LayerToAssetMap: Record<CakeLayerType, assetInformation> = {
    // fill the stuff in here
    "eggs": {
        icon: Egg,
    },
    "flour": {
        icon: Wheat,
    },
    "butter": {
        icon: Butter
    },
    "sugar": {
        icon: Sugar,
    },
    "strawberry": {
        icon: Straw,
    },
    "chocolate": {
        icon: Chocolate,
    },
    "carrot": {
        icon: Carrot,
    },
    // do all the combos now
    "cake_base": {
        icon: Base,
    },
    "cake_frosting": {
        icon: Frosting,
    },
    "basic_cake": {
        icon: Cake,
    },
    "choco_cake": {
        icon: ChocolateCake,
    },
    "straw_cake": {
        icon: StrawberryCake,
    },
    "carrot_cake": {
        icon: CarrotCake
    }
}

export const PlayerIndexToCharacterIcon = [Chicken, Cow]