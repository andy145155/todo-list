import React, { FC, useState } from "react";
import { Input, Button, Form } from "antd";

interface AddTodoFormProps {
  onAddTodo: (name: string) => void;
}

const AddTodoForm: FC<AddTodoFormProps> = ({ onAddTodo }) => {
  // Init the form
  const [form] = Form.useForm();
  const [todoName, setTodoName] = useState<string>("");

  const handleAdd = () => {
    if (todoName.trim()) {
      // Pass the name to the parent component
      onAddTodo(todoName);

      // Reset the form after submission
      form.resetFields();

      setTodoName("");
    }
  };

  return (
    <Form form={form} onFinish={handleAdd}>
      <Form.Item
        name="todo"
        rules={[
          { required: true, message: "Please input a task name!" },
          { max: 255, message: "Task name cannot exceed 255 characters" },
        ]}
      >
        <Input
          placeholder="Enter a new task"
          value={todoName}
          onChange={(e) => setTodoName(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Task
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddTodoForm;
