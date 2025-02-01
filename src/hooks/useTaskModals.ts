import { useState } from "react";
import { Task } from "../features/tasksSlice";

export const useTaskModals = () => {
const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

const openTaskForm = (task: Task | null = null) => {
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
};

const closeTaskForm = () => {
    setTaskToEdit(null);
    setIsTaskFormOpen(false);
};

const openConfirmDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsConfirmDialogOpen(true);
};

const closeConfirmDialog = () => {
    setTaskToDelete(null);
    setIsConfirmDialogOpen(false);
};

return {
    isTaskFormOpen,
    taskToEdit,
    isConfirmDialogOpen,
    taskToDelete,
    openTaskForm,
    closeTaskForm,
    openConfirmDialog,
    closeConfirmDialog,
};
};