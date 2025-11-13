// ======== What the employees and cafes BACKEND API returns ===========
export interface Cafe {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  employees: number;
}

export interface CafeFormData {
  name: string;
  description: string;
  logo?: string;
  location: string;
}

export interface Employee {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  days_worked: number;
  cafe: string;
}

// ======== What the employee data that sends to backend look like===========
type Gender = "male" | "female";

export interface EmployeeFormData {
  name: string;
  email_address: string;
  phone_number: string;
  gender: Gender;
  start_date?: string;
  cafeId?: string;
}
