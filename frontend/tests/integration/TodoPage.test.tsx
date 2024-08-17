import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoPage from "../../src/components/TodoPage"; // Adjust the import path as needed
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../../src/services/todoService";
import { Duty } from "../../src/schema/duty";

// Mock the API services
jest.mock("../../src/services/todoService");

describe("TodoPage Integration Tests", () => {
  const mockTodos: Duty[] = [
    { id: 1, name: "Test Todo 1", createdAt: new Date("2024-08-01T00:00:00Z") },
    { id: 2, name: "Test Todo 2", createdAt: new Date("2024-08-02T00:00:00Z") },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays todos on load", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);

    render(<TodoPage />);

    // Verify loading spinner appears
    expect(document.querySelector(".ant-spin")).toBeInTheDocument();

    // Wait for the todos to be fetched and displayed
    await waitFor(() => {
      expect(document.querySelector(".ant-spin")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();

    // Verify getTodos was called once
    expect(getTodos).toHaveBeenCalledTimes(1);
  });

  it("adds a new todo and displays it", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (createTodo as jest.Mock).mockResolvedValue({
      id: 3,
      name: "New Todo",
      createdAt: new Date("2024-08-03T00:00:00Z"),
    });

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate adding a new todo
    fireEvent.change(screen.getByPlaceholderText("Enter a new task"), {
      target: { value: "New Todo" },
    });
    fireEvent.click(screen.getByText("Add Task"));

    // Wait for the new todo to be added and displayed
    await waitFor(() => {
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });

    // Verify createTodo was called with the correct name
    expect(createTodo).toHaveBeenCalledWith("New Todo");
  });

  it("updates an existing todo", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (updateTodo as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Updated Todo 1",
      createdAt: new Date("2024-08-01T00:00:00Z"),
    });

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate updating a todo
    fireEvent.click(screen.getAllByText("Update")[0]); // Update first todo
    fireEvent.change(screen.getByPlaceholderText("Enter new name"), {
      target: { value: "Updated Todo 1" },
    });
    fireEvent.click(screen.getByText("OK"));

    // Wait for the todo to be updated and displayed
    await waitFor(() => {
      expect(screen.getByText("Updated Todo 1")).toBeInTheDocument();
    });

    // Verify updateTodo was called with the correct arguments
    expect(updateTodo).toHaveBeenCalledWith(1, "Updated Todo 1");
  });

  it("deletes a todo", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (deleteTodo as jest.Mock).mockResolvedValue(Promise.resolve());

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate deleting a todo
    fireEvent.click(screen.getAllByText("Delete")[0]); // Delete first todo

    // Wait for the todo to be removed from the list
    await waitFor(() => {
      expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
    });

    // Verify deleteTodo was called with the correct id
    expect(deleteTodo).toHaveBeenCalledWith(1);
  });
});
