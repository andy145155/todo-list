import React from "react";
import { Layout, Menu, Typography } from "antd";
import TodoPage from "./components/TodoPage";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">To-Do List</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div style={{ margin: "16px 0" }}>
          <Title level={2}>To-Do App</Title>
          <TodoPage />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        To-Do App ©2024 Created by Andy Hsu
      </Footer>
    </Layout>
  );
};

export default App;
