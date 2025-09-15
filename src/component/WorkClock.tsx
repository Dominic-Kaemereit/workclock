import {useEffect, useState} from "react";
import WorkClockView from "@/component/WorkTimeView";
import LoadingView from "@/component/LoadingView";
import SetupView from "@/component/SetupView";

export default function WorkClock() {
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(new Date());
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [neededHours, setNeededHours] = useState(7.6);
    const [breakMinutes, setBreakMinutes] = useState(30);const [timeLeft, setTimeLeft] = useState<string | null>("");
    const [overtime, setOvertime] = useState<string | null>(null);

    useEffect(() => {
        const savedStart = localStorage.getItem("startTime");
        const savedEnd = localStorage.getItem("endTime");
        const savedHours = localStorage.getItem("neededHours");
        const savedBreak = localStorage.getItem("breakMinutes");

        if (savedStart && savedEnd) {
            const start = new Date(savedStart);
            const end = new Date(savedEnd);

            const today = new Date();
            if (
                start.getDate() === today.getDate() &&
                start.getMonth() === today.getMonth() &&
                start.getFullYear() === today.getFullYear()
            ) {
                setStarted(true);
                setStartTime(start);
                setEndTime(end);
                if (savedHours) setNeededHours(parseFloat(savedHours));
                if (savedBreak) setBreakMinutes(parseInt(savedBreak));
            } else {
                localStorage.clear();
            }
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!endTime) return;

        const timer = setInterval(() => {
            const now = new Date();
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                // Überstunden berechnen
                const overtimeMs = Math.abs(diff);
                const hours = Math.floor(overtimeMs / (1000 * 60 * 60));
                const minutes = Math.floor((overtimeMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((overtimeMs % (1000 * 60)) / 1000);

                setTimeLeft(null);
                setOvertime(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                // Normale Restzeit
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                setOvertime(null);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    const handleStart = () => {
        if (!startTime) return;

        const end = calculateEndTime(startTime, neededHours, breakMinutes); setStarted(true);
        setEndTime(end);
        localStorage.setItem("startTime", startTime.toISOString());
        localStorage.setItem("endTime", end.toISOString());
        localStorage.setItem("neededHours", neededHours.toString());
        localStorage.setItem("breakMinutes", breakMinutes.toString());
    };


    const handleReset = () => {
        setStarted(false);
        setStartTime(new Date());
        setEndTime(null);
        setTimeLeft(null);
        localStorage.clear();
    }

    useEffect(() => {
        if (!endTime) return;

        const timer = setInterval(() => {
            const now = new Date();
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft(null);
                clearInterval(timer);
                localStorage.clear();
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return <div>
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{ backgroundImage: "url('/67052cc631d87fc09b0548b5_0.jpeg')" }}
        >
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90">
                <div className="relative overflow-hidden">
                    <div className="h-72">
                        <div className="absolute inset-0" />
                        <div className="relative z-10 flex items-center justify-center h-full px-4">
                            <div className="text-center max-w-4xl">
                                <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance leading-tight text-gray-900 dark:text-white">
                                    Einfach{" "}
                                    <span className="relative inline-block">
                  <span className="relative z-10 text-black dark:text-white bg-accent dark:bg-blue-600 px-4 py-2 rounded-xl shadow-lg">
                    Arbeitszeit
                  </span>
                </span>{" "}
                                    berechnen
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    loading ? <LoadingView /> :
                        started ? <WorkClockView
                                handleReset={handleReset}
                                startTime={startTime}
                                endTime={endTime}
                                timeLeft={timeLeft}
                                overtime={overtime}
                            /> :
                            <SetupView
                                breakMinutes={breakMinutes}
                                setBreakMinutes={setBreakMinutes}
                                neededHours={neededHours}
                                setNeededHours={setNeededHours}
                                startTime={startTime}
                                setStartTime={setStartTime}
                                handleStart={handleStart}
                            />
                }
            </div>
        </div>
    </div>;
}

function calculateEndTime(
    startTime: Date,
    neededHours: number,
    breakMinutes: number
): Date {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + Math.floor(neededHours));
    endTime.setMinutes(endTime.getMinutes() + (neededHours % 1) * 60);
    endTime.setMinutes(endTime.getMinutes() + breakMinutes);
    return endTime;
}
