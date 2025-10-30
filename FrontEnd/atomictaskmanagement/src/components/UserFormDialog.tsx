import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControlLabel, Switch } from "@mui/material";
import type { User } from "../models/User";
import { createUser, updateUser } from "../services/UserService";
import { useUser } from "../contexts/UserContext";

interface UserFormDialogProps {
    open: boolean;
    onClose: () => void;
    userToEdit?: User | null;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ open, onClose, userToEdit }) => {
    const { refreshUsers } = useUser();

    const [formData, setFormData] = useState<Partial<User>>({
        name: "",
        isActive: true,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData({ name: "", isActive: true });
        }
    }, [userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            if (userToEdit) {
                await updateUser({ ...userToEdit, ...formData } as User);
            } else {
                await createUser({ ...(formData as User), isActive: true });
            }
            await refreshUsers();
            onClose();
        } catch (err: any) {
            console.error("Failed to save user:", err.message);
        } finally {
            setSaving(false);
        }
    };

    const isEditing = Boolean(userToEdit);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField label="Name"
                        name="name"
                        value={formData.name ?? ""}
                        onChange={handleChange}
                        fullWidth
                        required />
                <FormControlLabel
                    control={
                        <Switch checked={formData.isActive ?? false}
                            onChange={handleChange}
                            name="isActive"
                            color="primary"
                            disabled={!isEditing} />
                    }
                    label="Active" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserFormDialog;