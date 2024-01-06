import React, { useState } from "react";
import { div } from "three/examples/jsm/nodes/Nodes.js";
import cowIcon from '../../../assets/characters/cowLobby.svg'
import chickenIcon from '../../../assets/characters/chickenLobby.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faForward } from '@fortawesome/free-solid-svg-icons';

export default function TutorialIUI() {
    const [currentPage, setCurrentPage] = useState(1);
    
    const handleBack = () => {
        // decrements page by decreasing by 1
        // 1 is set as the minimum index (first page)
        setCurrentPage((prevPage) => Math.max(prevPage -1, 1));
    }
    const handleForward = () => {
        const totalPages = 6;
        // increments pages by 1 but ensures the max at total pages
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
    }
    //* sets visibility of the page
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        const TutorialContain = document.querySelector('.tutorial-contain')
        if (TutorialContain) {
            TutorialContain.classList.add('close-tutorial');
        }
    }
    return (
        <>
       
        <div className="tutorial-contain">
            {/* renders diff popups based on state */}
            {currentPage === 1 && <TutorialPageFirst />}
        
        {/* back and forth buttons */}
        <div className="buttons-contain">
            {/* disabled means users cant access it */}
                <button onClick={handleBack} className='back-button' disabled={currentPage === 1}>
                Back
            </button>
            <button onClick={handleForward} className='forward-button' disabled={currentPage === 6}>
                <FontAwesomeIcon icon={faForward}/>
            </button>
        </div>
        <button className="exit-tutorial-button" onClick={handleClose}>
            Exit tutorial mode
        </button>
        </div>
        </>
    )
}

// popup styling for the first and last pages
const TutorialPageFirst= () =>
<div className="tutorial-page-contain">
    <div className="top-content-contain">
        <img src={cowIcon} alt="" />
         <h1>how to play</h1>
         <img src={chickenIcon} alt="" />
    </div>
    <h2 style={{backgroundColor: 'var(--pink)', color: '#fff'}}>goal</h2>
    <h2><span>build a cake!</span>
         The catch: you and your teammate are given <span>different ingredients</span> which you must combine to win!</h2>
</div>