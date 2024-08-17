import { FC, useState } from "react";
import { List, Button, Modal, Input, Form } from "antd";
import { Duty } from "../schema/duty";
import { formatDate } from "../utils/formatData";

interface TodoItemProps {
  todo: Duty;
  onUpdate: (id: number, newName: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TodoItem: FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({ name: todo.name }); // Set initial value
  };

  const handleOk = async () => {
    try {
      setIsUpdating(true);
      const values = await form.validateFields(); // Validate form fields
      await onUpdate(todo.id, values.name); // Use form values for the update
      setIsModalVisible(false); // Close modal on success
    } catch (error) {
      console.error("Failed to update todo:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <List.Item
        actions={[
          <Button type="link" onClick={showModal}>
            Update
          </Button>,
          <Button type="link" danger onClick={() => onDelete(todo.id)}>
            Delete
          </Button>,
        ]}
      >
        <div>
          <strong>{todo.name}</strong>
          <p>Created at: {formatDate(todo.createdAt)}</p>
        </div>
      </List.Item>

      <Modal
        title="Update Task"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isUpdating}
      >
        <Form form={form} layout="vertical" name="updateTodoForm">
          <Form.Item
            name="name"
            label="Task Name"
            rules={[
              { required: true, message: "Please input a task name!" },
              { max: 255, message: "Task name cannot exceed 255 characters" },
            ]}
          >
            <Input placeholder="Enter new name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TodoItem;
