import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddTodoForm from "../../src/components/AddTodoForm";

describe("AddTodoForm Component", () => {
  const onAddTodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls onAddTodo when a valid task name is submitted", async () => {
    render(<AddTodoForm onAddTodo={onAddTodo} />);

    // Type in a valid task name
    fireEvent.change(screen.getByPlaceholderText("Enter a new task"), {
      target: { value: "Test Task" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Task"));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(onAddTodo).toHaveBeenCalledWith("Test Task");
    });

    // Ensure the input was cleared after submission
    expect(screen.getByPlaceholderText("Enter a new task")).toHaveValue("");
  });

  it("shows a validation error when the task name is empty", async () => {
    render(<AddTodoForm onAddTodo={onAddTodo} />);

    // Submit the form without typing anything
    fireEvent.click(screen.getByText("Add Task"));

    // Expect an error message to appear
    await waitFor(() => {
      expect(screen.getByText("Please input a task name!")).toBeInTheDocument();
    });

    // Ensure onAddTodo was not called
    expect(onAddTodo).not.toHaveBeenCalled();
  });

  it("shows a validation error when the task name exceeds 255 characters", async () => {
    render(<AddTodoForm onAddTodo={onAddTodo} />);

    // Type in a task name longer than 255 characters
    const longTaskName = "a".repeat(256);
    fireEvent.change(screen.getByPlaceholderText("Enter a new task"), {
      target: { value: longTaskName },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Task"));

    // Expect an error message about the length to appear
    await waitFor(() => {
      expect(
        screen.getByText("Task name cannot exceed 255 characters"),
      ).toBeInTheDocument();
    });

    // Ensure onAddTodo was not called
    expect(onAddTodo).not.toHaveBeenCalled();
  });

  it("resets the form after successful submission", async () => {
    render(<AddTodoForm onAddTodo={onAddTodo} />);

    // Type in a valid task name
    fireEvent.change(screen.getByPlaceholderText("Enter a new task"), {
      target: { value: "Test Task" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Task"));

    // Ensure the form was reset
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter a new task")).toHaveValue("");
    });
  });
});
