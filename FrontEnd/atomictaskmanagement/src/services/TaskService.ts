import { api, handleAxiosError } from "./base/BaseService";
import { Task } from "../models/Task";

export async function getAllTasks(removeCancelledTasks: boolean): Promise<Task[]> {
    try {
        const { data } = await api.get<Task[]>(`/Task?${removeCancelledTasks ? "isCancelled=false" : ""}`);

        return data.map((t: any) => new Task(t));;
    } catch (err) {
        handleAxiosError(err, "fetching all tasks");
    }
}

export async function getTask(entityIdentifier: string): Promise<Task> {
    try {
        const { data } = await api.get<Task>(`/Task/${entityIdentifier}`);
        return new Task(data);
    } catch (err) {
        handleAxiosError(err, `fetching task ${entityIdentifier}`);
    }
}

export async function createTask(task: Omit<Task, "entityId">): Promise<Task> {
    try {
        const { data } = await api.post<Task>("/Task/", task);
        return data;
    } catch (err) {
        handleAxiosError(err, "creating task");
    }
}

export async function updateTask(task: Task): Promise<void> {
    try {
        await api.put("/Task/", task);
    } catch (err) {
        handleAxiosError(err, `updating task ${task.entityId}`);
    }
}

export async function deleteTask(entityIdentifier: string): Promise<void> {
    try {
        await api.delete(`/Task/${entityIdentifier}`);
    } catch (err) {
        handleAxiosError(err, `deleting task ${entityIdentifier}`);
    }
}