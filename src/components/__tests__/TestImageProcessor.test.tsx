import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TestImageProcessor } from "../TestImageProcessor";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

describe("TestImageProcessor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input and button", () => {
    render(<TestImageProcessor />);
    expect(screen.getByPlaceholderText(/Enter image URL/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Process/i })
    ).toBeInTheDocument();
  });

  it("shows error when submitting empty URL", () => {
    render(<TestImageProcessor />);
    fireEvent.click(screen.getByRole("button", { name: /Process/i }));
    expect(screen.getByText(/Please enter an image URL/i)).toBeInTheDocument();
  });

  it("processes image successfully", async () => {
    const mockResponse = { data: { arrests: 100, detainers: 50 } };
    vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

    render(<TestImageProcessor />);

    const input = screen.getByPlaceholderText(/Enter image URL/i);
    fireEvent.change(input, {
      target: { value: "https://test.com/image.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Process/i }));

    await waitFor(() => {
      expect(screen.getByText(/"arrests": 100/)).toBeInTheDocument();
      expect(screen.getByText(/"detainers": 50/)).toBeInTheDocument();
    });
  });

  it("handles processing error", async () => {
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("Processing failed"));

    render(<TestImageProcessor />);

    const input = screen.getByPlaceholderText(/Enter image URL/i);
    fireEvent.change(input, {
      target: { value: "https://test.com/image.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Process/i }));

    await waitFor(() => {
      expect(screen.getByText(/Processing failed/i)).toBeInTheDocument();
    });
  });
});
