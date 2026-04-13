import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalysisForm } from "@/features/analysis/components/analysis-form";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("AnalysisForm UI", () => {
  beforeEach(() => {
    pushMock.mockReset();
    vi.restoreAllMocks();
  });

  it("shows file error when submitting without CV", async () => {
    render(<AnalysisForm />);

    fireEvent.change(screen.getByPlaceholderText(/collez l'offre/i), {
      target: { value: "x".repeat(150) },
    });
    fireEvent.click(screen.getByRole("button", { name: /analyser mon cv/i }));

    expect(await screen.findByText(/selectionnez un cv pdf ou docx/i)).toBeInTheDocument();
  });

  it("submits and redirects on success", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          reportId: "abc123",
          report: {
            id: "abc123",
          },
        }),
        { status: 200 },
      ),
    );

    render(<AnalysisForm />);

    fireEvent.click(screen.getByRole("button", { name: /ins.rer un exemple/i }));

    const input = screen.getByLabelText(/glissez votre cv ici/i) as HTMLInputElement;
    const file = new File(["docx-content"], "cv.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /^analyser mon cv$/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith("/resultats/abc123");
    });
  });

  it("renders API error message on failed request", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            message: "Impossible de parser le document",
          },
        }),
        { status: 422 },
      ),
    );

    render(<AnalysisForm />);
    fireEvent.click(screen.getByRole("button", { name: /ins.rer un exemple/i }));

    const input = screen.getByLabelText(/glissez votre cv ici/i) as HTMLInputElement;
    const file = new File(["docx-content"], "cv.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /^analyser mon cv$/i }));

    expect(await screen.findByText(/impossible de parser le document/i)).toBeInTheDocument();
  });
});
