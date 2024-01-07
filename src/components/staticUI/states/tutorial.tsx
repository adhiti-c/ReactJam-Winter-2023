import React, { useState } from "react";
import { div } from "three/examples/jsm/nodes/Nodes.js";
import cowIcon from '../../../assets/characters/cowLobby.svg'
import chickenIcon from '../../../assets/characters/chickenLobby.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faForward, faRightFromBracket, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../../assets/sweetStackLogo.svg'
import TutorialPage from "../../TutorialPage";
// images
import Cakes from '../../../assets/tutorial/tutorial1.svg'
import Ingredients from '../../../assets/tutorial/tutorial2.svg'
import Blocks from '../../../assets/tutorial/tutorial3.svg'
import Stack from '../../../assets/tutorial/tutorial4.svg'
import Flavors from '../../../assets/tutorial/tutorial5.svg'
import Lava from '../../../assets/tutorial/tutorial6.svg'
import useSound from "use-sound";
import clickSound from '../../../assets/clickSound.wav'

export default function TutorialIUI() {
    const [currentPage, setCurrentPage] = useState(1);
    console.log('page number', currentPage)
    const handleBack = () => {
        // decrements page by decreasing by 1
        // 1 is set as the minimum index (first page)
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    const handleForward = () => {

        const totalPages = 6;
        playClickSound();
        // increments pages by 1 but ensures the max at total pages
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
    }
    //* sets visibility of the page
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setCurrentPage(1);
        playClickSound();
        const TutorialContain = document.querySelector('.tutorial-contain')
        if (TutorialContain) {
            TutorialContain.classList.add('close-tutorial');
        }

    }
    // const RemoveTutorialClass = () => {
    //     const TutorialContain = document.querySelector('.tutorial-contain')
    //     if (TutorialContain) {
    //         TutorialContain.classList.remove('close-tutorial');
    //     }
    // }
    //* play click sound on hover
    const [playClickSound] = useSound(clickSound, { volume: 0.5 })
    const handleHover = () => {
        playClickSound();
    }

    return (
        <>

            <div className="tutorial-contain">
                <img src={Logo} style={{ marginBottom: '12px' }} />

                {/* contains page with buttons */}
                <div className="tutorial-inner-contain">

                    {/* renders diff popups based on state */}
                    {currentPage === 1 && <TutorialPageFirst />}
                    {currentPage === 2 && (<TutorialPage currentPage={currentPage} title={<h2>you and your teammate are given <span>2 ingredients</span></h2>} img={Ingredients} />)}
                    {currentPage === 3 && (<TutorialPage currentPage={currentPage} title={<h2> <span>combine </span>them to create the base and frosting</h2>} img={Blocks} />)}
                    {currentPage === 4 && (<TutorialPage currentPage={currentPage} title={<h2><span>tap</span> to build layers!</h2>} img={Stack} />)}
                    {currentPage === 5 && (<TutorialPage currentPage={currentPage} title={<h2>and... a <span>secret flavor</span></h2>} img={Flavors} />)}
                    {currentPage === 6 && <TutorialPageLast />}

                    {/* back and forth buttons */}
                    <div className="buttons-contain">
                        {/* disabled means users cant access it */}
                        <button onClick={handleBack} onMouseEnter={handleHover} className='back-button' disabled={currentPage === 1}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button onClick={handleForward} onMouseEnter={handleHover} className='forward-button' disabled={currentPage === 6}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>

                </div>
                {/* exit button */}
                <div className="exit-button-contain">
                    <button className="exit-tutorial-button" onClick={handleClose} onMouseEnter={handleHover}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Exit tutorial mode
                    </button>
                </div>

            </div>
        </>
    )
}

// popup styling for the first and last pages
const TutorialPageFirst = () =>
    <div className="tutorial-page-contain">
        <div className="top-content-contain">
            <img src={cowIcon} alt="" />
            <h1>how to play</h1>
            <img src={chickenIcon} alt="" />
        </div>
        <div>
            <h2 style={{ marginBottom: '4px', backgroundColor: 'var(--pink)', color: '#fff', width: 'fit-content', padding: 'auto 4px' }}>goal</h2>

            <h2><span>build a cake!</span> &nbsp;
                The catch: you and your teammate are given <span>different ingredients</span> which you must combine to win!</h2>
        </div>
        <img src={Cakes} alt="" />
    </div>

const TutorialPageLast = () =>
    <div className="tutorial-page-contain last" style={{ padding: '22px 0px 0px 0px;' }}>
        <p>but be careful..</p>
        <h2><span>syrup </span>will be rising the entire time! Make sure your cake <span>doesn’t get engulfed</span></h2>
        <img src={Lava} alt="" />
    </div>
