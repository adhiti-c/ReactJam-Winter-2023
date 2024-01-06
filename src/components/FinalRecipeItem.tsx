import React from 'react'

function FinalRecipeItem({img}:{img:string}) {
    const finalContainerStyle = {
        
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '60px',
            height: '60px',
            // borderRadius: '22px',
            overflow: 'visible',
            // border: '2px solid #fff',
  padding: '0',
        
    }
  return (
    <div style={finalContainerStyle}>
      {/* <img src={img} /> */}
    </div>
  )
}

export default FinalRecipeItem
