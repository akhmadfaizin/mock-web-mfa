import { NextResponse } from "next/server";

export async function GET() {
  const data = [
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
    {
      date: "26 August 2025",
      referenceId: "#23456789",
      to: "GreenMart Grocery",
      transactionType: "Bill Payment",
      amount: "RM 300.00",
    },
    {
      date: "27 August 2025",
      referenceId: "#34567890",
      to: "Skyline Properties",
      transactionType: "Rental Payment",
      amount: "RM 2,400.00",
    },
    {
      date: "28 August 2025",
      referenceId: "#45678901",
      to: "EduSmart Academy",
      transactionType: "Tuition Fees",
      amount: "RM 1,050.00",
    },
    {
      date: "29 August 2025",
      referenceId: "#56789012",
      to: "Sunshine Cafe",
      transactionType: "DuitNow payment",
      amount: "RM 75.90",
    },
    {
      date: "30 August 2025",
      referenceId: "#67890123",
      to: "HealthFirst Clinic",
      transactionType: "Medical Payment",
      amount: "RM 430.00",
    },
    {
      date: "31 August 2025",
      referenceId: "#78901234",
      to: "Rapid Transport",
      transactionType: "Top-up",
      amount: "RM 120.00",
    },
    {
      date: "1 September 2025",
      referenceId: "#89012345",
      to: "AquaWater Services",
      transactionType: "Utility Bill",
      amount: "RM 95.40",
    },
    {
      date: "2 September 2025",
      referenceId: "#90123456",
      to: "Nova Electronics",
      transactionType: "Purchase",
      amount: "RM 2,999.00",
    },
  ];

  return NextResponse.json(data);
}
