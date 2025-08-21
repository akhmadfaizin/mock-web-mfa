import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "@/app/components/Navbar";

describe("Navbar", () => {
  it("renders brand name", () => {
    render(<Navbar />);
    expect(screen.getAllByText("AKFA")[0]).toBeInTheDocument();
  });

  it("renders menu items in desktop view", () => {
    render(<Navbar />);
    const menuItems = [
      "Showcase",
      "Docs",
      "Blog",
      "Analytics",
      "Templates",
      "Enterprise",
    ];
    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renders login button", () => {
    render(<Navbar />);
    expect(
      screen.getAllByRole("button", { name: /login/i })[0]
    ).toBeInTheDocument();
  });

  it("renders search input (desktop)", () => {
    render(<Navbar />);
    expect(
      screen.getByPlaceholderText(/search documentation/i)
    ).toBeInTheDocument();
  });

  it("toggles mobile menu", () => {
    render(<Navbar />);

    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });

    expect(screen.queryByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Showcase")).toBeInTheDocument();

    fireEvent.click(toggleButton);
    const showcases = screen.getAllByText(/showcase/i);
    expect(showcases).toHaveLength(2);

    expect(
      screen.getAllByRole("button", { name: /login/i })[0]
    ).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByText("Showcase")).toBeInTheDocument();
  });
});
