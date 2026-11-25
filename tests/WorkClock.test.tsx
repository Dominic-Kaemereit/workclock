import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WorkClock from "@/component/WorkClock";

describe("WorkClock", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-25T08:00:00"));
        document.title = "WorkClock";
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders SetupView by default with default settings", () => {
        render(<WorkClock />);

        expect(screen.getByRole("heading", { name: /Einfach Arbeitszeit berechnen/i })).toBeInTheDocument();
        expect(screen.getByLabelText("Benötigte Arbeitsstunden")).toHaveValue(7.6);
        expect(screen.getByLabelText("Pausenzeit (Minuten)")).toHaveValue(30);
        expect(screen.getByLabelText("Startzeit")).toHaveValue("08:00");
        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeInTheDocument();
    });

    it("starts the timer, calculates remaining time, updates document.title and localStorage", () => {
        render(<WorkClock />);

        fireEvent.click(screen.getByRole("button", { name: /Arbeitszeit starten/i }));

        // 7.6h (456m) + 30m break = 486m = 8h 6m -> 16:06
        expect(screen.getByText("Arbeitszeit läuft")).toBeInTheDocument();
        expect(screen.getByText("8h 6m 0s")).toBeInTheDocument();
        expect(document.title).toBe("8h 6m verbleibend | WorkClock");

        expect(localStorage.getItem("neededHours")).toBe("7.6");
        expect(localStorage.getItem("breakMinutes")).toBe("30");
        expect(localStorage.getItem("startTime")).toBe(new Date("2026-11-25T08:00:00").toISOString());
        expect(localStorage.getItem("endTime")).toBe(new Date("2026-11-25T16:06:00").toISOString());

        // Advance 1 hour and 5 seconds
        act(() => {
            vi.advanceTimersByTime(1000 * (3600 + 5));
        });

        expect(screen.getByText("7h 5m 55s")).toBeInTheDocument();
        expect(document.title).toBe("7h 5m verbleibend | WorkClock");
    });

    it("transitions to overtime when current time passes endTime", () => {
        render(<WorkClock />);

        fireEvent.click(screen.getByRole("button", { name: /Arbeitszeit starten/i }));

        // Advance 8 hours 10 minutes (4 minutes into overtime)
        act(() => {
            vi.advanceTimersByTime(1000 * 60 * (8 * 60 + 10));
        });

        expect(screen.getByText("Fertig 🎉")).toBeInTheDocument();
        expect(screen.getByText("+0h 4m 0s")).toBeInTheDocument();
        expect(document.title).toBe("+0h 4m (Überstunden) | WorkClock");
    });

    it("resets the running timer back to SetupView and clears session from localStorage", () => {
        render(<WorkClock />);

        fireEvent.click(screen.getByRole("button", { name: /Arbeitszeit starten/i }));
        expect(screen.getByText("Arbeitszeit läuft")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /Zurücksetzen/i }));

        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeInTheDocument();
        expect(localStorage.getItem("startTime")).toBeNull();
        expect(localStorage.getItem("endTime")).toBeNull();
        expect(document.title).toBe("WorkClock");
    });

    it("restores an active session from localStorage on same day", () => {
        const start = new Date("2026-11-25T07:00:00");
        const end = new Date("2026-11-25T15:00:00");
        localStorage.setItem("startTime", start.toISOString());
        localStorage.setItem("endTime", end.toISOString());
        localStorage.setItem("neededHours", "7.5");
        localStorage.setItem("breakMinutes", "30");

        render(<WorkClock />);

        expect(screen.getByText("Arbeitszeit läuft")).toBeInTheDocument();
        expect(screen.getByText("7h 0m 0s")).toBeInTheDocument();
    });

    it("resets session on next day when resetOnNextDay is true (default)", () => {
        const yesterdayStart = new Date("2026-11-24T08:00:00");
        const yesterdayEnd = new Date("2026-11-24T16:06:00");
        localStorage.setItem("startTime", yesterdayStart.toISOString());
        localStorage.setItem("endTime", yesterdayEnd.toISOString());
        localStorage.setItem("resetOnNextDay", "true");

        render(<WorkClock />);

        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeInTheDocument();
        expect(localStorage.getItem("startTime")).toBeNull();
        expect(localStorage.getItem("endTime")).toBeNull();
    });

    it("resets session on reload during overtime when resetOnOvertimeReload is true", () => {
        const start = new Date("2026-11-25T00:00:00");
        const end = new Date("2026-11-25T07:30:00"); // already in overtime at 08:00
        localStorage.setItem("startTime", start.toISOString());
        localStorage.setItem("endTime", end.toISOString());
        localStorage.setItem("resetOnOvertimeReload", "true");

        render(<WorkClock />);

        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeInTheDocument();
        expect(localStorage.getItem("startTime")).toBeNull();
        expect(localStorage.getItem("endTime")).toBeNull();
    });
});
