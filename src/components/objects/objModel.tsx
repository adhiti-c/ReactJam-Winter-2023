import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { CakeLayerType } from '../../logic_v2/cakeTypes'
import { Vector3 } from 'three'
import { LayerToAssetMap } from "../../logic_v2/assetMap";
import { useLoader } from '@react-three/fiber';


export default function ObjModel({ texture }: { texture: CakeLayerType, }) {
    const assetMap = LayerToAssetMap[texture];
    let colorMap;
    if (assetMap.mtl) {
        const materials = useLoader(MTLLoader, assetMap.mtl);
        colorMap = useLoader(OBJLoader, assetMap.block, loader => {
            materials.preload();
            loader.setMaterials(materials);
        });
    } else {
        throw Error("no MTL file defined for blender object " + texture);
    }

    if (colorMap === undefined) {
        throw Error(`Error while loading in the obj file for ${texture}`)
    }

    return (
        <instancedMesh
            // position={position}
            // the subtraction is to compensate for the weirdly positioned cake assets
            // position={new Vector3(position.x - 0.015, position.y, position.z - 0.1)}
            scale={0.37}>
            {/* https://discourse.threejs.org/t/duplicate-same-model-in-a-canvas-react-three-fiber/50913/5 */}
            <primitive object={colorMap.clone()} />
        </instancedMesh>
    )
}