import { periods, useBellSchedule } from "@/hooks/useBellSchedule";
import winkCentered from "@/assets/faces/wink-centered.gif";

import VideoPlayer from "@/components/VideoPlayer";

// TODO: Move localhost address into some constant perhaps
function TVPlayer() {
  const { clock, state } = useBellSchedule();

  return (
    <main className="
      m-0 overflow-hidden bg-black text-tv-green font-digital 
      flex justify-center items-center flex-col
    ">
      {/* TODO: Make these calcs prettier */}
      <div className="flex w-[calc(100%-1rem)] h-[calc(100vh-9rem)]">
        <VideoPlayer />

        <div className="
          text-bell-schedule border-3 border-b-0 border-solid border-tv-green 
          text-nowrap w-[20%] flex flex-col justify-evenly items-center
        ">
          <h4 className="font-bold m-0 text-tv-header">lekcja / godz</h4>
          {periods.map((p, i) => (
            <span
              key={i}
              className={ state.mode !== "none" && state.lesson === i ? "text-tv-lawngreen scale-105" : "scale-90" }
            >
              {i} / {`${p.start} - ${p.end.padStart(2, "0")}`}
            </span>
          ))}
        </div>
      </div>

      <div className="
        h-36 w-[calc(100%-1rem)] flex relative justify-between items-center 
        p-2 border-3 border-tv-green border-solid box-border text-bottom-controls
      ">
        <div>
          { state.mode === "none" && (
            <p className="m-4 text-tv-lawngreen">BRAK LEKCJI</p>
          )}

          { state.mode === "lesson" && (
            <p className="m-4">
              Koniec lekcji za:&nbsp;
              <span className="text-tv-lawngreen">
                <span className="text-big-timer">{state.minutesLeft}</span>min
              </span>
            </p>
          )}

          { state.mode === "break" && (
            <p className="m-4">
              Koniec przerwy za:&nbsp;
              <span className="text-tv-lawngreen">
                <span className="text-big-timer">{state.minutesLeft}</span>min
              </span>
            </p>
          )}
        </div>

        <img src={winkCentered} alt="Mrugający Maniek" className="w-auto h-[125%] max-h-48"/>

        <div>
          <p className="m-4">{ clock }</p>
        </div>
      </div>
    </main>
  )
}

export default TVPlayer
