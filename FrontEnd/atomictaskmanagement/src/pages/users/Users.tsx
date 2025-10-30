import React, { useState } from "react";
import type { User } from "../../models/User";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import ConfirmDialog from "../../components/ConfirmDialog";
import { updateUser } from "../../services/UserService";
import { useUser } from "../../contexts/UserContext";
import UserFormDialog from "../../components/UserFormDialog";

const Users: React.FC = () => {
    const { users, loading, error, refreshUsers, currentUser } = useUser();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<"activate" | "deactivate" | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleDialogOpen = (action: "activate" | "deactivate", user: User) => {
        setSelectedUser(user);
        setDialogAction(action);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedUser(null);
        setDialogAction(null);
    };

    const handleConfirmAction = async () => {
        if (!selectedUser || !dialogAction) return;

        try {
            selectedUser.isActive = dialogAction === "activate";
            await updateUser(selectedUser);
            await refreshUsers();
        } catch (err: any) {
            console.error(err.message || "Failed to perform action");
        } finally {
            handleDialogClose();
        }
    };

    const columns: GridColDef<User>[] = [
        { field: "name", headerName: "Name", width: 200 },
        {
            field: "isActive",
            headerName: "Active",
            width: 120,
            valueGetter: (value, row) => (row.isActive ? "Yes" : "No"),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 160,
            filterable: false,
            renderCell: (params) => {
                const isSelf = currentUser && params.row.entityId === currentUser.entityId;
                const isActive = params.row.isActive;

                return (
                    <ButtonGroup variant="contained" aria-label="action button group">
                        <IconButton onClick={() => { setEditingUser(params.row); setFormOpen(true); }}
                            color="secondary">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDialogOpen(isActive ? "deactivate" : "activate", params.row)}
                            color="error"
                            disabled={Boolean(isSelf && isActive)}
                            title={ isSelf && isActive ? "You cannot deactivate your own account" : isActive ? "Deactivate user" : "Activate user" }>
                            {isActive ? <DeleteIcon /> : <RestoreFromTrashIcon />}
                        </IconButton>
                    </ButtonGroup>
                )
            }
        }
    ];

    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const dialogMessages = {
        activate: { title: "Confirm Activation", message: `Are you sure you want to activate "${selectedUser?.name}"?` },
        deactivate: { title: "Confirm Deactivation", message: `Are you sure you want to deactivate "${selectedUser?.name}"?` }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mt: 4, width: "100%" }}>
            <Button variant="contained"
                color="primary"
                onClick={() => {
                    setEditingUser(null);
                    setFormOpen(true);
                }}
                sx={{ mb: 2 }}>
                Add User
            </Button>

            <Box sx={{ alignSelf: "flex-start" }}>
                <DataGrid rows={users}
                    columns={columns}
                    getRowId={(row) => row.entityId || row.id || Math.random()}
                    disableRowSelectionOnClick
                    initialState={{ pagination: { paginationModel: { pageSize: 10 }}}}
                    pageSizeOptions={[10]} />
            </Box>

            {dialogAction && (
                <ConfirmDialog open={dialogOpen}
                    title={dialogMessages[dialogAction].title}
                    message={dialogMessages[dialogAction].message}
                    onConfirm={handleConfirmAction}
                    onCancel={handleDialogClose}
                    confirmText="Yes"
                    cancelText="No" />
            )}

            <UserFormDialog open={formOpen}
                onClose={() => setFormOpen(false)}
                userToEdit={editingUser} />
        </Box>
    );
};

export default Users;