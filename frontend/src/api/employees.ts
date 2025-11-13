import axios from "axios";
import type { Employee, EmployeeFormData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// connect to backend employees api
export const getEmployees = async (cafeName?: string): Promise<Employee[]> => {
  const response = await axios.get(`${API_BASE_URL}/employees`, {
    params: { cafe: cafeName },
  });
  return response.data;
};

export const getEmployee = async (id: string): Promise<EmployeeFormData> => {
  const response = await axios.get(`${API_BASE_URL}/employees/${id}`);
  return response.data;
};

export const createEmployee = async (
  employee: EmployeeFormData
): Promise<EmployeeFormData> => {
  const response = await axios.post(`${API_BASE_URL}/employees`, employee);
  return response.data;
};

export const updateEmployee = async (
  id: string,
  employee: EmployeeFormData
): Promise<EmployeeFormData> => {
  const response = await axios.put(`${API_BASE_URL}/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/employees/${id}`);
};
