import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TodoPage from "../../src/components/TodoPage";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../../src/services/todoService";
import { message } from "antd";
import { Duty } from "../../src/schema/duty";

// Mock services
jest.mock("../../src/services/todoService");

// Mock child components
jest.mock(
  "../../src/components/AddTodoForm",
  () =>
    ({ onAddTodo }: { onAddTodo: (name: string) => void }) => {
      return (
        <div>
          <input
            placeholder="Enter a new task"
            onChange={(e) => onAddTodo(e.target.value)}
          />
          <button onClick={() => onAddTodo("New Todo")}>Add Task</button>
        </div>
      );
    },
);

jest.mock(
  "../../src/components/TodoList",
  () =>
    ({
      todos,
      onUpdate,
      onDelete,
    }: {
      todos: Duty[];
      onUpdate: (id: number, newName: string) => Promise<void>;
      onDelete: (id: number) => Promise<void>;
    }) => (
      <div>
        {todos.map((todo: Duty) => (
          <div key={todo.id}>
            <span>{todo.name}</span>
            <button onClick={() => onUpdate(todo.id, "Updated Name")}>
              Update
            </button>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
    ),
);

// Mock Ant Design message
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("TodoPage Component", () => {
  const mockTodos: Duty[] = [
    {
      id: 1,
      name: "Test Todo 1",
      createdAt: new Date("2024-08-01T00:00:00.000Z"),
    },
    {
      id: 2,
      name: "Test Todo 2",
      createdAt: new Date("2024-08-02T00:00:00.000Z"),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays the loading spinner while fetching todos", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);

    render(<TodoPage />);

    // Check for the presence of the spinner by its className
    expect(document.querySelector(".ant-spin")).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(() => {
      expect(document.querySelector(".ant-spin")).not.toBeInTheDocument();
    });

    // Ensure todos are rendered by the mocked TodoList
    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  it("displays an error message if fetching todos fails", async () => {
    (getTodos as jest.Mock).mockRejectedValue(new Error("Fetch error"));

    render(<TodoPage />);

    // Wait for the error message to be shown
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "Failed to fetch todo. Please try again.",
      );
    });

    // Spinner should not be present after error
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("adds a new todo", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (createTodo as jest.Mock).mockResolvedValue({
      id: 3,
      name: "New Todo",
      createdAt: new Date("2024-08-03T00:00:00.000Z"),
    });

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate adding a new todo
    fireEvent.click(screen.getByText("Add Task"));

    // Wait for the todo to be added
    await waitFor(() => {
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });

    expect(createTodo).toHaveBeenCalledWith("New Todo");
  });

  it("updates a todo", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (updateTodo as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Updated Name",
      createdAt: new Date("2024-08-01T00:00:00.000Z"),
    });

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate updating a todo via the mocked TodoList
    fireEvent.click(screen.getAllByText("Update")[0]); // First update button

    // Wait for the todo to be updated
    await waitFor(() => {
      expect(updateTodo).toHaveBeenCalledWith(1, "Updated Name");
    });
  });

  it("deletes a todo", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (deleteTodo as jest.Mock).mockResolvedValue(Promise.resolve());

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate deleting a todo via the mocked TodoList
    fireEvent.click(screen.getAllByText("Delete")[0]); // First delete button

    // Wait for the todo to be removed
    await waitFor(() => {
      expect(deleteTodo).toHaveBeenCalledWith(1);
    });
  });

  it("displays an error message if adding a todo fails", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (createTodo as jest.Mock).mockRejectedValue(new Error("Add error"));

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate adding a new todo
    fireEvent.click(screen.getByText("Add Task"));

    // Wait for the error message
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "Failed to add todo. Please try again.",
      );
    });
  });

  it("displays an error message if updating a todo fails", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (updateTodo as jest.Mock).mockRejectedValue(new Error("Update error"));

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate updating a todo via the mocked TodoList
    fireEvent.click(screen.getAllByText("Update")[0]); // First update button

    // Wait for the error message
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "Failed to update todo. Please try again.",
      );
    });
  });

  it("displays an error message if deleting a todo fails", async () => {
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (deleteTodo as jest.Mock).mockRejectedValue(new Error("Delete error"));

    render(<TodoPage />);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Simulate deleting a todo via the mocked TodoList
    fireEvent.click(screen.getAllByText("Delete")[0]); // First delete button

    // Wait for the error message
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "Failed to delete todo. Please try again.",
      );
    });
  });
});
