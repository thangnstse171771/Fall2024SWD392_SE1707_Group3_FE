import CustomerList from "./AllAccount";
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import StaffList from "./ManageStaffList";
// import KoiPondList from "./CustomerAllKoiPondList";
import CustomerAllKoiPondList from "./CustomerAllKoiPondList";
import ManageKoiAdmin from "./ManageKoiAdmin";
import AllAccountList from "./AllAccount";
import AllCustomers from "./AllCustomer";

const { Header, Sider, Content } = Layout;

const ManageHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1"); // State to track selected menu item
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Function to render the content based on the selected key
  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <AllAccountList />;
      case "2":
        return <CustomerAllKoiPondList />;
      case "3":
        return <StaffList />;
      case "4":
        return <ManageKoiAdmin />;
      case "5":
        return <AllCustomers />;
      default:
        return <CustomerList />;
    }
  };

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
          selectedKeys={[selectedKey]} // Bind selectedKeys to selected state
          onClick={(e) => setSelectedKey(e.key)} // Update selectedKey when a menu item is clicked
          items={[
            {
              key: "1",
              label: "All Account",
            },
            {
              key: "2",
              label: "Customer Koi Pond",
            },
            {
              key: "3",
              label: "Staff List",
            },
            {
              key: "4",
              label: "All Koi",
            },
            {
              key: "5",
              label: "All Customer",
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
              width: "5%",
              height: 64,
            }}
          >
            Nav
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()} {/* This will render the selected component */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageHome;
