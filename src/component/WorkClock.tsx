import {useEffect, useState} from "react";

export default function WorkClock() {
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(new Date());
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [neededHours, setNeededHours] = useState(7.6);
    const [breakMinutes, setBreakMinutes] = useState(30);const [timeLeft, setTimeLeft] = useState<string>("");
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

                setTimeLeft("Fertig 🎉");
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
        setTimeLeft("");
        localStorage.clear();
    }

    useEffect(() => {
        if (!endTime) return;

        const timer = setInterval(() => {
            const now = new Date();
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("Fertig 🎉");
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

    return <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-18">
        <div className="relative p-4 bg-[url('/67052cc631d87fc09b0548b5_0.jpeg')] bg-cover bg-center rounded-4xl border h-64">

            <div className="absolute inset-0 bg-black opacity-40 rounded-4xl"></div>

            <div
                className="relative flex items-center justify-center h-full text-white text-4xl font-semibold drop-shadow-lg">
                Einfach
                <span
                    className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-pink-500">
                    <span className="relative text-white dark:text-gray-950"> Arbeitszeit </span>
                </span>
                berechnen
            </div>
        </div>

        <br/>
        <div
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            {loading ? renderLoading() : started ? renderView(handleReset, startTime, endTime, timeLeft, overtime) : renderSetUp(breakMinutes, setBreakMinutes, neededHours, setNeededHours, startTime, setStartTime, handleStart)}
        </div>
    </div>;
}

function renderLoading() {
    return <div>Loading...</div>
}

function renderView(handleReset: () => void, startTime: Date | null, endTime: Date | null, timeLeft: string, overtime: string | null) {
    return (
        <div className="space-y-6 dark:text-white">
            {startTime && endTime && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">
                        Arbeitszeit läuft
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-white/10 rounded-xl">
                            <p className="text-sm opacity-80">Gestartet um</p>
                            <p className="text-lg font-semibold">
                                {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>

                        <div className="p-4 bg-white/10 rounded-xl">
                            <p className="text-sm opacity-80">Voraussichtliches Ende</p>
                            <p className="text-lg font-semibold">
                                {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>

                        {timeLeft && (
                            <div className="p-4 bg-white/10 rounded-xl col-span-2 text-center">
                                <p className="text-sm opacity-80">Verbleibende Zeit</p>
                                <p className="text-2xl font-bold tracking-wide">
                                    {timeLeft}
                                </p>
                            </div>
                        )}

                        {overtime && (
                            <div className="p-4 bg-white/10 rounded-xl col-span-2 text-center">
                                <p className="text-sm opacity-80">Überstunden</p>
                                <p className="text-2xl font-bold tracking-wide text-white">
                                    {overtime}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={handleReset}
                className="w-full md:w-auto flex justify-center px-6 py-3 rounded-xl shadow-md text-white bg-red-500 hover:bg-red-600 transition"
            >
                Zurücksetzen
            </button>
        </div>
    );
}

function renderSetUp(
    breakMinutes: number, setBreakMinutes: (minutes: number) => void,
    neededHours: number, setNeededHours: (hours: number) => void,
    startTime: Date | null, setStartTime: (time: Date) => void,
    handleStart: () => void) {
    return <div>
        <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
                <label
                    htmlFor="needed_hours"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Benötigte Arbeitsstunden</label>
                <input
                    type="number"
                    id="needed_hours"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="7,6"
                    value={neededHours}
                    onChange={(e) => setNeededHours(parseFloat(e.target.value))}
                    required />
            </div>
            <div>
                <label
                    htmlFor="break_minutes"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pausenzeit (Minuten)</label>
                <input
                    type="number"
                    id="break_minutes"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="30"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
                    required />
            </div>
            <div>
                <label
                    htmlFor="start_time"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Startzeit</label>
                <input
                    type="time"
                    id="start_time"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={
                        startTime
                            ? `${String(startTime.getHours()).padStart(2, "0")}:${String(startTime.getMinutes()).padStart(2, "0")}`
                            : ""
                    }
                    onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":").map(Number);
                        const newTime = new Date();
                        newTime.setHours(hours, minutes, 0, 0);
                        setStartTime(newTime);
                    }}
                />
            </div>
        </div>
        <button
            type="submit"
            onClick={handleStart}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Arbeitszeit starten</button>
    </div>
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
