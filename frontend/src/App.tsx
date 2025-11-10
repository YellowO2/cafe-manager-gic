import { Routes, Route, Navigate } from "react-router-dom";
import CafesPage from "./features/cafe/CafesPage";
import CafeForm from "./features/cafe/CafeForm";
import EmployeesPage from "./features/employee/EmployeesPage";
import EmployeeForm from "./features/employee/EmployeeForm";
import PageLayout from "./components/PageLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        {/* Layout route:
        https://reactrouter.com/start/declarative/routing#layout-routes */}
        <Route index element={<Navigate to="/cafes" replace />} />
        <Route path="cafes" element={<CafesPage />} />
        <Route path="cafes/add" element={<CafeForm />} />
        <Route path="cafes/edit/:id" element={<CafeForm />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/add" element={<EmployeeForm />} />
        <Route path="employees/edit/:id" element={<EmployeeForm />} />
      </Route>
    </Routes>
  );
}

export default App;
