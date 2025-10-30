import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from '../models/User';
import { getAllUsers } from "../services/UserService";

interface UserContextType {
    users: User[];
    loading: boolean;
    error: string | null;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUserState] = useState<User | null>(null);

    const fetchUsers = async (): Promise<User[] | null> => {
        setLoading(true);
        setError(null);

        try {
            var users = await getAllUsers();
            setUsers(users);

            return users;

        } catch (err: any) {
            setError(err.message || "Failed to load users");

            return null;

        } finally {
            setLoading(false);
        }
    };

    const refreshUsers = async () => {
        await fetchUsers();
    };

    const LOCAL_STORAGE_KEY = "activeUser";

    const setCurrentUser = (user: User | null) => {
        setCurrentUserState(user);
        if (user) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            const fetched = await fetchUsers();
            if (!fetched) return;

            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);

            if (saved) {
                try {
                    const parsed = JSON.parse(saved) as User;
                    const stillExists = fetched.find((u) => u.entityId === parsed.entityId && u.isActive);

                    if (stillExists) {
                        setCurrentUserState(stillExists);
                    } else {
                        localStorage.removeItem(LOCAL_STORAGE_KEY);
                    }
                } catch {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                }
            }
        };

        initialize();
    }, []);

    return (
        <UserContext.Provider value={{ users, loading, error, currentUser, setCurrentUser, refreshUsers }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};