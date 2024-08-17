import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoItem from "../../src/components/TodoItem";
import { message } from "antd";
import { Duty } from "../../src/schema/duty";

jest.mock("antd", () => {
  const originalModule = jest.requireActual("antd");
  return {
    ...originalModule,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe("TodoItem Component", () => {
  const mockTodo: Duty = {
    id: 1,
    name: "Test Todo",
    createdAt: new Date(),
  };

  const onUpdate = jest.fn().mockResolvedValue(Promise.resolve());
  const onDelete = jest.fn().mockResolvedValue(Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("renders the todo item with name and created date", () => {
    render(
      <TodoItem todo={mockTodo} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Check that the todo name is rendered
    expect(screen.getByText("Test Todo")).toBeInTheDocument();

    // Check that the created date is rendered
    expect(screen.getByText(/Created at:/i)).toBeInTheDocument();
  });

  it("opens the modal when the 'Update' button is clicked", () => {
    render(
      <TodoItem todo={mockTodo} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Open the modal by clicking the Update button
    fireEvent.click(screen.getByText("Update"));

    // Ensure the modal is rendered
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onUpdate when form is submitted", async () => {
    render(
      <TodoItem todo={mockTodo} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Open the modal
    fireEvent.click(screen.getByText("Update"));

    // Change the input value
    fireEvent.change(screen.getByPlaceholderText("Enter new name"), {
      target: { value: "Updated Todo" },
    });

    // Submit the form by clicking the "OK" button
    fireEvent.click(screen.getByText("OK"));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(mockTodo.id, "Updated Todo");
    });
  });

  it("displays an error message if the update fails", async () => {
    // Simulate a failed update
    onUpdate.mockRejectedValue(new Error("Update failed"));

    render(
      <TodoItem todo={mockTodo} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Open the modal
    fireEvent.click(screen.getByText("Update"));

    // Change the input value
    fireEvent.change(screen.getByPlaceholderText("Enter new name"), {
      target: { value: "Updated Todo" },
    });

    // Submit the form by clicking the "OK" button
    fireEvent.click(screen.getByText("OK"));

    // Wait for the error message
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(mockTodo.id, "Updated Todo");
      expect(message.error).toHaveBeenCalledWith(
        "Failed to update todo. Please try again.",
      );
    });
  });

  it("calls onDelete when the 'Delete' button is clicked", () => {
    render(
      <TodoItem todo={mockTodo} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Click the delete button
    fireEvent.click(screen.getByText("Delete"));

    // Ensure onDelete is called with the correct id
    expect(onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it("closes the modal when 'Cancel' is clicked", () => {
    render(
      <TodoItem todo={mockTodo} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Open the modal
    fireEvent.click(screen.getByText("Update"));

    // Click the cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Ensure the modal is no longer visible
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
