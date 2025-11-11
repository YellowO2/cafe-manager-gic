import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import type { Employee } from "../../types";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { deleteEmployee, getEmployees } from "../../api/employees";
import TableActionCell from "../../components/TableActionCell";
import PageHeader from "../../components/PageHeader";

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cafeId = searchParams.get("cafe");
  const cafeName = searchParams.get("cafeName");

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees", cafeId],
    queryFn: () => getEmployees(cafeId ?? undefined),
  });

  const handleAddNew = () => {
    navigate("/employees/add");
  };

  const columnDefs: ColDef<Employee>[] = [
    { field: "id", headerName: "Employee ID", width: 120 },
    { field: "name", headerName: "Name", flex: 1, filter: true },
    { field: "email_address", headerName: "Email Address", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    { field: "days_worked", headerName: "Days Worked", flex: 1 },
    { field: "cafe", headerName: "Café", flex: 1, filter: true },
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

  // Build page title
  const pageTitle = cafeName ? `Employees of Cafe ${cafeName}` : "Employees";

  return (
    <div>
      <PageHeader
        title={pageTitle}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Employee
          </Button>
        }
      />
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact<Employee> rowData={employees} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default EmployeesPage;
