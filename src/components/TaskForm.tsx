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
    dueDate: string;
    assignee: string;
    priority: string;
} | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, taskToEdit }) => {
const dispatch = useDispatch<AppDispatch>();
const [taskTitle, setTaskTitle] = useState("");
const [taskDescription, setTaskDescription] = useState("");
const [taskDueDate, setTaskDueDate] = useState("");
const [taskAssignee, setTaskAssignee] = useState("");
const [taskPriority, setTaskPriority] = useState("");

useEffect(() => {
    if (taskToEdit) {
    setTaskTitle(taskToEdit.title);
    setTaskDescription(taskToEdit.description);
    setTaskDueDate(taskToEdit.dueDate);
    setTaskAssignee(taskToEdit.assignee);
    setTaskPriority(taskToEdit.priority);
    }
}, [taskToEdit]);

const handleAddTask = () => {
    if (!taskTitle) return;
    dispatch(
    createTask({
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        assignee: taskAssignee,
        priority: taskPriority,
    })
    );
    onClose();
};

const handleEditTask = () => {
    if (!taskTitle || !taskToEdit) return;
    dispatch(
    editTask({
        id: taskToEdit.id,
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        assignee: taskAssignee,
        priority: taskPriority,
    })
    );
    onClose();
};

return (
    <div className="task-form-popup" onClick={onClose}>
    <div className="task-form-content" onClick={(e) => e.stopPropagation()}>
        <h2>{taskToEdit ? "Edit Task" : "Add Task"}</h2>
        <label>Title</label>
        <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task title" />
        
        <label>Description</label>
        <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Task description" />
        
        <label>Due Date</label>
        <input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
        
        <label>Assignee</label>
        <input type="text" value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} placeholder="Assignee" />
        
        <label>Priority</label>
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
        <option value="">Select priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        </select>
        
        <button onClick={taskToEdit ? handleEditTask : handleAddTask} className="task-add-button">
        {taskToEdit ? "Save Changes" : "Add Task"}
        </button>
        <button onClick={onClose} className="task-cancel-button">Cancel</button>
    </div>
    </div>
);
};

export default TaskForm;