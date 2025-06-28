import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, deleteTask } from "../features/tasksSlice";
import TaskForm from "../components/TaskForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { useTaskModals } from "../hooks/useTaskModals";
import useAuth from "../hooks/useAuth";
import "./Tasks.css";

function Tasks() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [statusFilter, setStatusFilter] = useState("全て");
    const [priorityFilter, setPriorityFilter] = useState("全て");
    
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

    // フィルタリングされたタスクを取得
    const filteredTasks = tasks.filter(task => {
        const statusMatch = statusFilter === "全て" || task.status === statusFilter;
        const priorityMatch = priorityFilter === "全て" || task.priority === priorityFilter;
        return statusMatch && priorityMatch;
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return "未設定";
        return new Date(dateString).toLocaleDateString("ja-JP");
    };

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h1 className="tasks-title">タスク管理</h1>
                <button 
                    onClick={() => openTaskForm()} 
                    className="add-task-button"
                >
                    ＋ 新しいタスク
                </button>
            </div>

            <div className="tasks-filter">
                <div>
                    <label htmlFor="status-filter">ステータス:</label>
                    <select 
                        id="status-filter"
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="全て">全て</option>
                        <option value="未着手">未着手</option>
                        <option value="進行中">進行中</option>
                        <option value="完了">完了</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="priority-filter">優先度:</label>
                    <select 
                        id="priority-filter"
                        className="filter-select"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="全て">全て</option>
                        <option value="高">高</option>
                        <option value="中">中</option>
                        <option value="低">低</option>
                    </select>
                </div>
                <div className="tasks-count">
                    {filteredTasks.length} / {tasks.length} タスク
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="empty-state">
                    <h3>タスクがありません</h3>
                    <p>新しいタスクを作成してください。</p>
                </div>
            ) : (
                <div className="task-list">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <div className={`task-status-badge status-${task.status}`}>
                                {task.status}
                            </div>
                            <h2>{task.title}</h2>
                            <p>{task.description}</p>
                            
                            <div className="task-details">
                                <div className="task-meta">
                                    <strong>開始日:</strong> {formatDate(task.startDate)}
                                </div>
                                <div className="task-meta">
                                    <strong>終了日:</strong> {formatDate(task.endDate)}
                                </div>
                                <div className="task-meta">
                                    <strong>担当者:</strong> {task.assignee || "未設定"}
                                </div>
                                <div className="task-meta">
                                    <strong>優先度:</strong> 
                                    <span className={`priority-${task.priority === '高' ? 'high' : task.priority === '中' ? 'medium' : 'low'}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="task-meta">
                                    <strong>グループ:</strong> {task.group || "未設定"}
                                </div>
                                <div className="task-meta">
                                    <strong>作成日:</strong> {formatDate(task.createdAt)}
                                </div>
                            </div>

                            <div className="task-actions">
                                <button 
                                    onClick={() => openTaskForm(task)} 
                                    className="task-detail-button task-button"
                                >
                                    編集
                                </button>
                                <button 
                                    onClick={() => openConfirmDialog(task.id)} 
                                    className="task-delete-button task-button"
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
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
}

export default Tasks;