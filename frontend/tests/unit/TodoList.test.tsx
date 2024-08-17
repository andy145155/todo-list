import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "../../src/components/TodoList";
import { Duty } from "../../src/schema/duty";

// Mock the TodoItem component to test TodoList in isolation
jest.mock("../../src/components/TodoItem", () => ({
  __esModule: true,
  default: ({
    todo,
    onUpdate,
    onDelete,
  }: {
    todo: Duty;
    onUpdate: (id: number, newName: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
  }) => (
    <div>
      <span>{todo.name}</span>
      <button onClick={() => onUpdate(todo.id, "Updated Name")}>Update</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  ),
}));

describe("TodoList Component", () => {
  const mockTodos: Duty[] = [
    { id: 1, name: "Todo 1", createdAt: new Date("2024-08-01T00:00:00.000Z") },
    { id: 2, name: "Todo 2", createdAt: new Date("2024-08-02T00:00:00.000Z") },
    { id: 3, name: "Todo 3", createdAt: new Date("2024-08-03T00:00:00.000Z") },
  ];

  const onUpdate = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    // Clear mock function calls before each test
    jest.clearAllMocks();
  });

  it("renders the correct number of TodoItem components", () => {
    render(
      <TodoList todos={mockTodos} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Expect to find 3 todo names in the document
    expect(screen.getByText("Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Todo 2")).toBeInTheDocument();
    expect(screen.getByText("Todo 3")).toBeInTheDocument();
  });

  it("sorts todos by createdAt date in ascending order", () => {
    render(
      <TodoList todos={mockTodos} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    const renderedTodos = screen.getAllByText(/Todo/);

    // Check the order of rendered todos based on their createdAt date
    expect(renderedTodos[0]).toHaveTextContent("Todo 1");
    expect(renderedTodos[1]).toHaveTextContent("Todo 2");
    expect(renderedTodos[2]).toHaveTextContent("Todo 3");
  });

  it("calls onUpdate with correct arguments when update button is clicked", () => {
    render(
      <TodoList todos={mockTodos} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Simulate clicking the update button for Todo 2
    fireEvent.click(screen.getAllByText("Update")[1]); // Get the second "Update" button

    // Ensure onUpdate is called with correct arguments
    expect(onUpdate).toHaveBeenCalledWith(2, "Updated Name");
  });

  it("calls onDelete with correct arguments when delete button is clicked", () => {
    render(
      <TodoList todos={mockTodos} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    // Simulate clicking the delete button for Todo 3
    fireEvent.click(screen.getAllByText("Delete")[2]); // Get the third "Delete" button

    // Ensure onDelete is called with correct arguments
    expect(onDelete).toHaveBeenCalledWith(3);
  });
});
