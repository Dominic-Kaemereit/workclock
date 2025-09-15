"use client"

import { Clock, Coffee, PlayCircle } from "lucide-react"

type WorkClockSetupProps = {
    breakMinutes: number
    setBreakMinutes: (minutes: number) => void
    neededHours: number
    setNeededHours: (hours: number) => void
    startTime: Date | null
    setStartTime: (time: Date) => void
    handleStart: () => void
}

export default function SetupView({
                                      breakMinutes,
                                      setBreakMinutes,
                                      neededHours,
                                      setNeededHours,
                                      startTime,
                                      setStartTime,
                                      handleStart,
                                  }: WorkClockSetupProps) {
    return (
        <div className="container mx-auto px-4 -mt-14 relative z-20 pb-4 ">
            <div className="max-w-12xl mx-auto">
                <div className="bg-card/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 dark:border-gray-700/50 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-8">
                        <div className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-3">

                                {/* Benötigte Arbeitsstunden */}
                                <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-blue-600/10 dark:to-blue-600/20 p-6 rounded-2xl border border-primary/20 dark:border-blue-600/30">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-10 h-10 bg-primary/10 dark:bg-blue-600/20 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-primary dark:text-blue-400" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                                            Benötigte Arbeitsstunden
                                        </p>
                                    </div>
                                    <input
                                        type="number"
                                        id="needed_hours"
                                        className="w-full px-4 py-3 bg-background dark:bg-gray-700 border border-border dark:border-gray-600 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus:ring-2 focus:ring-accent dark:focus:ring-blue-500 focus:border-accent dark:focus:border-blue-500 transition-all duration-200"
                                        placeholder="7,6"
                                        value={neededHours}
                                        onChange={(e) => setNeededHours(Number.parseFloat(e.target.value))}
                                        step="0.1"
                                        required
                                    />
                                </div>

                                {/* Pausenzeit */}
                                <div className="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-purple-600/10 dark:to-purple-600/20 p-6 rounded-2xl border border-accent/20 dark:border-purple-600/30">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-10 h-10 bg-accent/10 dark:bg-purple-600/20 rounded-lg flex items-center justify-center">
                                            <Coffee className="w-5 h-5 text-accent dark:text-purple-400" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                                            Pausenzeit (Minuten)
                                        </p>
                                    </div>
                                    <input
                                        type="number"
                                        id="break_minutes"
                                        className="w-full px-4 py-3 bg-background dark:bg-gray-700 border border-border dark:border-gray-600 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus:ring-2 focus:ring-accent dark:focus:ring-blue-500 focus:border-accent dark:focus:border-blue-500 transition-all duration-200"
                                        placeholder="30"
                                        value={breakMinutes}
                                        onChange={(e) => setBreakMinutes(Number.parseInt(e.target.value))}
                                        required
                                    />
                                </div>

                                {/* Startzeit */}
                                <div className="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-purple-600/10 dark:to-purple-600/20 p-6 rounded-2xl border border-accent/20 dark:border-purple-600/30">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-10 h-10 bg-accent/10 dark:bg-purple-600/20 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-accent dark:text-purple-400" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                                            Startzeit
                                        </p>
                                    </div>
                                    <input
                                        type="time"
                                        id="start_time"
                                        className="w-full px-4 py-3 bg-background dark:bg-gray-700 border border-border dark:border-gray-600 rounded-xl text-foreground dark:text-white focus:ring-2 focus:ring-accent dark:focus:ring-blue-500 focus:border-accent dark:focus:border-blue-500 transition-all duration-200"
                                        value={
                                            startTime
                                                ? `${String(startTime.getHours()).padStart(2, "0")}:${String(
                                                    startTime.getMinutes()
                                                ).padStart(2, "0")}`
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const [hours, minutes] = e.target.value.split(":").map(Number)
                                            const newTime = new Date()
                                            newTime.setHours(hours, minutes, 0, 0)
                                            setStartTime(newTime)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Start-Button */}
                        <div className="text-center pt-6">
                            <button
                                onClick={handleStart}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-destructive dark:bg-green-500 text-destructive-foreground dark:text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-destructive/90 dark:hover:bg-green-700 transition-all duration-200 hover:scale-105"
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
