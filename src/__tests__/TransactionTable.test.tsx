import TransactionTable from "@/app/components/TransactionTable";
import { render, screen } from "@testing-library/react";

const mockData = [
  {
    date: "24 August 2025",
    referenceId: "#12345678",
    to: "Bloom Enterprise Sdn Bhd",
    transactionType: "DuitNow payment",
    amount: "RM 1,200.00",
  },
  {
    date: "25 August 2025",
    referenceId: "#87654321",
    to: "TechVision Solutions",
    transactionType: "Fund Transfer",
    amount: "RM 850.50",
  },
];

describe("TransactionTable", () => {
  it("renders table headers", () => {
    render(<TransactionTable data={mockData} />);
    expect(screen.getByText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Reference ID/i)).toBeInTheDocument();
    expect(screen.getByText(/To/i)).toBeInTheDocument();
    expect(screen.getByText(/Transaction Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
  });

  it("renders all rows from props", () => {
    render(<TransactionTable data={mockData} />);
    const rows = screen.getAllByRole("row");

    expect(rows).toHaveLength(mockData.length + 1);
  });

  it("renders correct transaction data", () => {
    render(<TransactionTable data={mockData} />);
    // First row
    expect(screen.getByText("24 August 2025")).toBeInTheDocument();
    expect(screen.getByText("#12345678")).toBeInTheDocument();
    expect(screen.getByText("Bloom Enterprise Sdn Bhd")).toBeInTheDocument();
    expect(screen.getByText("DuitNow payment")).toBeInTheDocument();
    expect(screen.getByText("RM 1,200.00")).toBeInTheDocument();

    // Second row
    expect(screen.getByText("25 August 2025")).toBeInTheDocument();
    expect(screen.getByText("#87654321")).toBeInTheDocument();
    expect(screen.getByText("TechVision Solutions")).toBeInTheDocument();
    expect(screen.getByText("Fund Transfer")).toBeInTheDocument();
    expect(screen.getByText("RM 850.50")).toBeInTheDocument();
  });

  it("renders recipient references text for each row", () => {
    render(<TransactionTable data={mockData} />);
    const refs = screen.getAllByText(/Recipient references will go here/i);
    expect(refs).toHaveLength(mockData.length);
  });
});
