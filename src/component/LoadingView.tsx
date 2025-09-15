"use client"


export default function LoadingView() {
    return (
        <div className="container mx-auto px-4 -mt-14 relative z-20 pb-4 ">
            <div className="max-w-12xl mx-auto">
                <div className="bg-card/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 dark:border-gray-700/50 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-8">
                        <div className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                            </div>

                            <div className="text-center py-5 bg-gradient-to-br from-muted/30 to-background dark:from-gray-800/30 dark:to-gray-900 rounded-3xl border border-border/50 dark:border-gray-700/50">
                                    <div>
                                        <p className="text-lg font-medium text-muted-foreground dark:text-gray-400 mb-3">
                                            Status:
                                        </p>
                                        <div className="text-7xl md:text-4xl font-bold mb-8 text-transparent bg-gradient-to-r from-primary to-accent dark:from-blue-400 dark:to-purple-400 bg-clip-text">
                                            <span className="text-green-500 dark:text-green-400">Lade Daten...</span>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

