import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, deleteTask } from "../features/tasksSlice";
import TaskForm from "../components/TaskForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { useTaskModals } from "../hooks/useTaskModals";
import "./Tasks.css";

function Tasks() {
const dispatch = useDispatch<AppDispatch>();
const tasks = useSelector((state: RootState) => state.tasks.tasks);
const {
    isTaskFormOpen,
    taskToEdit,
    isConfirmDialogOpen,
    taskToDelete,
    openTaskForm,
    closeTaskForm,
    openConfirmDialog,
    closeConfirmDialog,
} = useTaskModals();

useEffect(() => {
    dispatch(fetchTasks());
}, [dispatch]);

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
            <p className="task-meta">Start: {task.startDate}</p>
            <p className="task-meta">End: {task.endDate}</p>
            <p className="task-meta">Assignee: {task.assignee}</p>
            <p className="task-meta">Priority: {task.priority}</p>
            <p className="task-meta">Status: {task.status}</p>
            <p className="task-meta">Group: {task.group}</p>
            <p className="task-meta">Created At: {task.createdAt}</p>
            <button onClick={() => openTaskForm(task)} className="task-detail-button task-button">詳細</button>
            <button onClick={() => openConfirmDialog(task.id)} className="task-delete-button task-button">削除</button>
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