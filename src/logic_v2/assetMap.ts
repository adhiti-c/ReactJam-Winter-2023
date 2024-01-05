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

// textures
import BaseTexture from "../assets/textures/baseBlock.svg";
import ButterTexture from "../assets/textures/butterBlock.svg";
import SugarTexture from "../assets/textures/sugarBlock.svg";
import WheatTexture from "../assets/textures/wheatBlock.svg";
import FrostingTexture from "../assets/textures/frostingBlock.svg";

// blender models

// import types and stuff
import { CakeLayerType } from "./cakeTypes";

interface assetInformation {
    /**
     * a flag stating whether this is representing in three as a blender object
     */
    isBlenderObj: boolean,
    /**
     * the texture or the blender block path
     */
    block: string,
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
        isBlenderObj: false,
        block: WheatTexture, // TODO: add an egg texture
    },
    "flour": {
        icon: Wheat,
        isBlenderObj: false,
        block: WheatTexture,
    },
    "butter": {
        icon: Butter,
        isBlenderObj: false,
        block: ButterTexture,
    },
    "sugar": {
        icon: Sugar,
        isBlenderObj: false,
        block: SugarTexture,
    },
    "strawberry": {
        icon: Straw,
        isBlenderObj: false, // TODO: make this true
        block: WheatTexture, // TODO: update with strawberry blender model
    },
    "chocolate": {
        icon: Chocolate,
        isBlenderObj: false, // TODO: make this true
        block: WheatTexture, // TODO: update with chocolate blender model
    },
    "carrot": {
        icon: Carrot,
        isBlenderObj: false, // TODO: make this true
        block: WheatTexture, // TODO: update with carrot blender model
    },
    // do all the combos now
    "cake_base": {
        icon: Base,
        isBlenderObj: false,
        block: BaseTexture,
    },
    "cake_frosting": {
        icon: Frosting,
        isBlenderObj: false,
        block: FrostingTexture,
    },
    "basic_cake": {
        icon: Cake,
        isBlenderObj: false, // TODO: make this true
        block: WheatTexture, // TODO: update this with blender
    },
    "choco_cake": {
        icon: ChocolateCake,
        isBlenderObj: false, // TODO: make this true
        block: WheatTexture, // TODO: update this with blender
    },
    "straw_cake": {
        icon: StrawberryCake,
        isBlenderObj: false, // TODO: make true
        block: WheatTexture, // TODO: update with blender
    },
    "carrot_cake": {
        icon: CarrotCake,
        isBlenderObj: false, // TODO: make true,
        block: WheatTexture, // TODO: update with blender
    }
}

export const PlayerIndexToCharacterIcon = [Chicken, Cow]