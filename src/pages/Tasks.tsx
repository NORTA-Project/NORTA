import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, deleteTask } from "../features/tasksSlice";
import TaskForm from "../components/TaskForm";
import ConfirmDialog from "../components/ConfirmDialog";
import "./Tasks.css";

function Tasks() {
const dispatch = useDispatch<AppDispatch>();
const tasks = useSelector((state: RootState) => state.tasks.tasks);
const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
const [taskToEdit, setTaskToEdit] = useState<{
    id: string;
    title: string;
    description: string;
    dueDate: string;
    assignee: string;
    priority: string;
} | null>(null);
const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

useEffect(() => {
    dispatch(fetchTasks());
}, [dispatch]);

const openTaskForm = (task: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    assignee: string;
    priority: string;
} | null = null) => {
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

const handleDeleteTask = () => {
    if (taskToDelete) {
    dispatch(deleteTask(taskToDelete));
    closeConfirmDialog();
    }
};

return (
    <div className="tasks-container">
    <h1 className="tasks-title">Tasks</h1>
    <div className="task-list">
        {tasks.map((task) => (
        <div key={task.id} className="task-card">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p className="task-meta">Due: {task.dueDate}</p>
            <p className="task-meta">Assignee: {task.assignee}</p>
            <p className="task-meta">Priority: {task.priority}</p>
            <button onClick={() => openTaskForm(task)} className="task-edit-button task-button">Edit</button>
            <button onClick={() => openConfirmDialog(task.id)} className="task-delete-button task-button">Delete</button>
            
        </div>
        ))}
    </div>
    {isTaskFormOpen && <TaskForm onClose={closeTaskForm} taskToEdit={taskToEdit} />}
    {isConfirmDialogOpen && (
        <ConfirmDialog
        message="Are you sure you want to delete this task?"
        onConfirm={handleDeleteTask}
        onCancel={closeConfirmDialog}
        />
    )}
    </div>
);
}

export default Tasks;