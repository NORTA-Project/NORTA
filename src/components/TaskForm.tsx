import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { createTask, editTask } from "../features/tasksSlice";
import HelpTooltip from "./HelpTooltip";
import "./TaskForm.css";

interface TaskFormProps {
    onClose: () => void;
    taskToEdit?: {
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
    } | null;
}

const TaskForm = ({ onClose, taskToEdit }: TaskFormProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskStartDate, setTaskStartDate] = useState("");
    const [taskEndDate, setTaskEndDate] = useState("");
    const [taskAssignee, setTaskAssignee] = useState("");
    const [taskPriority, setTaskPriority] = useState("中");
    const [taskStatus, setTaskStatus] = useState("未着手");
    const [taskGroup, setTaskGroup] = useState("");
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        if (taskToEdit) {
            setTaskTitle(taskToEdit.title);
            setTaskDescription(taskToEdit.description);
            setTaskStartDate(taskToEdit.startDate);
            setTaskEndDate(taskToEdit.endDate);
            setTaskAssignee(taskToEdit.assignee);
            setTaskPriority(taskToEdit.priority);
            setTaskStatus(taskToEdit.status);
            setTaskGroup(taskToEdit.group);
        }
    }, [taskToEdit]);

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!taskTitle.trim()) {
            newErrors.title = "タイトルは必須です";
        }
        
        if (taskStartDate && taskEndDate && new Date(taskStartDate) > new Date(taskEndDate)) {
            newErrors.date = "終了日は開始日以降を設定してください";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        const taskData = {
            title: taskTitle.trim(),
            description: taskDescription.trim(),
            startDate: taskStartDate,
            endDate: taskEndDate,
            assignee: taskAssignee.trim(),
            priority: taskPriority,
            status: taskStatus,
            group: taskGroup.trim(),
            createdAt: taskToEdit ? taskToEdit.createdAt : new Date().toISOString(),
        };

        if (taskToEdit) {
            dispatch(editTask({ ...taskData, id: taskToEdit.id }));
        } else {
            dispatch(createTask(taskData));
        }
        
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="task-form-overlay" onClick={handleBackdropClick}>
            <div className="task-form-container">
                <div className="task-form-header">
                    <h2>{taskToEdit ? "タスクを編集" : "新しいタスクを作成"}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <form className="task-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="form-help-text">
                        <p>📋 <strong>必須項目は「*」マークがついています。</strong>最低限タイトルがあれば保存できます。</p>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="title">
                            タスクのタイトル *
                            <HelpTooltip content="何をするタスクかを分かりやすい名前で入力してください。例：「資料作成」「会議準備」など" position="right">
                                <span className="help-icon">❓</span>
                            </HelpTooltip>
                        </label>
                        <input 
                            id="title"
                            type="text" 
                            value={taskTitle} 
                            onChange={(e) => setTaskTitle(e.target.value)} 
                            placeholder="例：プレゼン資料を作成する"
                            className={errors.title ? "error" : ""}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            詳細説明（任意）
                            <HelpTooltip content="タスクの詳しい内容や注意点を記入できます。空欄でも大丈夫です。" position="right">
                                <span className="help-icon">❓</span>
                            </HelpTooltip>
                        </label>
                        <textarea 
                            id="description"
                            value={taskDescription} 
                            onChange={(e) => setTaskDescription(e.target.value)} 
                            placeholder="どんな作業をするか、気をつけることなどを書けます"
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">
                                開始日（任意）
                                <HelpTooltip content="いつから始める予定かを設定できます。後から変更もできます。" position="top">
                                    <span className="help-icon">❓</span>
                                </HelpTooltip>
                            </label>
                            <input 
                                id="startDate"
                                type="date" 
                                value={taskStartDate} 
                                onChange={(e) => setTaskStartDate(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">
                                終了予定日（任意）
                                <HelpTooltip content="いつまでに完了予定かを設定できます。スケジュール管理に便利です。" position="top">
                                    <span className="help-icon">❓</span>
                                </HelpTooltip>
                            </label>
                            <input 
                                id="endDate"
                                type="date" 
                                value={taskEndDate} 
                                onChange={(e) => setTaskEndDate(e.target.value)} 
                            />
                        </div>
                    </div>
                    
                    {errors.date && <span className="error-message">{errors.date}</span>}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="assignee">
                                担当者（任意）
                                <HelpTooltip content="誰がこのタスクを担当するかを入力できます。自分の名前でも、チームメンバーの名前でもOKです。" position="top">
                                    <span className="help-icon">❓</span>
                                </HelpTooltip>
                            </label>
                            <input 
                                id="assignee"
                                type="text" 
                                value={taskAssignee} 
                                onChange={(e) => setTaskAssignee(e.target.value)} 
                                placeholder="例：田中さん、自分"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="group">
                                プロジェクト・グループ（任意）
                                <HelpTooltip content="このタスクがどのプロジェクトや分野に属するかを分類できます。" position="top">
                                    <span className="help-icon">❓</span>
                                </HelpTooltip>
                            </label>
                            <input 
                                id="group"
                                type="text" 
                                value={taskGroup} 
                                onChange={(e) => setTaskGroup(e.target.value)} 
                                placeholder="例：Webサイト制作、営業活動"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="priority">
                                重要度
                                <HelpTooltip content="高：緊急で重要なタスク｜中：通常のタスク｜低：時間があるときに行うタスク" position="top">
                                    <span className="help-icon">❓</span>
                                </HelpTooltip>
                            </label>
                            <select 
                                id="priority"
                                value={taskPriority} 
                                onChange={(e) => setTaskPriority(e.target.value)}
                            >
                                <option value="高">🔴 高（緊急・重要）</option>
                                <option value="中">🟡 中（通常）</option>
                                <option value="低">🟢 低（余裕があるとき）</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">
                                進捗状況
                                <HelpTooltip content="未着手：まだ始めていない｜進行中：作業中｜完了：終わった" position="top">
                                    <span className="help-icon">❓</span>
                                </HelpTooltip>
                            </label>
                            <select 
                                id="status"
                                value={taskStatus} 
                                onChange={(e) => setTaskStatus(e.target.value)}
                            >
                                <option value="未着手">⚪ 未着手（まだ始めていない）</option>
                                <option value="進行中">🔵 進行中（作業中）</option>
                                <option value="完了">🟢 完了（終わった）</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            キャンセル
                        </button>
                        <button type="submit" className="submit-button">
                            {taskToEdit ? "変更を保存" : "タスクを作成"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;