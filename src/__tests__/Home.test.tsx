import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

jest.mock("@/app/components/Navbar", () => {
  function MockNavbar() {
    return <div>Mocked Navbar</div>;
  }
  return MockNavbar;
});

describe("Home Component", () => {
  it("renders Navbar", () => {
    render(<Home />);
    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();
  });

  it("renders the main content text", () => {
    render(<Home />);
    expect(screen.getByText("First Challenge")).toBeInTheDocument();
  });
});
