import React from "react";
import { useUser } from "../contexts/UserContext";
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography, Box, type SelectChangeEvent } from "@mui/material";

const UserSelector: React.FC = () => {
    const { users, loading, error, currentUser, setCurrentUser, refreshUsers } = useUser();

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const selectedUser = users.find((u) => u.entityId === selectedId) || null;
        setCurrentUser(selectedUser);
    };

    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" p={2}>
                <CircularProgress size={24} />
                <Typography variant="body2" ml={2}>
                    Loading users...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error" variant="body2">
                    Failed to load users: {error}
                </Typography>
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer", mt: 1 }}
                    onClick={refreshUsers} >
                    Retry
                </Typography>
            </Box>
        );
    }

    if (!users.length) {
        return (
            <Box p={2}>
                <Typography variant="body2">No users found.</Typography>
            </Box>
        );
    }

    return (
        <FormControl fullWidth size="small" variant="outlined" error={!currentUser}>
            <InputLabel id="user-selector-label">Active User</InputLabel>
            <Select
                labelId="user-selector-label"
                value={currentUser?.entityId ?? ""}
                label="Active User"
                onChange={handleChange}>
                {users
                    .filter((u) => u.isActive)
                    .map((user) => (
                        <MenuItem key={user.entityId} value={user.entityId}>
                            {user.name}
                        </MenuItem>
                    ))}
            </Select>
            {!currentUser && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    Please select a user
                </Typography>
            )}
        </FormControl>
    );
};

export default UserSelector;
