import CustomerList from "./CustomerList";
import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { CardContent } from "@mui/material";

const { Header, Sider, Content } = Layout;

const ManageHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        style={{
          backgroundColor: "white",
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <VideoCameraOutlined />,
              label: "nav 1",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: "20%",
              height: 64,
            }}
          >
            Danh sách khách hàng
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh", // Sử dụng minHeight thay vì height
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <CustomerList />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageHome;
