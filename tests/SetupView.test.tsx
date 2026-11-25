import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SetupView from "@/component/SetupView";

describe("SetupView", () => {
    const defaultProps = {
        breakMinutes: 30,
        setBreakMinutes: vi.fn(),
        neededHours: 7.6,
        setNeededHours: vi.fn(),
        startTime: new Date("2026-11-25T08:30:00"),
        setStartTime: vi.fn(),
        resetOnOvertimeReload: false,
        setResetOnOvertimeReload: vi.fn(),
        resetOnNextDay: true,
        setResetOnNextDay: vi.fn(),
        handleStart: vi.fn(),
    };

    it("renders all inputs with initial values", () => {
        render(<SetupView {...defaultProps} />);

        expect(screen.getByLabelText("Benötigte Arbeitsstunden")).toHaveValue(7.6);
        expect(screen.getByLabelText("Pausenzeit (Minuten)")).toHaveValue(30);
        expect(screen.getByLabelText("Startzeit")).toHaveValue("08:30");
        expect(screen.getByLabelText(/Reset bei Reload in Überstunden/i)).not.toBeChecked();
        expect(screen.getByLabelText(/Automatischer Reset am nächsten Tag/i)).toBeChecked();
        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeEnabled();
    });

    it("updates neededHours, breakMinutes, startTime, and checkboxes", () => {
        const setNeededHours = vi.fn();
        const setBreakMinutes = vi.fn();
        const setStartTime = vi.fn();
        const setResetOnOvertimeReload = vi.fn();
        const setResetOnNextDay = vi.fn();

        render(
            <SetupView
                {...defaultProps}
                setNeededHours={setNeededHours}
                setBreakMinutes={setBreakMinutes}
                setStartTime={setStartTime}
                setResetOnOvertimeReload={setResetOnOvertimeReload}
                setResetOnNextDay={setResetOnNextDay}
            />
        );

        fireEvent.change(screen.getByLabelText("Benötigte Arbeitsstunden"), {
            target: { value: "8" },
        });
        expect(setNeededHours).toHaveBeenCalledWith(8);

        fireEvent.change(screen.getByLabelText("Pausenzeit (Minuten)"), {
            target: { value: "45" },
        });
        expect(setBreakMinutes).toHaveBeenCalledWith(45);

        fireEvent.change(screen.getByLabelText("Startzeit"), {
            target: { value: "09:15" },
        });
        expect(setStartTime).toHaveBeenCalledTimes(1);
        const calledDate = setStartTime.mock.calls[0][0] as Date;
        expect(calledDate.getHours()).toBe(9);
        expect(calledDate.getMinutes()).toBe(15);

        fireEvent.click(screen.getByLabelText(/Reset bei Reload in Überstunden/i));
        expect(setResetOnOvertimeReload).toHaveBeenCalledWith(true);

        fireEvent.click(screen.getByLabelText(/Automatischer Reset am nächsten Tag/i));
        expect(setResetOnNextDay).toHaveBeenCalledWith(false);
    });

    it("disables start button when form inputs are invalid", () => {
        const { rerender } = render(<SetupView {...defaultProps} neededHours={0} />);
        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeDisabled();

        rerender(<SetupView {...defaultProps} neededHours={25} />);
        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeDisabled();

        rerender(<SetupView {...defaultProps} breakMinutes={1500} />);
        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeDisabled();

        rerender(<SetupView {...defaultProps} startTime={null} />);
        expect(screen.getByRole("button", { name: /Arbeitszeit starten/i })).toBeDisabled();
    });

    it("calls handleStart when start button is clicked", () => {
        const handleStart = vi.fn();
        render(<SetupView {...defaultProps} handleStart={handleStart} />);

        fireEvent.click(screen.getByRole("button", { name: /Arbeitszeit starten/i }));
        expect(handleStart).toHaveBeenCalledTimes(1);
    });
});
