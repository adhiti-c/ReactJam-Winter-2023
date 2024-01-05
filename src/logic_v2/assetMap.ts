// this is our CakeLayerType to asset bible

// import all the assets

// 2d icons
import Butter from "../assets/icons/butterIcon.svg";
import Egg from "../assets/icons/eggIcon.svg";
import Wheat from "../assets/icons/wheatIcon.svg";
import Chocolate from "../assets/icons/chocolateIcon.svg";
import Straw from "../assets/icons/strawberryCake.svg";
import Carrot from "../assets/icons/carrotIcon.svg";
import Sugar from "../assets/icons/sugarIcon.svg";

import Chicken from "../assets/characters/chicken.svg";
import Cow from "../assets/characters/cow.svg";

// these are icons for Next Up and recipe hints
import Cake from "../assets/icons/regularCake.svg";
import ChocolateCake from "../assets/icons/chocolateCake.svg";
import StrawberryCake from "../assets/icons/strawberryCake.svg";
import CarrotCake from "../assets/icons/carrotCake.svg";
import Base from "../assets/icons/baseIcon.svg";
import Frosting from "../assets/icons/frostingIcon.svg";

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