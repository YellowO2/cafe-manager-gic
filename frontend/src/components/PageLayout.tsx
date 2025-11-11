// src/components/PageLayout.tsx
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { CoffeeOutlined, TeamOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const PageLayout = () => {
  const location = useLocation();

  // Determine which menu item is selected based on current path
  const selectedKey = location.pathname.startsWith("/employees")
    ? "employees"
    : "cafes";

  const menuItems = [
    {
      key: "cafes",
      icon: <CoffeeOutlined />,
      label: <Link to="/cafes">Cafés</Link>,
    },
    {
      key: "employees",
      icon: <TeamOutlined />,
      label: <Link to="/employees">Employees</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fafafaff",
          paddingInline: 48,
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 9px rgba(0, 0, 0, 0.08)",
          position: "sticky",
        }}
      >
        {/* Logo/App Name */}
        <Link
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1890ff",
            marginRight: "48px",
          }}
          to="/"
        >
          Café Manager
        </Link>

        {/* Navigation Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            flex: 1,
            border: "none",
            background: "#fafafaff",
            fontSize: "15px",
          }}
        />
      </Header>

      <Content
        style={{
          padding: "48px",
          background: "#f5f5f5",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default PageLayout;
