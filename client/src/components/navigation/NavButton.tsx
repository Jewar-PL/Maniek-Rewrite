// TODO: Rework props in these components

import type { ReactNode } from "react";
import { NavLink, type NavLinkProps } from "react-router";

import "./NavButton.css";

function NavButtonImage({ src, alt }: { src: string, alt?: string }) {
    return <img className="w-full h-full z-2" src={src} alt={alt} />;
}

function NavButtonCaption({ children }: { children?: ReactNode }) {
    return (
        <p className="
            z-10 absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[30%] m-0 text-center
            font-determination text-white text-xl font-bold navbutton-shadow pointer-events-none
        ">
            {children}
        </p>
    )
}

type NavButtonProps = NavLinkProps & {
    children?: ReactNode
};

function NavButton({ to, end, children, ...props }: NavButtonProps) {
    return (    
        <NavLink 
            to={to} 
            end={end} 
            className={({ isActive }) => `navbutton ${isActive && "navbutton-selected"}`}
            {...props}
        >
            {children}
        </NavLink>
    );
}

NavButton.Image = NavButtonImage;
NavButton.Caption = NavButtonCaption;

export default NavButton
