import React from 'react'

function TutorialPage({currentPage, title, img}:{currentPage: number, title: React.ReactNode, img: string}) {
  return (
    <div className='tutorial-page-contain'>
      <div className="top-contain">
        <div className="number-contain">
            {currentPage}
            
        </div>
        
            {title}
        
      </div>
      <img src={img} alt="" />
    </div>
  )
}

export default TutorialPage
