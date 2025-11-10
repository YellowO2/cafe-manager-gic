import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import type { Employee } from "../../types";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { deleteEmployee, getEmployees } from "../../api/employees";
import TableActionCell from "../../components/TableActionCell";

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees(),
  });

  const handleAddNew = () => {
    navigate("/employees/add");
  };

  const columnDefs: ColDef<Employee>[] = [
    { field: "id", headerName: "Employee ID", width: 120 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email_address", headerName: "Email Address", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    { field: "days_worked", headerName: "Days Worked", flex: 1 },
    { field: "cafe", headerName: "Café", flex: 1 },
    {
      headerName: "Actions",
      cellRenderer: (params: ICellRendererParams<Employee>) => {
        if (!params.data) return null; // Handle empty rows
        return (
          <TableActionCell
            data={params.data} // Ag grid passes the row data
            editPath="/employees/edit"
            deleteFn={deleteEmployee}
            entityName="Employee"
            queryKey={["employees"]}
            deleteWarning='Are you sure you want to delete "{name}"?'
          />
        );
      },
      width: 200,
      sortable: false,
      filter: false,
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
          size="large"
        >
          Add New Employee
        </Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact<Employee> rowData={employees} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default EmployeesPage;
