import CustomerList from "./AllAccount";
import { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import StaffList from "./ManageStaffList";
import CustomerAllKoiPondList from "./CustomerAllKoiPondList";
import ManageKoiAdmin from "./ManageKoiAdmin";
import AllAccountList from "./AllAccount";
import AllCustomers from "./AllCustomer";

const { Header, Sider, Content } = Layout;

const ManageHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const [menuVisible, setMenuVisible] = useState(false); // Trạng thái để kiểm soát hiển thị menu
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Lấy vai trò người dùng từ localStorage
  const userType = localStorage.getItem("usertype");

  useEffect(() => {
    // Kiểm tra phân quyền và quyết định xem có hiện menu hay không
    if (
      userType === "Admin" ||
      userType === "Manager" ||
      userType === "Customer"
    ) {
      setMenuVisible(true); // Chỉ hiện menu khi userType là hợp lệ
    } else {
      setMenuVisible(false); // Ẩn menu nếu không có quyền
    }
  }, [userType]);

  // Định nghĩa menu items tùy thuộc vào vai trò người dùng
  const menuItems = [
    {
      key: "1",
      label: "All Account",
      roles: ["Admin", "Manager"], // Chỉ Admin và Manager được thấy mục này
    },
    {
      key: "2",
      label: "Customer Koi Pond",
      roles: ["Customer", "Admin", "Manager"], // Ai cũng có thể thấy mục này
    },
    {
      key: "3",
      label: "Staff List",
      roles: ["Admin", "Manager"], // Chỉ Admin và Manager được thấy mục này
    },
    {
      key: "4",
      label: "All Koi",
      roles: ["Admin", "Manager"], // Chỉ Admin và Manager được thấy mục này
    },
    {
      key: "5",
      label: "All Customer",
      roles: ["Admin", "Manager"], // Chỉ Admin và Manager được thấy mục này
    },
  ];

  // Lọc menu dựa trên vai trò người dùng
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userType)
  );

  // Render nội dung dựa trên menu đã chọn
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
        {menuVisible && ( // Chỉ hiện menu khi menuVisible là true
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            items={filteredMenuItems} // Hiển thị menu đã lọc theo vai trò
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
          {renderContent()} {/* Render component tương ứng với mục đã chọn */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageHome;
