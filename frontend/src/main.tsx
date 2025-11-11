import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./App.tsx";
import "./index.css";
import "antd/dist/reset.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import ConfigProvider from "antd/es/config-provider/index";
ModuleRegistry.registerModules([AllCommunityModule]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
            colorSuccess: "#52c41a",
            colorWarning: "#faad14",
            colorError: "#ff4d4f",
            colorInfo: "#1890ff",

            // Layout colors
            colorBgContainer: "#ffffff",
            colorBgLayout: "#f5f5f5",
            colorBgElevated: "#ffffff",

            // Typography
            fontSize: 14,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

            // Spacing & borders
            borderRadius: 8,
            controlHeight: 38,
            colorBorder: "#d9d9d9",
            colorBorderSecondary: "#f0f0f0",
          },
          components: {
            Layout: {
              headerBg: "#1a1a2e",
              headerColor: "#ffffff",
              headerPadding: "0 32px",
            },
            Button: {
              controlHeight: 38,
              borderRadius: 8,
              primaryShadow: "0 2px 4px rgba(22,119,255,0.2)",
            },
            Menu: {
              darkItemSelectedBg: "rgba(255,255,255,0.15)",
              darkItemHoverBg: "rgba(255,255,255,0.08)",
            },
            Table: {
              borderRadius: 8,
            },
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
