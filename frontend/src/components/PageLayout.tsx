// src/components/PageLayout.tsx
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const navItems = [
  { key: "cafes", label: <Link to="/cafes">Cafes</Link> },
  { key: "employees", label: <Link to="/employees">Employees</Link> },
];

const PageLayout = () => {
  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", // Modern gradient
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: "22px",
            fontWeight: "700",
            marginRight: "64px",
            whiteSpace: "nowrap",
            letterSpacing: "-0.5px",
          }}
        >
          ☕ Café Manager
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["cafes"]}
          items={navItems}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            background: "transparent",
            fontSize: "15px",
          }}
        />
      </Header>
      <Content
        style={{
          padding: "32px 24px",
          background: "#f5f5f5",
          flex: 1,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            background: "#fff",
            minHeight: 280,
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
          }}
        >
          <Outlet />
        </div>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          background: "#fafafa",
          padding: "20px 50px",
          borderTop: "1px solid #e8e8e8",
          fontSize: "13px",
          color: "#8c8c8c",
        }}
      >
        <div>Café Employee Manager © {new Date().getFullYear()}</div>
        <div style={{ fontSize: "12px", marginTop: "4px", color: "#bfbfbf" }}>
          Built with React, Ant Design & AG Grid
        </div>
      </Footer>
    </Layout>
  );
};

export default PageLayout;
