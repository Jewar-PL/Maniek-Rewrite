import iconInfo from "@/assets/icons/info.png";
import iconMap from "@/assets/icons/map.png";
import iconMinigames from "@/assets/icons/minigames.png";

import NavButton from "./NavButton";

function Navbar() {
    return (
        <nav className="fixed bottom-4 left-[50%] translate-x-[-50%] w-lg h-16 flex justify-center items-center z-20"> 
            <NavButton to="/">
                <NavButton.Image src={iconMap} />
                <NavButton.Caption>Mapa</NavButton.Caption>
            </NavButton>
            <NavButton to="/info">
                <NavButton.Image src={iconInfo} />
                <NavButton.Caption>Info</NavButton.Caption>
            </NavButton>
            <NavButton to="/minigames">
                <NavButton.Image src={iconMinigames} />
                <NavButton.Caption>Minigry</NavButton.Caption>
            </NavButton>
        </nav>
    )
}

export default Navbar