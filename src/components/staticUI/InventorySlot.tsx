
function InventorySlot({ icon, onClick }: { icon: string, onClick: Function }) {
  const handleClick = () => {
    // Call the onClick function passed as a prop that can be called in <Resourceitems />
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

