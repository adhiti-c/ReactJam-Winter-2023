
function InventorySlot({ icon, onClick, className }: { icon: string, onClick: Function, className?:string }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <div style={{width: 'fit-content'}}>
      <button className={`inventory-slot ${className}`} onClick={handleClick}>
        <img src={icon} />
      </button>
    </div>
  )
}

export default InventorySlot

