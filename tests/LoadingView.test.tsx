import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingView from "@/component/LoadingView";

describe("LoadingView", () => {
    it("renders loading status and message", () => {
        render(<LoadingView />);
        expect(screen.getByText("Status:")).toBeInTheDocument();
        expect(screen.getByText("Lade Daten...")).toBeInTheDocument();
    });
});
