import { api, handleAxiosError } from "./base/BaseService";
import { User } from "../models/User";

export async function getAllUsers(): Promise<User[]> {
    try {
        const { data } = await api.get<User[]>("/User/");

        return data.map((t: any) => new User(t));;;
    } catch (err) {
        handleAxiosError(err, "fetching all users");
    }
}

export async function getUser(entityIdentifier: string): Promise<User> {
    try {
        const { data } = await api.get<User>(`/User/${entityIdentifier}`);
        return new User(data);
    } catch (err) {
        handleAxiosError(err, `fetching user ${entityIdentifier}`);
    }
}

export async function createUser(user: Omit<User, "entityId">): Promise<User> {
    try {
        const { data } = await api.post<User>("/User/", user);
        return data;
    } catch (err) {
        handleAxiosError(err, "creating user");
    }
}

export async function updateUser(user: User): Promise<void> {
    try {
        await api.put("/User/", user);
    } catch (err) {
        handleAxiosError(err, `updating user ${user.entityId}`);
    }
}

export async function deleteUser(entityIdentifier: string): Promise<void> {
    try {
        await api.delete(`/User/${entityIdentifier}`);
    } catch (err) {
        handleAxiosError(err, `deleting user ${entityIdentifier}`);
    }
}