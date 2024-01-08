import { useEffect } from "react"
import StopSound from "../../../assets/stopSound.wav"

export default function StopUI() {

    useEffect(() => {
        playSound("stopSound")
    }, [])

    function playSound(soundId: string) {
        const sound = document.getElementById(soundId) as HTMLAudioElement;
        if (sound) {
            sound.play();
        }
    }

    return (
        <>
            <div className="feedback failure">
                <h1>
                    Time's Up!
                </h1>
            </div>
            <audio id="stopSound" preload="auto">
                <source src={StopSound} type="audio/wav" />
            </audio>
        </>
    )
}