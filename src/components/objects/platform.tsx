// contains cake object and cake logic
import { RoundedBox } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function Platform() {
    return (
        <RigidBody type="fixed">
            <RoundedBox position={[0, -.5, 0]} args={[.8, 0.1, 0.8]}>
                <meshStandardMaterial />
            </RoundedBox >
        </RigidBody>
    )
}
