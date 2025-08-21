/* eslint-disable @typescript-eslint/no-explicit-any */
import TransactionTable from "@/app/components/TransactionTable";
import DashboardPage from "@/app/dashboard/page";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock("@/app/components/TransactionTable", () =>
  jest.fn(() => <div>Mocked TransactionTable</div>)
);

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    }) as any;
  });

  it("redirects to /login if no token or user in localStorage", async () => {
    await act(async () => {
      render(<DashboardPage />);
    });
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("renders username when token and user are in localStorage", async () => {
    localStorage.setItem("demo_token", "123");
    localStorage.setItem("demo_user", "Alice");

    render(<DashboardPage />);

    expect(
      await screen.findByText((_, el) => el?.textContent === "Welcome, Alice")
    ).toBeInTheDocument();
  });

  it("fetches transaction history and passes data to TransactionTable", async () => {
    localStorage.setItem("demo_token", "123");
    localStorage.setItem("demo_user", "Alice");

    const mockData = [
      {
        date: "24 August 2025",
        referenceId: "#12345678",
        to: "Bloom Enterprise Sdn Bhd",
        transactionType: "DuitNow payment",
        amount: "RM 1,200.00",
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      const lastCall = (TransactionTable as jest.Mock).mock.calls.at(-1);
      expect(lastCall?.[0]).toEqual(
        expect.objectContaining({ data: mockData })
      );
    });
  });

  it("logs out user and redirects to /login", async () => {
    localStorage.setItem("demo_token", "123");
    localStorage.setItem("demo_user", "Alice");

    render(<DashboardPage />);

    const logoutBtn = await screen.findByText(/Logout/i);

    await act(async () => {
      fireEvent.click(logoutBtn);
    });

    expect(localStorage.getItem("demo_token")).toBeNull();
    expect(localStorage.getItem("demo_user")).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
