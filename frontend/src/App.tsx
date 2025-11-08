import { Routes, Route, Navigate, Link } from "react-router-dom";
import CafesPage from "./features/cafe/CafesPage";
import EmployeesPage from "./features/employee/EmployeesPage";
import { Button } from "antd";

function App() {
  return (
    <>
      <nav>
        <ul>
          <Button type="primary">Hello Antd</Button>;
          <li>
            <Link to="/cafes">Cafes</Link>
          </li>
          <li>
            <Link to="/employees">Employees</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/cafes" />} />
          <Route path="/cafes" element={<CafesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
