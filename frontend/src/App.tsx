import { Routes, Route, Navigate } from "react-router-dom";
import CafesPage from "./features/cafe/CafesPage";
import EmployeesPage from "./features/employee/EmployeesPage";
import PageLayout from "./components/PageLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        {/* Layout route:
        https://reactrouter.com/start/declarative/routing#layout-routes */}
        <Route index element={<Navigate to="/cafes" replace />} />
        <Route path="cafes" element={<CafesPage />} />
        <Route path="employees" element={<EmployeesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
