import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, deleteTask } from "../features/tasksSlice";
import TaskForm from "../components/TaskForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { useTaskModals } from "../hooks/useTaskModals";
import "./Table.css";

interface Task {
id: string;
title: string;
description: string;
startDate: string;
endDate: string;
assignee: string;
priority: string;
status: string;
group: string;
createdAt: string;
}

const Table: React.FC = () => {
const dispatch = useDispatch<AppDispatch>();
const tasks = useSelector((state: RootState) => state.tasks.tasks);
const [columnWidths, setColumnWidths] = useState<number[]>([200, 100, 200, 100, 100]);
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

const groupedTasks = tasks.reduce((acc: { [key: string]: Task[] }, task: Task) => {
    const group = task.group || "未分類";
    if (!acc[group]) {
    acc[group] = [];
    }
    acc[group].push(task);
    return acc;
}, {});

const handleMouseDown = (index: number, e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = columnWidths[index];

    const handleMouseMove = (e: MouseEvent) => {
    const newWidth = startWidth + (e.clientX - startX);
    setColumnWidths((prevWidths) => {
        const newWidths = [...prevWidths];
        newWidths[index] = newWidth;
        return newWidths;
    });
    };

    const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

const handleDeleteTask = () => {
    if (taskToDelete) {
    dispatch(deleteTask(taskToDelete));
    closeConfirmDialog();
    }
};

const getStatusClass = (status: string) => {
    switch (status) {
    case "完了":
        return "status-completed";
    case "作業中":
        return "status-in-progress";
    case "スタック":
        return "status-stuck";
    case "未着手":
        return "status-not-started";
    default:
        return "";
    }
};

const getPriorityClass = (priority: string) => {
    switch (priority) {
    case "⚠Important⚠":
        return "priority-important";
    case "High":
        return "priority-high";
    case "Medium":
        return "priority-medium";
    case "Low":
        return "priority-low";
    default:
        return "";
    }
};

return (
    <div className="table-container">
    <h1 className="table-title">Tasks Table</h1>
    {Object.keys(groupedTasks).map((group) => (
        <div key={group} className="task-group">
        <h2 className="group-title">{group}</h2>
        <table className="task-table">
            <thead>
            <tr>
                {["件名", "ステータス", "タイムライン", "優先度", "担当者", "操作"].map((header, index) => (
                <th key={index} style={{ width: columnWidths[index] }}>
                    <div className="resizable-header">
                    {header}
                    <div
                        className="resize-handle"
                        onMouseDown={(e) => handleMouseDown(index, e)}
                    />
                    </div>
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {groupedTasks[group].map((task) => (
                <tr key={task.id}>
                <td>{task.title}</td>
                <td className={getStatusClass(task.status)}>{task.status}</td>
                <td>{`${new Date(task.startDate).toLocaleDateString()} ⇒ ${new Date(task.endDate).toLocaleDateString()}`}</td>
                <td className={getPriorityClass(task.priority)}>{task.priority}</td>
                <td>{task.assignee}</td>
                <td>
                    <button onClick={() => openTaskForm(task)} className="task-detail-button">詳細</button>
                    <button onClick={() => openConfirmDialog(task.id)} className="task-delete-button">削除</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    ))}
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
};

export default Table;