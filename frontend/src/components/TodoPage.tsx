import React, { FC, useEffect, useState } from "react";
import { Spin, Typography, message } from "antd";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../services/todoService";
import { Duty } from "../schema/duty";

const { Title } = Typography;

const TodoPage: FC = () => {
  const [todos, setTodos] = useState<Duty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const todos = await getTodos();
        setTodos(todos);
      } catch (error) {
        message.error("Failed to fetch todo. Please try again.");
        console.error("Failed to fetch todos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  const handleAddTodo = async (todoName: string) => {
    try {
      const newTodo = await createTodo(todoName);
      setTodos([...todos, newTodo]);
    } catch (error) {
      message.error("Failed to add todo. Please try again.");
      console.error("Failed to add todo:", error);
    }
  };

  const handleUpdateTodo = async (id: number, newName: string) => {
    try {
      const updatedTodo = await updateTodo(id, newName);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      message.error("Failed to update todo. Please try again.");
      console.error("Failed to update todo:", error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      message.error("Failed to delete todo. Please try again.");
      console.error("Failed to delete todo:", error);
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <Title level={2}>My To-do List</Title>
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
};

export default TodoPage;
