import { NavLink, type NavLinkProps } from "react-router";

import iconInfo from "@/assets/icons/info.png";
import iconMap from "@/assets/icons/map.png";
import iconMinigames from "@/assets/icons/minigames.png";

type NavButtonProps = NavLinkProps & {
    name: string,
    iconSrc: string,
};

function NavButton({ to, end, name, iconSrc }: NavButtonProps) {
    return (
        <NavLink to={to} end={end} className="hoverable-button">
            <img className="w-full h-full z-2" src={iconSrc} alt={name} />
            <p className="
                z-10 absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[30%] m-0 text-center font-determination
                text-white text-xl font-bold shadow-navbutton pointer-events-none
            ">
                {name}
            </p>
        </NavLink>
    )
}

function Navbar() {
    return (
        <nav className="fixed bottom-4 left-[50%] translate-x-[-50%] w-lg h-16 flex justify-center items-center z-20"> 
            <NavButton name="Mapa" iconSrc={iconMap} to="/" end/>
            <NavButton name="Info" iconSrc={iconInfo} to="/info" end/>
            <NavButton name="Minigry" iconSrc={iconMinigames}  to="/minigames" />
        </nav>
    )
}

export default Navbar