export interface Cafe {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  employees: number;
}

export interface Employee {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  days_worked: number;
  cafe: string;
}
