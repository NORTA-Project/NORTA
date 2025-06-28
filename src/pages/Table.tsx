import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, deleteTask } from "../features/tasksSlice";
import TaskForm from "../components/TaskForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { useTaskModals } from "../hooks/useTaskModals";
import useAuth from "../hooks/useAuth";
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

const Table = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [sortField, setSortField] = useState<keyof Task>("createdAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [filterStatus, setFilterStatus] = useState("全て");
    const [filterPriority, setFilterPriority] = useState("全て");
    
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
        if (user?.uid) {
            dispatch(fetchTasks(user.uid));
        }
    }, [dispatch, user?.uid]);

    const handleDeleteTask = () => {
        if (taskToDelete) {
            dispatch(deleteTask(taskToDelete));
            closeConfirmDialog();
        }
    };

    const handleSort = (field: keyof Task) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (field: keyof Task) => {
        if (field !== sortField) return "↕";
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const filteredTasks = tasks.filter(task => {
        const statusMatch = filterStatus === "全て" || task.status === filterStatus;
        const priorityMatch = filterPriority === "全て" || task.priority === filterPriority;
        return statusMatch && priorityMatch;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return "未設定";
        return new Date(dateString).toLocaleDateString("ja-JP");
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "完了": return "status-completed";
            case "進行中": return "status-progress";
            case "未着手": return "status-pending";
            default: return "";
        }
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case "高": return "priority-high";
            case "中": return "priority-medium";
            case "低": return "priority-low";
            default: return "";
        }
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <h1 className="table-title">タスクテーブル</h1>
                <button 
                    onClick={() => openTaskForm()} 
                    className="add-task-button"
                >
                    ＋ 新しいタスク
                </button>
            </div>

            <div className="table-filters">
                <div className="filter-group">
                    <label htmlFor="status-filter">ステータス:</label>
                    <select 
                        id="status-filter"
                        className="filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="全て">全て</option>
                        <option value="未着手">未着手</option>
                        <option value="進行中">進行中</option>
                        <option value="完了">完了</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="priority-filter">優先度:</label>
                    <select 
                        id="priority-filter"
                        className="filter-select"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="全て">全て</option>
                        <option value="高">高</option>
                        <option value="中">中</option>
                        <option value="低">低</option>
                    </select>
                </div>
                <div className="tasks-count">
                    {sortedTasks.length} / {tasks.length} タスク
                </div>
            </div>

            <div className="table-wrapper">
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th 
                                className="sortable" 
                                onClick={() => handleSort("title")}
                            >
                                タイトル {getSortIcon("title")}
                            </th>
                            <th 
                                className="sortable" 
                                onClick={() => handleSort("status")}
                            >
                                ステータス {getSortIcon("status")}
                            </th>
                            <th 
                                className="sortable" 
                                onClick={() => handleSort("priority")}
                            >
                                優先度 {getSortIcon("priority")}
                            </th>
                            <th 
                                className="sortable" 
                                onClick={() => handleSort("assignee")}
                            >
                                担当者 {getSortIcon("assignee")}
                            </th>
                            <th 
                                className="sortable" 
                                onClick={() => handleSort("startDate")}
                            >
                                開始日 {getSortIcon("startDate")}
                            </th>
                            <th 
                                className="sortable" 
                                onClick={() => handleSort("endDate")}
                            >
                                終了日 {getSortIcon("endDate")}
                            </th>
                            <th 
                                className="sortable" 
                                onClick={() => handleSort("group")}
                            >
                                グループ {getSortIcon("group")}
                            </th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTasks.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="empty-row">
                                    タスクがありません
                                </td>
                            </tr>
                        ) : (
                            sortedTasks.map((task) => (
                                <tr key={task.id} className="task-row">
                                    <td className="task-title" title={task.description}>
                                        {task.title}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td>{task.assignee || "未設定"}</td>
                                    <td>{formatDate(task.startDate)}</td>
                                    <td>{formatDate(task.endDate)}</td>
                                    <td>{task.group || "未設定"}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                onClick={() => openTaskForm(task)} 
                                                className="edit-btn"
                                                title="編集"
                                            >
                                                ✎
                                            </button>
                                            <button 
                                                onClick={() => openConfirmDialog(task.id)} 
                                                className="delete-btn"
                                                title="削除"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isTaskFormOpen && <TaskForm onClose={closeTaskForm} taskToEdit={taskToEdit} />}
            {isConfirmDialogOpen && (
                <ConfirmDialog
                    message="このタスクを削除してもよろしいですか？"
                    onConfirm={handleDeleteTask}
                    onCancel={closeConfirmDialog}
                />
            )}
        </div>
    );
};

export default Table;
