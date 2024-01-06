import useSound from "use-sound";
import clickSound from '../..//assets/clickSound.wav'

function InventorySlot({
  icon,
  onClick,
  className,
}: {
  icon: string;
  onClick: Function;
  className?: string;
}) {
  // sound trigger
  const [playClickSound] = useSound(clickSound, {volume: 0.5})
  const handleClick = () => {
    if (onClick) {
      onClick();
      playClickSound();
    }
  };
  const handleEnter = () => {
    playClickSound();
  }
  return (
    <div style={{ width: "fit-content" }}>
      <button className={`inventory-slot ${className}`} onClick={handleClick} onMouseEnter = {handleEnter}>
        <img src={icon} />
      </button>
    </div>
  );
}

export default InventorySlot;
