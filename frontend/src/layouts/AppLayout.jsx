import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function Layout() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: theme.layoutBg,
        overflow: "hidden",
        transition: "background .3s ease",
      }}
    >
      <Sidebar />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Header />
        <main style={{ flex: 1, overflowY: "auto", padding: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const AppLayout = () => (
  <ThemeProvider>
    <Layout />
  </ThemeProvider>
);

export default AppLayout;