"use client"

import { CalendarClock, Clock, Coffee, PlayCircle, RotateCcw } from "lucide-react"

type WorkClockSetupProps = {
    breakMinutes: number
    setBreakMinutes: (minutes: number) => void
    neededHours: number
    setNeededHours: (hours: number) => void
    startTime: Date | null
    setStartTime: (time: Date) => void
    resetOnOvertimeReload: boolean
    setResetOnOvertimeReload: (value: boolean) => void
    resetOnNextDay: boolean
    setResetOnNextDay: (value: boolean) => void
    handleStart: () => void
}

export default function SetupView({
                                      breakMinutes,
                                      setBreakMinutes,
                                      neededHours,
                                      setNeededHours,
                                      startTime,
                                      setStartTime,
                                      resetOnOvertimeReload,
                                      setResetOnOvertimeReload,
                                      resetOnNextDay,
                                      setResetOnNextDay,
                                      handleStart,
                                  }: WorkClockSetupProps) {
    const isFormValid =
        Number.isFinite(neededHours) &&
        neededHours > 0 &&
        neededHours <= 24 &&
        Number.isFinite(breakMinutes) &&
        breakMinutes >= 0 &&
        breakMinutes <= 1440 &&
        startTime !== null &&
        !Number.isNaN(startTime.getTime());

    return (
        <div className="container mx-auto px-4 -mt-14 relative z-20 pb-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-card/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 dark:border-gray-700/50 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-8">
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">

                                {/* Benötigte Arbeitsstunden */}
                                <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-blue-600/10 dark:to-blue-600/20 p-6 rounded-2xl border border-primary/20 dark:border-blue-600/30">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-10 h-10 bg-primary/10 dark:bg-blue-600/20 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-primary dark:text-blue-400" />
                                        </div>
                                        <label htmlFor="needed_hours" className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                                            Benötigte Arbeitsstunden
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        id="needed_hours"
                                        min="0.1"
                                        max="24"
                                        step="0.1"
                                        className="w-full px-4 py-3 bg-background dark:bg-gray-700 border border-border dark:border-gray-600 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus:ring-2 focus:ring-accent dark:focus:ring-blue-500 focus:border-accent dark:focus:border-blue-500 transition-all duration-200"
                                        placeholder="7,6"
                                        value={Number.isFinite(neededHours) ? neededHours : ""}
                                        onChange={(e) => {
                                            const val = Number.parseFloat(e.target.value);
                                            setNeededHours(Number.isNaN(val) ? Number.NaN : Math.max(0, val));
                                        }}
                                        required
                                    />
                                </div>

                                {/* Pausenzeit */}
                                <div className="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-purple-600/10 dark:to-purple-600/20 p-6 rounded-2xl border border-accent/20 dark:border-purple-600/30">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-10 h-10 bg-accent/10 dark:bg-purple-600/20 rounded-lg flex items-center justify-center">
                                            <Coffee className="w-5 h-5 text-accent dark:text-purple-400" />
                                        </div>
                                        <label htmlFor="break_minutes" className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                                            Pausenzeit (Minuten)
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        id="break_minutes"
                                        min="0"
                                        max="1440"
                                        step="1"
                                        className="w-full px-4 py-3 bg-background dark:bg-gray-700 border border-border dark:border-gray-600 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus:ring-2 focus:ring-accent dark:focus:ring-blue-500 focus:border-accent dark:focus:border-blue-500 transition-all duration-200"
                                        placeholder="30"
                                        value={Number.isFinite(breakMinutes) ? breakMinutes : ""}
                                        onChange={(e) => {
                                            const val = Number.parseInt(e.target.value, 10);
                                            setBreakMinutes(Number.isNaN(val) ? Number.NaN : Math.max(0, val));
                                        }}
                                        required
                                    />
                                </div>

                                {/* Startzeit */}
                                <div className="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-purple-600/10 dark:to-purple-600/20 p-6 rounded-2xl border border-accent/20 dark:border-purple-600/30">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-10 h-10 bg-accent/10 dark:bg-purple-600/20 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-accent dark:text-purple-400" />
                                        </div>
                                        <label htmlFor="start_time" className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                                            Startzeit
                                        </label>
                                    </div>
                                    <input
                                        type="time"
                                        id="start_time"
                                        className="w-full px-4 py-3 bg-background dark:bg-gray-700 border border-border dark:border-gray-600 rounded-xl text-foreground dark:text-white focus:ring-2 focus:ring-accent dark:focus:ring-blue-500 focus:border-accent dark:focus:border-blue-500 transition-all duration-200"
                                        value={
                                            startTime && !Number.isNaN(startTime.getTime())
                                                ? `${String(startTime.getHours()).padStart(2, "0")}:${String(
                                                    startTime.getMinutes()
                                                ).padStart(2, "0")}`
                                                : ""
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value) return;
                                            const [hours, minutes] = e.target.value.split(":").map(Number);
                                            if (Number.isNaN(hours) || Number.isNaN(minutes)) return;
                                            const newTime = new Date();
                                            newTime.setHours(hours, minutes, 0, 0);
                                            setStartTime(newTime);
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Reset-Einstellungen */}
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Reset bei Neuladen in Überstunden */}
                                <label
                                    htmlFor="reset_on_overtime_reload"
                                    className="flex items-center justify-between gap-4 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-blue-600/10 dark:to-blue-600/20 p-5 rounded-2xl border border-primary/20 dark:border-blue-600/30 cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-primary/10 dark:bg-blue-600/20 rounded-lg flex items-center justify-center">
                                            <RotateCcw className="w-5 h-5 text-primary dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground dark:text-white">
                                                Reset bei Reload in Überstunden
                                            </p>
                                            <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                Setzt den Timer beim Neuladen der Seite zurück, wenn bereits Überstunden laufen
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="reset_on_overtime_reload"
                                        checked={resetOnOvertimeReload}
                                        onChange={(e) => setResetOnOvertimeReload(e.target.checked)}
                                        className="w-5 h-5 accent-blue-600 rounded cursor-pointer shrink-0"
                                    />
                                </label>

                                {/* Reset am nächsten Tag */}
                                <label
                                    htmlFor="reset_on_next_day"
                                    className="flex items-center justify-between gap-4 bg-gradient-to-br from-accent/5 to-accent/10 dark:from-purple-600/10 dark:to-purple-600/20 p-5 rounded-2xl border border-accent/20 dark:border-purple-600/30 cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-accent/10 dark:bg-purple-600/20 rounded-lg flex items-center justify-center">
                                            <CalendarClock className="w-5 h-5 text-accent dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground dark:text-white">
                                                Automatischer Reset am nächsten Tag
                                            </p>
                                            <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                Setzt den Timer zurück, wenn die Startzeit an einem vergangenen Tag liegt
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="reset_on_next_day"
                                        checked={resetOnNextDay}
                                        onChange={(e) => setResetOnNextDay(e.target.checked)}
                                        className="w-5 h-5 accent-blue-600 rounded cursor-pointer shrink-0"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Start-Button */}
                        <div className="text-center pt-6">
                            <button
                                onClick={handleStart}
                                disabled={!isFormValid}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-destructive dark:bg-green-500 text-destructive-foreground dark:text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-destructive/90 dark:hover:bg-green-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <PlayCircle className="w-5 h-5" />
                                Arbeitszeit starten
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
