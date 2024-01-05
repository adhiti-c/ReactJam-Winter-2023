import React from "react";
import { GameState } from "../../logic_v2/types";
import { LayerToAssetMap } from "../../logic_v2/assetMap";

interface NextUpProps {
  layerName: GameState["goals"]["current"];
}

function NextUp({ layerName }: NextUpProps) {
  // finds the icon for the current goal
  const LayerImage = LayerToAssetMap[layerName].icon;
  return (
    <div className="nextup-contain">
      <h2>next up</h2>
      <img src={LayerImage} />
    </div>
  );
}

export default NextUp;
