"use client"

type WorkClockViewProps = {
    handleReset: () => void;
    startTime: Date | null;
    endTime: Date | null;
    timeLeft: string | null;
    overtime: string | null;
};

export default function WorkClockView({
                                          handleReset,
                                          startTime,
                                          endTime,
                                          timeLeft,
                                          overtime,
                                      }: WorkClockViewProps) {
    return (
        <div className="container mx-auto px-4 -mt-14 relative z-20 pb-4 ">
                    <div className="max-w-12xl mx-auto">
                        <div className="bg-card/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 dark:border-gray-700/50 overflow-hidden">
                            <div className="p-8 md:p-12 space-y-8">
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-full border border-green-200 dark:border-green-800">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-semibold text-lg">Arbeitszeit läuft</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {startTime && (
                                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-blue-600/10 dark:to-blue-600/20 p-6 rounded-2xl border border-primary/20 dark:border-blue-600/30">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="w-10 h-10 bg-primary/10 dark:bg-blue-600/20 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-primary dark:text-blue-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Gestartet um</p>
                                            </div>
                                            <p className="text-3xl font-bold text-primary dark:text-blue-400">
                                                {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                        )}
                                        {endTime && (
                                        <div className="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-purple-600/10 dark:to-purple-600/20 p-6 rounded-2xl border border-accent/20 dark:border-purple-600/30">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="w-10 h-10 bg-accent/10 dark:bg-purple-600/20 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-accent dark:text-purple-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Voraussichtliches Ende</p>
                                            </div>
                                            <p className="text-3xl font-bold text-accent dark:text-purple-400">
                                                {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                        )}
                                        </div>

                                    <div className="text-center py-5 bg-gradient-to-br from-muted/30 to-background dark:from-gray-800/30 dark:to-gray-900 rounded-3xl border border-border/50 dark:border-gray-700/50">
                                        {overtime && (
                                            <div>
                                                <p className="text-lg font-medium text-muted-foreground dark:text-gray-400 mb-3">
                                                    Überstunden
                                                </p>
                                                <div className="text-7xl md:text-4xl font-bold mb-8 text-transparent bg-gradient-to-r from-primary to-accent dark:from-blue-400 dark:to-purple-400 bg-clip-text">
                                                    <span className="text-green-500 dark:text-green-400">Fertig 🎉</span>
                                                    { <span className="text-green-500 dark:text-green-400">{overtime}</span> }
                                                </div>
                                                <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-6 py-3 rounded-full inline-block border border-orange-200 dark:border-orange-800">
                                                    <span className="font-semibold">Sie arbeiten bereits in Überstunden</span>
                                                </div>
                                            </div>
                                        )}
                                        {timeLeft && (
                                            <div>
                                                <p className="text-lg font-medium text-muted-foreground dark:text-gray-400 mb-3">
                                                    Verbleibende Zeit
                                                </p>
                                                <div className="text-7xl md:text-4xl font-bold mb-8 text-transparent bg-gradient-to-r from-primary to-accent dark:from-blue-400 dark:to-purple-400 bg-clip-text">
                                                    {timeLeft}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="text-center pt-6">
                                    <button
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-destructive dark:bg-red-600 text-destructive-foreground dark:text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-destructive/90 dark:hover:bg-red-700 transition-all duration-200 hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Zurücksetzen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    )
}

