// contains cake object and cake logic
import { RoundedBox } from "@react-three/drei";

export default function Platform() {
    return (
        <RoundedBox position={[0, -.5, 0]} args={[.8, 0.1, 0.8]}>
            <meshStandardMaterial />
        </RoundedBox >
    )
}
