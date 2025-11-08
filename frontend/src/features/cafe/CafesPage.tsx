import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCafes } from "../../api/cafes";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef } from "ag-grid-community";
import type { Cafe } from "../../types";

const CafesPage: React.FC = () => {
  const {
    data: cafes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cafes"],
    queryFn: () => getCafes(),
  });

  const columnDefs: ColDef<Cafe>[] = [
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
    { field: "employees", headerName: "Employees" },
    { field: "location", headerName: "Location" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <h2>Cafes</h2>
      {cafes?.map((cafe) => (
        <div key={cafe.id}>
          <h3>{cafe.name}</h3>
          <p>{cafe.description}</p>
          <p>Location: {cafe.location}</p>
          <p>Employees: {cafe.employees}</p>
          <hr />
        </div>
      ))}
      {/* <AgGridReact<Cafe> rowData={cafes} columnDefs={columnDefs} /> */}
    </div>
  );
};

export default CafesPage;
