import { createBrowserRouter, Navigate } from "react-router-dom";
import CafesPage from "./features/cafe/CafesPage";
import CafeForm from "./features/cafe/CafeForm";
import EmployeesPage from "./features/employee/EmployeesPage";
import EmployeeForm from "./features/employee/EmployeeForm";
import PageLayout from "./components/PageLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/cafes" replace />,
      },
      {
        path: "cafes",
        element: <CafesPage />,
      },
      {
        path: "cafes/add",
        element: <CafeForm />,
      },
      {
        path: "cafes/edit/:id",
        element: <CafeForm />,
      },
      {
        path: "employees",
        element: <EmployeesPage />,
      },
      {
        path: "employees/add",
        element: <EmployeeForm />,
      },
      {
        path: "employees/edit/:id",
        element: <EmployeeForm />,
      },
    ],
  },
]);

export default router;
