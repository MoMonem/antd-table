import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

afterEach(cleanup);

describe("app", () => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };

  it("Table gets filled with the correct data", () => {
    render(<App />);

    const antTable = screen.getByTestId("ant-table");
    const allRows = antTable.querySelectorAll("tr");

    expect(antTable).toBeInTheDocument();
    expect(allRows.length).toBe(2);
  });

  it("Modal and form show on button click", async () => {
    render(<App />);

    fireEvent.click(screen.getByText("Create Event"));

    // Modal and table visability
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("create-form")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("type")).toBeInTheDocument();
    expect(screen.getByTestId("date")).toBeInTheDocument();
    expect(screen.getByTestId("description")).toBeInTheDocument();
  });

  it("form validation appear if failed", async () => {
    render(<App />);

    fireEvent.click(screen.getByText("Create Event"));
    fireEvent.click(screen.getByText("Create"));
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  });

  it("Form submits the data correctly and data displays in table", async () => {
    render(<App />);

    fireEvent.click(screen.getByText("Create Event"));

    // Fill in form
    fireEvent.change(screen.getByPlaceholderText("Add a title here"), {
      target: { value: "Jest test Event Title" },
    });
    expect(screen.getByPlaceholderText("Add a title here").value).toBe(
      "Jest test Event Title"
    );

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Holiday" },
    });
    fireEvent.keyDown(screen.getByRole("combobox"), {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    fireEvent.change(screen.getByPlaceholderText("Start date"), {
      target: { value: "2023-02-01 - 2023-02-01" },
    });
    expect(screen.getByPlaceholderText("Start date").value).toBe(
      "2023-02-01 - 2023-02-01"
    );

    fireEvent.change(screen.getByPlaceholderText("Add description here"), {
      target: { value: "Jest test Event Description" },
    });
    expect(screen.getByPlaceholderText("Add description here").value).toBe(
      "Jest test Event Description"
    );

    // Submit form
    fireEvent.submit(screen.getByText("Create"));
    await new Promise((r) => setTimeout(r, 500));

    expect(
      screen.getByTestId("ant-table").querySelectorAll("tr").length
    ).toBeGreaterThan(2);
  });
});
