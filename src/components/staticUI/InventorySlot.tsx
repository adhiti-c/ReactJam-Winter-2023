import React from 'react'
import PropTypes from 'prop-types';
function InventorySlot({icon, onClick}) {
  const handleClick = () => {
    // Call the onClick function passed as a prop that can be called in <Resourceitems />
    if (onClick) {
      onClick();
    }
  };
  return (
    <div>
      <button className='inventory-slot' onClick={handleClick}>
        <img src={icon}/>
      </button>
    </div>
  )
}
InventorySlot.propTypes = {
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func, 
};
export default InventorySlot

