// ! THIS COMPONENT USES LEGACY MAP FROM ORIGINAL KIOSK, MUST BE REFACTORED ASAP

import { useRef, useEffect } from "react";
import "./LegacyMap.css";

import logo from "@/assets/icons/zsp9.png";
import locationPin from "@/assets/map/pin.png";
import plus from "@/assets/map/other/add.png";
import minus from "@/assets/map/other/minus.png";
import reset from "@/assets/map/other/reset.png";

import floor0 from "@/assets/map/Floor0.png";
import floor1 from "@/assets/map/Floor1.png";
import floor2A from "@/assets/map/Floor2A.jpg";
import floor2B from "@/assets/map/Floor2B.jpg";
import floor2Back from "@/assets/map/Floor2-back.png";

function LegacyMap() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        //@ts-ignore
        import("./map.js");
    }, []);

    return (
        <div ref={mapRef} className="map-container">
            <p className="dev-coordinates"></p>
        
            <div className="logo-container">
                <img className="logo" src={logo} alt="ZSP9" />


                <div className="floor-info">
                    <p>
                        <span className="floorTitle">PARTER</span> <br />
                        <span className="floorText">Budynki A i B</span>
                    </p>
                </div>

                <div className="room-selection scrollable hidden">
                    <div className="floor Floor0">
                        <p className="mainText">Parter</p>
                    </div>
                    <div className="floor Floor1">
                        <p className="mainText">Piętro 1</p>
                    </div>
                    <div className="floor Floor2A">
                        <p className="mainText">Piętro 2 (A)</p>
                    </div>
                    <div className="floor Floor2B">
                        <p className="mainText">Piętro 2 (B)</p>
                    </div>
                    
                </div>

                <div className="room-selection-button">
                    <img src={locationPin} />
                    <p className="room-selection-text">Nawigacja</p>
                </div>


            </div>

            <p className="currentPath">&gt; Wybierz drogę &lt;</p>

            <div className="scale">
                <button className="plus">
                    <img src={plus} alt="+" />
                </button>
                <p>POWIĘKSZ <br /> <span className="scale-num">1.0x</span></p>
                <button className="minus">
                    <img src={minus} alt="-" />
                </button>

                <button className="reset">
                    <img src={reset} alt="/" />
                </button>
                <div className="reset">
                    {/* Background extension for reset (???) */}
                </div>
            </div>

            <div className="map" style={{ cursor: "grab" }}>
                <div className="layers Floor0">
                    <img className="map-layer" src={floor0} />
                    <canvas className="canvas-layer"></canvas>
                    <div className="button-layer"></div>
                </div>

                <div className="layers Floor1">
                    <img className="map-layer" src={floor1} />
                    <canvas className="canvas-layer"></canvas>
                    <div className="button-layer"></div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <div className="layers Floor2A">
                        <img className="map-layer" src={floor2A} />
                        <canvas className="canvas-layer"></canvas>
                        <div className="button-layer"></div>
                    </div>

                    <div className="layers Floor2-back">
                        <img className="map-layer" src={floor2Back} />
                        <canvas className="canvas-layer"></canvas>
                        <div className="button-layer"></div>
                    </div>

                    <div className="layers Floor2B">
                        <img className="map-layer" src={floor2B} />
                        <canvas className="canvas-layer"></canvas>
                        <div className="button-layer"></div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default LegacyMap;