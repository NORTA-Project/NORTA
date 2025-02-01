import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { createTask } from "../features/tasksSlice";
import "./TaskForm.css";

const TaskForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
const dispatch = useDispatch<AppDispatch>();
const [taskTitle, setTaskTitle] = useState("");
const [taskDescription, setTaskDescription] = useState("");
const [taskDueDate, setTaskDueDate] = useState("");
const [taskAssignee, setTaskAssignee] = useState("");
const [taskPriority, setTaskPriority] = useState("");

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
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskAssignee("");
    setTaskPriority("");
    onClose();
};

return (
    <div className="task-form-popup">
    <div className="task-form-content">
        <h2>Add Task</h2>
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
        
        <button onClick={handleAddTask} className="task-add-button">Add Task</button>
        <button onClick={onClose} className="task-cancel-button">Cancel</button>
</div>
    </div>
);
};

export default TaskForm;