import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Cafe {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  employees: number;
}

export const getCafes = async (location?: string): Promise<Cafe[]> => {
  const response = await axios.get(`${API_BASE_URL}/cafes`, {
    params: { location },
  });
  return response.data;
};
