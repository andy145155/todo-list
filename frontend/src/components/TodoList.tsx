import React, { FC } from "react";
import { List } from "antd";
import TodoItem from "./TodoItem";
import { Duty } from "../schema/duty";

interface TodoListProps {
  todos: Duty[];
  onUpdate: (id: number, newName: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TodoList: FC<TodoListProps> = ({ todos, onUpdate, onDelete }) => {
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <List
      bordered
      dataSource={sortedTodos}
      renderItem={(todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    />
  );
};

export default TodoList;
