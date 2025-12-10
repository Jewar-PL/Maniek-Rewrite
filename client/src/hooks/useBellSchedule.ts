import { useEffect, useState } from "react";

export const periods = [
    { start: "7:05", end: "7:50" },
    { start: "8:00", end: "8:45" },
    { start: "8:55", end: "9:40" },
    { start: "9:50", end: "10:35" },
    { start: "10:55", end: "11:40" },
    { start: "11:50", end: "12:35" },
    { start: "12:45", end: "13:30" },
    { start: "13:40", end: "14:25" },
    { start: "14:35", end: "15:20" },
    { start: "15:25", end: "16:10" },
];

function toMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
}

type LessonState = 
    | { mode: "none" }
    | { mode: "lesson" | "break", lesson: number, minutesLeft: number };

function getLessonState(now: Date): LessonState {
    const total = now.getHours() * 60 + now.getMinutes();
    const first = toMinutes("7:05");
    const last = toMinutes("16:10");

    if (total < first || total > last) {
        return { mode: "none" };
    }

    for (let i = 0; i < periods.length; i++) {
        const current = periods[i];
        const start = toMinutes(current.start);
        const end = toMinutes(current.end);

        if (total >= start && total < end) {
            return {
                mode: "lesson",
                lesson: i,
                minutesLeft: end - total,
            };
        }

        const nextStart = periods[i + 1]?.start
            ? toMinutes(periods[i + 1].start)
            : null;

        if (nextStart && total >= end && total < nextStart) {
            return { 
                mode: "break", 
                lesson: i + 1, 
                minutesLeft: nextStart - total 
            };
        }
    }

    return { mode: "none" };
}

type BellSchedule = { clock: string, state: LessonState };

export function useBellSchedule(): BellSchedule {
    const [clock, setClock] = useState("00:00");
    const [state, setState] = useState(() => getLessonState(new Date()));

    useEffect(() => {
        function tick() {
            const now = new Date();

            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            setClock(`${hours}:${minutes}`);

            setState(getLessonState(now));
        }

        tick();
        const t = setInterval(tick, 1000);
        return () => clearInterval(t);
    }, []);

    return { clock, state };
}