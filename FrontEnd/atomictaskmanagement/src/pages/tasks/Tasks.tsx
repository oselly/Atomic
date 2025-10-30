import React, { useEffect, useState } from "react";
import type { Task } from "../../models/Task";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getAllTasks, deleteTask, updateTask } from "../../services/TaskService";
import { useUser } from "../../contexts/UserContext";
import TaskFormDialog from "../../components/TaskFormDialog";


const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<"complete" | "delete" | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { currentUser } = useUser();


    const fetchTasks = async () => {
        try {
            const response = await getAllTasks(true);
            setTasks(response);
        } catch (err: any) {
            setError(err.message || "Failed to load tasks");

            return null;

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDialogOpen = (action: "complete" | "delete", task: Task) => {
        setSelectedTask(task);
        setDialogAction(action);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedTask(null);
        setDialogAction(null);
    };

    const handleConfirmAction = async () => {
        if (!selectedTask || !dialogAction) return;

        try {
            switch (dialogAction) {
                case "complete":
                    selectedTask.setCompleted(currentUser!.id!);
                    await updateTask(selectedTask);
                    break;
                case "delete":
                    await deleteTask(selectedTask.entityId!);
                    break;
            }

            fetchTasks();
        } catch (err: any) {
            setError(err.message || "Failed to confirm action");
        } finally {
            handleDialogClose();
        }
    };

    const columns: GridColDef<(Task)>[] = [
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'assignedTo', headerName: 'Assigned to', width: 150, valueGetter: (value, row) => row.assignedTo ? row.assignedTo.name : '' },
        { field: 'dueDate', headerName: 'Due Date', width: 150, valueGetter: (value, row) => row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-GB") : '' },
        { field: 'description', headerName: 'Description', width: 150 },
        { field: 'createdBy', headerName: 'Created by', width: 150, valueGetter: (value, row) => row.createdBy ? `${row.createdBy.name}` : '' },
        { field: 'createdDate', headerName: 'Created Date', width: 150, valueGetter: (value, row) => new Date(row.createdDate!).toLocaleDateString("en-GB") },
        { field: 'isCompleted', headerName: 'Completed', width: 150, valueGetter: (value, row) => row.isCompleted && row.completedDate ? `Yes - ${new Date(row.completedDate).toLocaleDateString("en-GB")}` : 'No' },
        {
            field: 'actions', headerName: 'Actions', width: 150,
            renderCell: (params) => (
                <ButtonGroup variant="contained" aria-label="action button group">
                    <IconButton onClick={() => { setEditingTask(params.row); setFormOpen(true); }} color="secondary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDialogOpen("complete", params.row)} color="primary">
                        <CheckIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDialogOpen("delete", params.row)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </ButtonGroup>
            ),
        },
    ];

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const dialogMessages = {
        complete: { title: "Confirm Completion", message: `Are you sure you want to mark "${selectedTask?.title}" as completed?` },
        delete: { title: "Confirm Deletion", message: `Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.` }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mt: 4, width: "100%" }}>
            <Button variant="contained" color="primary"
                onClick={() => {
                    setEditingTask(null);
                    setFormOpen(true);
                }}
                sx={{ mb: 2 }}>
                Add Task
            </Button>

            <Box sx={{ alignSelf: "flex-start" }}>
                <DataGrid rows={tasks}
                columns={columns}
                disableRowSelectionOnClick
                initialState={{
                    pagination: { paginationModel: { pageSize: 20 } },
                }}
                pageSizeOptions={[20]} />
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

            <TaskFormDialog open={formOpen}
                onClose={() => { setFormOpen(false); fetchTasks(); }}
                taskToEdit={editingTask}
            />
        </Box>
    );
};

export default Tasks;