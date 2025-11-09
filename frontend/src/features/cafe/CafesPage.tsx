import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCafes } from "../../api/cafes";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { Cafe } from "../../types";

const LogoRenderer = (props: { value: string }) => {
  if (!props.value) return null; // Handle cases where there's no logo
  return <img src={props.value} alt="logo" style={{ height: "30px" }} />;
};

const columnDefs: ColDef<Cafe>[] = [
  { field: "logo", headerName: "Logo", cellRenderer: LogoRenderer },
  { field: "name", headerName: "Name" },
  { field: "description", headerName: "Description" },
  { field: "location", headerName: "Location" },
  { field: "employees", headerName: "Employees" },
];

const CafesPage: React.FC = () => {
  const {
    data: cafes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cafes"],
    queryFn: () => getCafes(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;
  console.log(cafes);
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact<Cafe> rowData={cafes} columnDefs={columnDefs} />
    </div>
  );
};

export default CafesPage;
