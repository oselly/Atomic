import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import type { Task } from "../models/Task";
import type { User } from "../models/User";
import { createTask, updateTask } from "../services/TaskService";
import { useUser } from "../contexts/UserContext";

interface TaskFormDialogProps {
    open: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({ open, onClose, taskToEdit }) => {
    const { currentUser, users } = useUser();

    const [formData, setFormData] = useState<Partial<Task>>({
        title: "",
        description: "",
        dueDate: null,
        assignedTo: undefined,
        isCompleted: false,
        isCancelled: false,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setFormData(taskToEdit);
        } else {
            setFormData({
                title: "",
                description: "",
                dueDate: null,
                assignedTo: undefined,
                isCompleted: false,
                isCancelled: false,
            });
        }
    }, [taskToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleAssignedChange = (userId: string) => {
        const selectedUser = users.find((u) => u.entityId === userId);
        setFormData((prev) => ({ ...prev, assignedTo: selectedUser }));
    };

    const handleSubmit = async () => {
        if (!currentUser) {
            console.error("No current user available");
            return;
        }

        setSaving(true);
        try {
            const payload: Task = {
                ...taskToEdit,
                ...formData,
                assignedToUserId: formData.assignedTo?.id,
                createdByUserId: taskToEdit ? taskToEdit.createdByUserId : currentUser.id,
            } as Task;

            if (taskToEdit) {
                await updateTask(payload);
            } else {
                await createTask(payload);
            }

            onClose();
        } catch (err: any) {
            console.error("Failed to save task:", err.message);
        } finally {
            setSaving(false);
        }
    };

    const isEditing = Boolean(taskToEdit);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    label="Title"
                    name="title"
                    value={formData.title ?? ""}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description ?? ""}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                />
                <TextField
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 10) : ""}
                    onChange={handleChange}
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel id="assignedTo-label">Assign To</InputLabel>
                    <Select
                        labelId="assignedTo-label"
                        value={formData.assignedTo?.entityId ?? ""}
                        label="Assign To"
                        onChange={(e) => handleAssignedChange(e.target.value)}>
                        <MenuItem value="">
                            <em>Unassigned</em>
                        </MenuItem>
                        {users.map((user: User) => (
                            <MenuItem key={user.entityId} value={user.entityId}>
                                {user.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.isCompleted ?? false}
                            onChange={handleChange}
                            name="isCompleted"
                            color="primary"
                            disabled={!isEditing} // only editable for existing tasks
                        />
                    }
                    label="Completed"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.isCancelled ?? false}
                            onChange={handleChange}
                            name="isCancelled"
                            color="secondary"
                            disabled={!isEditing} // only editable for existing tasks
                        />
                    }
                    label="Cancelled"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskFormDialog;
