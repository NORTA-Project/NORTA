import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, deleteTask } from "../features/tasksSlice";
import TaskForm from "../components/TaskForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { useTaskModals } from "../hooks/useTaskModals";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
const [columnOrder, setColumnOrder] = useState<string[]>([
    "件名",
    "ステータス",
    "タイムライン",
    "優先度",
    "担当者",
    "操作",
]);
const [columnWidths, setColumnWidths] = useState<number[]>([200, 100, 200, 100, 100, 100]);
const [groupedTasks, setGroupedTasks] = useState<{ [key: string]: Task[] }>({});
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

useEffect(() => {
    const grouped = tasks.reduce((acc: { [key: string]: Task[] }, task: Task) => {
    const group = task.group || "未分類";
    if (!acc[group]) {
        acc[group] = [];
    }
    acc[group].push(task);
    return acc;
    }, {});
    setGroupedTasks(grouped);
}, [tasks]);

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

const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    if (dragIndex === 0 || hoverIndex === 0 || dragIndex === columnOrder.length - 1 || hoverIndex === columnOrder.length - 1) {
    return;
    }
    const newColumnOrder = [...columnOrder];
    const [draggedColumn] = newColumnOrder.splice(dragIndex, 1);
    newColumnOrder.splice(hoverIndex, 0, draggedColumn);
    setColumnOrder(newColumnOrder);
}, [columnOrder]);

const ColumnHeader: React.FC<{ header: string; index: number }> = ({ header, index }) => {
    const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { index },
    collect: (monitor) => ({
        isDragging: monitor.isDragging(),
    }),
    });

    const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (item: { index: number }) => {
        if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
        }
    },
    });

    return (
    <th ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1, width: columnWidths[index] }}>
        <div className="resizable-header">
        {header}
        <div
            className="resize-handle"
            onMouseDown={(e) => handleMouseDown(index, e)}
        />
        </div>
    </th>
    );
};

const moveGroup = useCallback((dragIndex: number, hoverIndex: number) => {
    const newGroupedTasks = Object.keys(groupedTasks);
    const [draggedGroup] = newGroupedTasks.splice(dragIndex, 1);
    newGroupedTasks.splice(hoverIndex, 0, draggedGroup);
    const reorderedGroupedTasks = newGroupedTasks.reduce((acc: { [key: string]: Task[] }, group) => {
    acc[group] = groupedTasks[group];
    return acc;
    }, {});
    setGroupedTasks(reorderedGroupedTasks);
}, [groupedTasks]);

const GroupTitle: React.FC<{ group: string; index: number }> = ({ group, index }) => {
    const [{ isDragging }, drag] = useDrag({
    type: "GROUP",
    item: { index },
    collect: (monitor) => ({
        isDragging: monitor.isDragging(),
    }),
    });

    const [, drop] = useDrop({
    accept: "GROUP",
    hover: (item: { index: number }) => {
        if (item.index !== index) {
        moveGroup(item.index, index);
        item.index = index;
        }
    },
    });

    return (
    <h2 ref={(node) => drag(drop(node))} className="group-title" style={{ opacity: isDragging ? 0.5 : 1 }}>
        {group}
    </h2>
    );
};

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

return (
    <DndProvider backend={HTML5Backend}>
    <div className="table-container">
        <h1 className="table-title">Tasks Table</h1>
        {Object.keys(groupedTasks).map((group, index) => (
        <div key={group} className="task-group">
            <GroupTitle group={group} index={index} />
            <table className="task-table">
            <thead>
                <tr>
                {columnOrder.map((header, index) => (
                    <ColumnHeader key={header} header={header} index={index} />
                ))}
                </tr>
            </thead>
            <tbody>
                {groupedTasks[group].map((task) => (
                <tr key={task.id}>
                    {columnOrder.map((header) => {
                    switch (header) {
                        case "件名":
                        return <td key={header}>{task.title}</td>;
                        case "ステータス":
                        return <td key={header} className={getStatusClass(task.status)}>{task.status}</td>;
                        case "タイムライン":
                        return <td key={header}>{`${new Date(task.startDate).toLocaleDateString()} ⇒ ${new Date(task.endDate).toLocaleDateString()}`}</td>;
                        case "優先度":
                        return <td key={header} className={getPriorityClass(task.priority)}>{task.priority}</td>;
                        case "担当者":
                        return <td key={header}>{task.assignee}</td>;
                        case "操作":
                        return (
                            <td key={header}>
                            <button onClick={() => openTaskForm(task)} className="task-detail-button">詳細</button>
                            <button onClick={() => openConfirmDialog(task.id)} className="task-delete-button">削除</button>
                            </td>
                        );
                        default:
                        return null;
                    }
                    })}
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
    </DndProvider>
);
};

export default Table;