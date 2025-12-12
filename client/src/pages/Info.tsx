import "./Info.css";

import iconFB from "@/assets/icons/sm-facebook.png";
import iconIG from "@/assets/icons/sm-insta.png";
import iconZSP from "@/assets/icons/sm-zsp.png";
import iconPIT from "@/assets/icons/sm-podatek.png";

function Info() {
    return (
        <>
            {/* INFO CONTAINER */}
            <div className="relative min-w-40 p-8 rounded-4xl text-center flex justify-center items-center max-h-[calc(100vh-5rem)]">

                {/* PROMO */}
                <div className="relative flex flex-col justify-center items-center gap-2">

                    {/* SOCIALS */}
                    <div className="w-full flex justify-center items-center gap-4 px-8">
                        <img className="socials-image" src={iconFB} alt="Facebook" />
                        <img className="socials-image" src={iconIG} alt="Instagram" />
                        <img className="socials-image" src={iconZSP} alt="Strona szkoły" />
                        <img className="socials-image" src={iconPIT} alt="1.5% podatku" />
                    </div>

                    {/* SCREENSHOTS */}
                    <div className="w-auto h-100 max-h-[50vh] ???">

                    </div>
                </div>
            </div>
        </>
    )
}

export default Info;