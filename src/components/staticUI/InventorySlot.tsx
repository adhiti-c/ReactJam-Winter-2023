
function InventorySlot({ icon, onClick }: { icon: string, onClick: Function }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <div>
      <button className='inventory-slot' onClick={handleClick}>
        <img src={icon} />
      </button>
    </div>
  )
}

export default InventorySlot

