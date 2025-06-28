import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks } from "../features/tasksSlice";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import TaskForm from "../components/TaskForm";
import { useTaskModals } from "../hooks/useTaskModals";
import "./Gantt.css";

interface GanttTask {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    assignee: string;
    group: string;
}

const Gantt = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<"month" | "quarter">("month");
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    
    const {
        isTaskFormOpen,
        taskToEdit,
        openTaskForm,
        closeTaskForm,
    } = useTaskModals();

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    // タスクをガントチャート用に変換
    const ganttTasks: GanttTask[] = useMemo(() => {
        return tasks
            .filter(task => task.startDate && task.endDate)
            .map(task => ({
                id: task.id,
                title: task.title,
                startDate: parseISO(task.startDate),
                endDate: parseISO(task.endDate),
                status: task.status,
                priority: task.priority,
                assignee: task.assignee,
                group: task.group,
            }))
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }, [tasks]);

    // 表示期間の計算
    const dateRange = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(viewMode === "quarter" ? addDays(start, 90) : currentDate);
        return eachDayOfInterval({ start, end });
    }, [currentDate, viewMode]);

    // タスクの位置とサイズを計算
    const getTaskStyle = (task: GanttTask) => {
        const startIndex = dateRange.findIndex(date => 
            format(date, "yyyy-MM-dd") === format(task.startDate, "yyyy-MM-dd")
        );
        const endIndex = dateRange.findIndex(date => 
            format(date, "yyyy-MM-dd") === format(task.endDate, "yyyy-MM-dd")
        );
        
        if (startIndex === -1 || endIndex === -1) return null;
        
        const left = (startIndex / dateRange.length) * 100;
        const width = ((endIndex - startIndex + 1) / dateRange.length) * 100;
        
        return {
            left: `${left}%`,
            width: `${Math.max(width, 1)}%`,
        };
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "完了": return "#4caf50";
            case "進行中": return "#ff9800";
            case "未着手": return "#f44336";
            default: return "#666";
        }
    };

    const getPriorityOpacity = (priority: string) => {
        switch (priority) {
            case "高": return "1";
            case "中": return "0.8";
            case "低": return "0.6";
            default: return "0.7";
        }
    };

    const goToPreviousMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="gantt-container">
            <div className="gantt-header">
                <h1 className="gantt-title">ガントチャート</h1>
                <div className="gantt-controls">
                    <div className="date-navigation">
                        <button onClick={goToPreviousMonth} className="nav-button">
                            ←
                        </button>
                        <span className="current-month">
                            {format(currentDate, "yyyy年MM月", { locale: ja })}
                        </span>
                        <button onClick={goToNextMonth} className="nav-button">
                            →
                        </button>
                        <button onClick={goToToday} className="today-button">
                            今日
                        </button>
                    </div>
                    <div className="view-mode-toggle">
                        <button 
                            className={viewMode === "month" ? "active" : ""}
                            onClick={() => setViewMode("month")}
                        >
                            月
                        </button>
                        <button 
                            className={viewMode === "quarter" ? "active" : ""}
                            onClick={() => setViewMode("quarter")}
                        >
                            四半期
                        </button>
                    </div>
                    <button 
                        onClick={() => openTaskForm()} 
                        className="add-task-button"
                    >
                        ＋ 新しいタスク
                    </button>
                </div>
            </div>

            <div className="gantt-chart">
                {/* 日付ヘッダー */}
                <div className="gantt-timeline">
                    <div className="task-list-header">タスク</div>
                    <div className="date-header">
                        {dateRange.map((date, index) => (
                            <div key={index} className="date-cell">
                                <div className="date-number">
                                    {format(date, "d")}
                                </div>
                                <div className="date-day">
                                    {format(date, "E", { locale: ja })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* タスク行 */}
                <div className="gantt-body">
                    {ganttTasks.length === 0 ? (
                        <div className="empty-gantt">
                            <p>期間が設定されたタスクがありません</p>
                            <button onClick={() => openTaskForm()} className="create-task-btn">
                                タスクを作成
                            </button>
                        </div>
                    ) : (
                        ganttTasks.map((task) => {
                            const style = getTaskStyle(task);
                            if (!style) return null;

                            return (
                                <div 
                                    key={task.id} 
                                    className={`gantt-row ${selectedTask === task.id ? "selected" : ""}`}
                                >
                                    <div className="task-info">
                                        <div className="task-title">{task.title}</div>
                                        <div className="task-meta">
                                            {task.assignee && <span className="assignee">{task.assignee}</span>}
                                            {task.group && <span className="group">{task.group}</span>}
                                        </div>
                                    </div>
                                    <div className="task-timeline">
                                        <div 
                                            className="task-bar"
                                            style={{
                                                ...style,
                                                backgroundColor: getStatusColor(task.status),
                                                opacity: getPriorityOpacity(task.priority),
                                            }}
                                            onClick={() => {
                                                setSelectedTask(task.id);
                                                const originalTask = tasks.find(t => t.id === task.id);
                                                if (originalTask) {
                                                    openTaskForm(originalTask);
                                                }
                                            }}
                                            title={`${task.title} (${format(task.startDate, "MM/dd")} - ${format(task.endDate, "MM/dd")})`}
                                        >
                                            <div className="task-bar-content">
                                                <span className="task-bar-title">{task.title}</span>
                                                <span className="task-bar-duration">
                                                    {format(task.startDate, "MM/dd")} - {format(task.endDate, "MM/dd")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* 凡例 */}
            <div className="gantt-legend">
                <div className="legend-section">
                    <h4>ステータス</h4>
                    <div className="legend-items">
                        <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: "#f44336" }}></div>
                            <span>未着手</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: "#ff9800" }}></div>
                            <span>進行中</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: "#4caf50" }}></div>
                            <span>完了</span>
                        </div>
                    </div>
                </div>
                <div className="legend-section">
                    <h4>優先度</h4>
                    <div className="legend-items">
                        <div className="legend-item">
                            <div className="legend-opacity" style={{ opacity: "1" }}>■</div>
                            <span>高</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-opacity" style={{ opacity: "0.8" }}>■</div>
                            <span>中</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-opacity" style={{ opacity: "0.6" }}>■</div>
                            <span>低</span>
                        </div>
                    </div>
                </div>
            </div>

            {isTaskFormOpen && <TaskForm onClose={closeTaskForm} taskToEdit={taskToEdit} />}
        </div>
    );
};

export default Gantt;
