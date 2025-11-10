import axios from "axios";
import type { Cafe, CafeFormData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCafes = async (location?: string): Promise<Cafe[]> => {
  const response = await axios.get(`${API_BASE_URL}/cafes`, {
    params: { location },
  });
  return response.data;
};

export const getCafe = async (id: string): Promise<Cafe> => {
  const response = await axios.get(`${API_BASE_URL}/cafes/${id}`);
  return response.data;
};

export const createCafe = async (cafe: CafeFormData): Promise<Cafe> => {
  const response = await axios.post(`${API_BASE_URL}/cafes`, cafe);
  return response.data;
};

export const updateCafe = async (
  id: string,
  cafe: CafeFormData
): Promise<Cafe> => {
  const response = await axios.put(`${API_BASE_URL}/cafes/${id}`, cafe);
  return response.data;
};

export const deleteCafe = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/cafes/${id}`);
};
