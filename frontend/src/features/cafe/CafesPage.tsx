import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCafes } from "../../api/cafes";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import type { Cafe } from "../../types";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableActionCell from "../../components/TableActionCell";
import { deleteCafe } from "../../api/cafes";

const LogoRenderer = (props: { value: string }) => {
  if (!props.value) return null; // Handle cases where there's no logo
  return <img src={props.value} alt="logo" style={{ height: "30px" }} />;
};

const CafesPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: cafes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cafes"],
    queryFn: () => getCafes(),
  });

  const handleAddNew = () => {
    navigate("/cafes/add");
  };

  const columnDefs: ColDef<Cafe>[] = [
    {
      field: "logo",
      headerName: "Logo",
      cellRenderer: LogoRenderer,
      width: 100,
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      filter: true, // Enable filtering
    },
    {
      field: "employees",
      headerName: "Employees",
      width: 120,
      cellRenderer: (params: ICellRendererParams<Cafe>) => {
        if (!params.data) return null;

        return (
          <Button
            type="link"
            onClick={() => navigate(`/employees?cafe=${params.data?.id}`)}
            style={{ padding: 0 }}
          >
            {params.value}
          </Button>
        );
      },
    },
    {
      headerName: "Actions",
      cellRenderer: (params: ICellRendererParams<Cafe>) => {
        if (!params.data) return null; // Handle empty rows
        return (
          <TableActionCell
            data={params.data} // Ag grid passes the row data
            editPath="/cafes/edit"
            deleteFn={deleteCafe}
            entityName="Café"
            queryKey={["cafes"]}
            deleteWarning='Are you sure you want to delete "{name}"? This will also delete all employees under this café.'
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
          Add New Café
        </Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact<Cafe> rowData={cafes} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default CafesPage;
