import LoginPage from "@/app/login/page";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage (without password test)", () => {
  it("renders username input and secure word button", () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

    render(<LoginPage />);

    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get secure word/i })
    ).toBeInTheDocument();
  });
});
