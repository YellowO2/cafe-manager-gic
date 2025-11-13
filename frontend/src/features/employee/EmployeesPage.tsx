import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import type { Employee } from "../../types";
import { Alert, Button, Spin } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { deleteEmployee, getEmployees } from "../../api/employees";
import TableActionCell from "../../components/TableActionCell";
import PageHeader from "../../components/PageHeader";

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cafeName = searchParams.get("cafe");

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees", cafeName],
    queryFn: () => getEmployees(cafeName ?? undefined),
  });

  const handleAddNew = () => {
    navigate("/employees/add");
  };

  const columnDefs: ColDef<Employee>[] = [
    { field: "id", headerName: "Employee ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1, filter: true },
    { field: "email_address", headerName: "Email Address", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
      field: "days_worked",
      headerName: "Days Worked",
      flex: 1,
      valueFormatter: (params) => {
        const v = params.value as number | null | undefined;
        if (v == null) return "";
        if (v < 0) return `Starts in ${Math.abs(v)} days`;
        return `${v}`;
      },
    },
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

  if (isLoading)
    return (
      <Spin
        style={{ marginTop: 64, width: "100%" }}
        indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
      />
    );
  if (error)
    return (
      <Alert
        style={{ marginTop: 24 }}
        type="error"
        showIcon
        message="Failed to load employees"
        description={(error as Error).message}
      />
    );

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
      <div style={{ height: 450, width: "100%" }}>
        <AgGridReact<Employee>
          rowData={employees}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 15, 25, 50]}
        />
      </div>
    </div>
  );
};

export default EmployeesPage;
