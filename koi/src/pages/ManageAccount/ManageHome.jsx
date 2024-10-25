import { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import StaffList from "./ManageStaffList";
import CustomerAllKoiPondList from "./CustomerAllKoiPondList";
import ManageKoiAdmin from "./ManageKoiAdmin";
import AllAccountList from "./AllAccount";
import AllCustomers from "./AllCustomer";
import PendingAccount from "./PendingAccount";
import ManagerList from "./ManagerList";
import PendingProductList from "../Product/PendingProductList";
import ProductList from "../Product/ProductList";
import ProductListForManger from "../Product/ProductListForManager";

const { Header, Sider, Content } = Layout;

const ManageHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Lấy vai trò người dùng từ localStorage
  const userType = localStorage.getItem("usertype");

  useEffect(() => {
    if (userType === "Admin") {
      setSelectedKey("1"); // Admin vào All Account
    } else if (userType === "Manager") {
      setSelectedKey("2"); // Manager vào Staff List
    }

    if (
      userType === "Staff" ||
      userType === "Admin" ||
      userType === "Manager" ||
      userType === "Customer"
    ) {
      setMenuVisible(true);
    } else {
      setMenuVisible(false);
    }
  }, [userType]);

  const menuItems = [
    {
      key: "1",
      label: "All Account",
      roles: ["Admin"],
    },
    {
      key: "2",
      label: "Staff List",
      roles: ["Admin", "Manager"],
    },
    {
      key: "3",
      label: "Customer Koi Pond",
      roles: ["Staff", "Manager"],
    },

    {
      key: "4",
      label: "All Koi",
      roles: ["Staff", "Manager"],
    },
    {
      key: "5",
      label: "All Customer",
      roles: ["Admin", "Manager", "Staff"],
    },
    {
      key: "6",
      label: "Pending Account",
      roles: ["Admin", "Manager"],
    },
    {
      key: "7",
      label: "Manager List",
      roles: ["Admin"],
    },
    {
      key: "8",
      label: "Pending Product",
      roles: ["Staff", "Manager"],
    },
    {
      key: "9",
      label: "Onboard Product List",
      roles: ["Staff", "Manager"],
    },
    {
      key: "10",
      label: "All Product List",
      roles: ["Manager"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userType)
  );

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <AllAccountList />;
      case "3":
        return <CustomerAllKoiPondList />;
      case "2":
        return <StaffList />;
      case "4":
        return <ManageKoiAdmin />;
      case "5":
        return <AllCustomers />;
      case "6":
        return <PendingAccount />;
      case "7":
        return <ManagerList />;
      case "8":
        return <PendingProductList />;
      case "9":
        return <ProductList />;
      case "10":
        return <ProductListForManger />;

      default:
        return <AllAccountList />;
    }
  };

  return (
    <Layout>
      <Sider
        style={{ backgroundColor: "white" }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical" />
        {menuVisible && (
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            items={filteredMenuItems}
          />
        )}
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
            style={{ fontSize: "16px", width: "5%", height: 64 }}
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
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageHome;
