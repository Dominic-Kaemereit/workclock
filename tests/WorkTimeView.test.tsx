import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WorkClockView from "@/component/WorkTimeView";

describe("WorkTimeView", () => {
    const start = new Date("2026-11-25T08:00:00");
    const end = new Date("2026-11-25T16:06:00");

    const defaultProps = {
        handleReset: vi.fn(),
        startTime: start,
        endTime: end,
        timeLeft: "3h 15m 20s",
        overtime: null,
        resetOnOvertimeReload: false,
        setResetOnOvertimeReload: vi.fn(),
        resetOnNextDay: true,
        setResetOnNextDay: vi.fn(),
    };

    it("renders running status, start/end times, and remaining time", () => {
        render(<WorkClockView {...defaultProps} />);

        expect(screen.getByText("Arbeitszeit läuft")).toBeInTheDocument();
        expect(screen.getByText("Gestartet um")).toBeInTheDocument();
        expect(screen.getByText("Voraussichtliches Ende")).toBeInTheDocument();
        expect(screen.getByText("Verbleibende Zeit")).toBeInTheDocument();
        expect(screen.getByText("3h 15m 20s")).toBeInTheDocument();
        expect(screen.queryByText(/Sie arbeiten bereits in Überstunden/i)).not.toBeInTheDocument();
    });

    it("renders overtime view when overtime is provided", () => {
        render(<WorkClockView {...defaultProps} timeLeft={null} overtime="0h 25m 10s" />);

        expect(screen.getByText("Überstunden")).toBeInTheDocument();
        expect(screen.getByText("Fertig 🎉")).toBeInTheDocument();
        expect(screen.getByText("+0h 25m 10s")).toBeInTheDocument();
        expect(screen.getByText("Sie arbeiten bereits in Überstunden")).toBeInTheDocument();
        expect(screen.queryByText("Verbleibende Zeit")).not.toBeInTheDocument();
    });

    it("handles reset button click and checkbox toggles", () => {
        const handleReset = vi.fn();
        const setResetOnOvertimeReload = vi.fn();
        const setResetOnNextDay = vi.fn();

        render(
            <WorkClockView
                {...defaultProps}
                handleReset={handleReset}
                setResetOnOvertimeReload={setResetOnOvertimeReload}
                setResetOnNextDay={setResetOnNextDay}
            />
        );

        fireEvent.click(screen.getByLabelText(/Reset bei Reload in Überstunden/i));
        expect(setResetOnOvertimeReload).toHaveBeenCalledWith(true);

        fireEvent.click(screen.getByLabelText(/Automatischer Reset am nächsten Tag/i));
        expect(setResetOnNextDay).toHaveBeenCalledWith(false);

        fireEvent.click(screen.getByRole("button", { name: /Zurücksetzen/i }));
        expect(handleReset).toHaveBeenCalledTimes(1);
    });
});
