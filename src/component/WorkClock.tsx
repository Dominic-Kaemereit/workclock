import { useEffect, useState } from "react";
import WorkClockView from "@/component/WorkTimeView";
import LoadingView from "@/component/LoadingView";
import SetupView from "@/component/SetupView";

const DEFAULT_NEEDED_HOURS = 7.6;
const DEFAULT_BREAK_MINUTES = 30;

function getInitialStartTime(): Date {
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
}

function clearTimerSession() {
    localStorage.removeItem("startTime");
    localStorage.removeItem("endTime");
}

function parseValidNumber(value: string | null, fallback: number, min: number, max: number): number {
    if (value === null) return fallback;
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
        return fallback;
    }
    return parsed;
}

export default function WorkClock() {
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(getInitialStartTime);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [neededHours, setNeededHours] = useState(DEFAULT_NEEDED_HOURS);
    const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);
    const [timeLeft, setTimeLeft] = useState<string | null>("");
    const [overtime, setOvertime] = useState<string | null>(null);
    const [resetOnOvertimeReload, setResetOnOvertimeReload] = useState(false);
    const [resetOnNextDay, setResetOnNextDay] = useState(true);

    useEffect(() => {
        const savedStart = localStorage.getItem("startTime");
        const savedEnd = localStorage.getItem("endTime");
        const savedHours = localStorage.getItem("neededHours");
        const savedBreak = localStorage.getItem("breakMinutes");
        const savedResetOvertime = localStorage.getItem("resetOnOvertimeReload");
        const savedResetNextDay = localStorage.getItem("resetOnNextDay");

        const shouldResetOnOvertime = savedResetOvertime !== null ? savedResetOvertime === "true" : false;
        const shouldResetOnNextDay = savedResetNextDay !== null ? savedResetNextDay === "true" : true;

        setResetOnOvertimeReload(shouldResetOnOvertime);
        setResetOnNextDay(shouldResetOnNextDay);
        setNeededHours(parseValidNumber(savedHours, DEFAULT_NEEDED_HOURS, 0.1, 24));
        setBreakMinutes(Math.round(parseValidNumber(savedBreak, DEFAULT_BREAK_MINUTES, 0, 1440)));

        if (savedStart && savedEnd) {
            const start = new Date(savedStart);
            const end = new Date(savedEnd);
            const now = new Date();

            const hasValidDates = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime());

            if (!hasValidDates) {
                clearTimerSession();
            } else {
                const isSameDay =
                    start.getDate() === now.getDate() &&
                    start.getMonth() === now.getMonth() &&
                    start.getFullYear() === now.getFullYear();

                const isInOvertime = end.getTime() - now.getTime() <= 0;

                const shouldReset =
                    (shouldResetOnNextDay && !isSameDay) ||
                    (shouldResetOnOvertime && isInOvertime);

                if (!shouldReset) {
                    setStarted(true);
                    setStartTime(start);
                    setEndTime(end);
                } else {
                    clearTimerSession();
                }
            }
        }

        setLoading(false);
    }, []);

    const handleNeededHoursChange = (hours: number) => {
        setNeededHours(hours);
        if (Number.isFinite(hours) && hours >= 0.1 && hours <= 24) {
            localStorage.setItem("neededHours", hours.toString());
        }
    };

    const handleBreakMinutesChange = (minutes: number) => {
        setBreakMinutes(minutes);
        if (Number.isFinite(minutes) && minutes >= 0 && minutes <= 1440) {
            localStorage.setItem("breakMinutes", Math.round(minutes).toString());
        }
    };

    const handleResetOnOvertimeReloadChange = (value: boolean) => {
        setResetOnOvertimeReload(value);
        localStorage.setItem("resetOnOvertimeReload", String(value));
    };

    const handleResetOnNextDayChange = (value: boolean) => {
        setResetOnNextDay(value);
        localStorage.setItem("resetOnNextDay", String(value));
    };

    useEffect(() => {
        if (!endTime || Number.isNaN(endTime.getTime())) {
            document.title = "WorkClock";
            return;
        }

        const updateCountdown = () => {
            const now = new Date();
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                // Überstunden berechnen
                const overtimeMs = Math.abs(diff);
                const hours = Math.floor(overtimeMs / (1000 * 60 * 60));
                const minutes = Math.floor((overtimeMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((overtimeMs % (1000 * 60)) / 1000);

                const formattedOvertime = `${hours}h ${minutes}m ${seconds}s`;
                setTimeLeft(null);
                setOvertime(formattedOvertime);
                document.title = `+${hours}h ${minutes}m (Überstunden) | WorkClock`;
            } else {
                // Normale Restzeit
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                const formattedTimeLeft = `${hours}h ${minutes}m ${seconds}s`;
                setTimeLeft(formattedTimeLeft);
                setOvertime(null);
                document.title = `${hours}h ${minutes}m verbleibend | WorkClock`;
            }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [endTime]);

    const handleStart = () => {
        const validStart = startTime && !Number.isNaN(startTime.getTime()) ? startTime : getInitialStartTime();
        const validHours = Number.isFinite(neededHours) && neededHours > 0 ? Math.min(neededHours, 24) : DEFAULT_NEEDED_HOURS;
        const validBreak = Number.isFinite(breakMinutes) && breakMinutes >= 0 ? Math.min(Math.round(breakMinutes), 1440) : DEFAULT_BREAK_MINUTES;

        const normalizedStart = new Date(validStart);
        normalizedStart.setSeconds(0, 0);

        const end = calculateEndTime(normalizedStart, validHours, validBreak);
        setStartTime(normalizedStart);
        setNeededHours(validHours);
        setBreakMinutes(validBreak);
        setStarted(true);
        setEndTime(end);
        localStorage.setItem("startTime", normalizedStart.toISOString());
        localStorage.setItem("endTime", end.toISOString());
        localStorage.setItem("neededHours", validHours.toString());
        localStorage.setItem("breakMinutes", validBreak.toString());
        localStorage.setItem("resetOnOvertimeReload", String(resetOnOvertimeReload));
        localStorage.setItem("resetOnNextDay", String(resetOnNextDay));
    };

    const handleReset = () => {
        setStarted(false);
        setStartTime(getInitialStartTime());
        setEndTime(null);
        setTimeLeft(null);
        setOvertime(null);
        document.title = "WorkClock";
        clearTimerSession();
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: "url('/67052cc631d87fc09b0548b5_0.jpeg')" }}
        >
            <div className="min-h-screen bg-white/90 dark:bg-gray-900/90 pb-10">
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
                {loading ? (
                    <LoadingView />
                ) : started ? (
                    <WorkClockView
                        handleReset={handleReset}
                        startTime={startTime}
                        endTime={endTime}
                        timeLeft={timeLeft}
                        overtime={overtime}
                        resetOnOvertimeReload={resetOnOvertimeReload}
                        setResetOnOvertimeReload={handleResetOnOvertimeReloadChange}
                        resetOnNextDay={resetOnNextDay}
                        setResetOnNextDay={handleResetOnNextDayChange}
                    />
                ) : (
                    <SetupView
                        breakMinutes={breakMinutes}
                        setBreakMinutes={handleBreakMinutesChange}
                        neededHours={neededHours}
                        setNeededHours={handleNeededHoursChange}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        resetOnOvertimeReload={resetOnOvertimeReload}
                        setResetOnOvertimeReload={handleResetOnOvertimeReloadChange}
                        resetOnNextDay={resetOnNextDay}
                        setResetOnNextDay={handleResetOnNextDayChange}
                        handleStart={handleStart}
                    />
                )}
            </div>
        </div>
    );
}

function calculateEndTime(
    startTime: Date,
    neededHours: number,
    breakMinutes: number
): Date {
    const start = new Date(startTime);
    start.setSeconds(0, 0);
    const totalMinutes = Math.round(neededHours * 60) + breakMinutes;
    return new Date(start.getTime() + totalMinutes * 60 * 1000);
}
