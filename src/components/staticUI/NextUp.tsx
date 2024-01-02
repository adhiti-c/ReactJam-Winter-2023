import React from "react";
import { GameState } from "../../logic_v2/types";
import LayerData from "./data/LayerData";

interface NextUpProps {
  layerName: GameState["goals"]["current"];
}

function NextUp({ layerName }: NextUpProps) {
  // returns based on the string layername a string
  const FindImage = (layerName: string): string | undefined => {
    const matchingLayer = LayerData.find(
      (layer) => layer.layerName === layerName,
    );
    return matchingLayer ? matchingLayer.img : undefined;
  };
  // finds image of layer based on the name of the layer by parsing through the LayerDataFile and returning the img string of the matching layer
  const LayerImage = FindImage(layerName);
  return (
    <div className="nextup-contain">
      <h2>next up</h2>
      <img src={LayerImage} />
    </div>
  );
}

export default NextUp;
