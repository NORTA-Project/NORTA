import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { createTask, editTask } from "../features/tasksSlice";
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

const TaskForm: React.FC<TaskFormProps> = ({ onClose, taskToEdit }) => {
const dispatch = useDispatch<AppDispatch>();
const [taskTitle, setTaskTitle] = useState("");
const [taskDescription, setTaskDescription] = useState("");
const [taskStartDate, setTaskStartDate] = useState("");
const [taskEndDate, setTaskEndDate] = useState("");
const [taskAssignee, setTaskAssignee] = useState("");
const [taskPriority, setTaskPriority] = useState("");
const [taskStatus, setTaskStatus] = useState("");
const [taskGroup, setTaskGroup] = useState("");

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

const handleAddTask = () => {
    if (!taskTitle || new Date(taskStartDate) > new Date(taskEndDate)) return;
    const createdAt = new Date().toISOString();
    dispatch(
    createTask({
        title: taskTitle,
        description: taskDescription,
        startDate: taskStartDate,
        endDate: taskEndDate,
        assignee: taskAssignee,
        priority: taskPriority,
        status: taskStatus,
        group: taskGroup,
        createdAt,
    })
    );
    onClose();
};

const handleEditTask = () => {
    if (!taskTitle || !taskToEdit || new Date(taskStartDate) > new Date(taskEndDate)) return;
    dispatch(
    editTask({
        id: taskToEdit.id,
        title: taskTitle,
        description: taskDescription,
        startDate: taskStartDate,
        endDate: taskEndDate,
        assignee: taskAssignee,
        priority: taskPriority,
        status: taskStatus,
        group: taskGroup,
        createdAt: taskToEdit.createdAt,
    })
    );
    onClose();
};

return (
    <div className="task-form-popup" onClick={onClose}>
    <div className="task-form-content" onClick={(e) => e.stopPropagation()}>
        <h2>{taskToEdit ? "Edit Task" : "Add Task"}</h2>
        <label>件名</label>
        <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task title" />
        
        <label>詳細</label>
        <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Task description" />
        
        <label>開始日</label>
        <input type="date" value={taskStartDate} onChange={(e) => setTaskStartDate(e.target.value)} />
        
        <label>終了日</label>
        <input type="date" value={taskEndDate} onChange={(e) => setTaskEndDate(e.target.value)} />
        
        <label>担当者</label>
        <input type="text" value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} placeholder="Assignee" />
        
        <label>優先度</label>
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
        <option value="">Select priority</option>
        <option value="⚠Important⚠">⚠Important⚠</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
        </select>
        
        <label>ステータス</label>
        <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
        <option value="">Select status</option>
        <option value="完了">完了</option>
        <option value="作業中">作業中</option>
        <option value="スタック">スタック</option>
        <option value="未着手">未着手</option>
        </select>
        
        <label>グループ</label>
        <input type="text" value={taskGroup} onChange={(e) => setTaskGroup(e.target.value)} placeholder="Group" />
        
        <button onClick={taskToEdit ? handleEditTask : handleAddTask} className="task-add-button">
        {taskToEdit ? "Save Changes" : "Add Task"}
        </button>
        <button onClick={onClose} className="task-cancel-button">Cancel</button>
    </div>
    </div>
);
};

export default TaskForm;