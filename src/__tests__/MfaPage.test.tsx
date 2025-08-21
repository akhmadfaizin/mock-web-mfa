import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { validateMfaCode } from "@/lib/mfa";
import MfaPage from "@/app/mfa/page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/mfa", () => ({
  generateMfaCode: jest.fn(() => "654321"),
  validateMfaCode: jest.fn(),
}));

describe("MfaPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the page with input and verify button", () => {
    render(<MfaPage />);
    expect(screen.getByText(/MFA Verification/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("123456")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify/i })).toBeInTheDocument();
  });

  it("redirects to dashboard on valid code", async () => {
    (validateMfaCode as jest.Mock).mockReturnValue(true);

    render(<MfaPage />);

    fireEvent.change(screen.getByPlaceholderText("123456"), {
      target: { value: "654321" },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error on invalid code", async () => {
    (validateMfaCode as jest.Mock).mockReturnValue(false);

    render(<MfaPage />);

    fireEvent.change(screen.getByPlaceholderText("123456"), {
      target: { value: "000000" },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    expect(
      await screen.findByText(/Invalid MFA code. Attempt 1 of 3./i)
    ).toBeInTheDocument();
  });

  it("locks out after 3 invalid attempts", async () => {
    (validateMfaCode as jest.Mock).mockReturnValue(false);

    render(<MfaPage />);

    const input = screen.getByPlaceholderText("123456");
    const button = screen.getByRole("button", { name: /verify/i });

    // 3 failed attempts
    for (let i = 1; i <= 3; i++) {
      fireEvent.change(input, { target: { value: `00000${i}` } });
      fireEvent.click(button);
    }

    expect(
      await screen.findByText(/Too many invalid attempts/i)
    ).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it("displays the current MFA code from generateMfaCode", () => {
    render(<MfaPage />);
    expect(
      screen.getByText(/MFA code so that user know what to input:/i)
    ).toBeInTheDocument();
    expect(screen.getByText("654321")).toBeInTheDocument();
  });
});
