import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: "https://localhost:7129/api",
    headers: {
        "Content-Type": "application/json",
    }
});

export function handleAxiosError(err: unknown, action: string): never {
    if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError;
        const msg = axiosErr.response?.data && typeof axiosErr.response.data === "string" ? axiosErr.response.data : axiosErr.message;

        throw new Error(`Error ${action}: ${msg}`);
    }

    throw err instanceof Error ? err : new Error(String(err));
}
