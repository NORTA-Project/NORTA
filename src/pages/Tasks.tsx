import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, createTask, deleteTask } from "../features/tasksSlice";

function Tasks() {
const dispatch = useDispatch<AppDispatch>();
const tasks = useSelector((state: RootState) => state.tasks.tasks);
const [taskTitle, setTaskTitle] = useState("");
const [taskDescription, setTaskDescription] = useState("");
const [taskDueDate, setTaskDueDate] = useState("");
const [taskAssignee, setTaskAssignee] = useState("");
const [taskPriority, setTaskPriority] = useState("");

useEffect(() => {
    dispatch(fetchTasks());
}, [dispatch]);

const handleAddTask = () => {
    dispatch(createTask({
    title: taskTitle,
    description: taskDescription,
    dueDate: taskDueDate,
    assignee: taskAssignee,
    priority: taskPriority
    }));
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskAssignee("");
    setTaskPriority("");
};

return (
    <div>
    <h1>Tasks</h1>
    <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Task title"
    />
    <input
        type="text"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Task description"
    />
    <input
        type="date"
        value={taskDueDate}
        onChange={(e) => setTaskDueDate(e.target.value)}
    />
    <input
        type="text"
        value={taskAssignee}
        onChange={(e) => setTaskAssignee(e.target.value)}
        placeholder="Assignee"
    />
    <select
        value={taskPriority}
        onChange={(e) => setTaskPriority(e.target.value)}
    >
        <option value="">Select priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
    </select>
    <button onClick={handleAddTask}>Add Task</button>
    <ul>
        {tasks.map((task) => (
        <li key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Due: {task.dueDate}</p>
            <p>Assignee: {task.assignee}</p>
            <p>Priority: {task.priority}</p>
            <button onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
        </li>
        ))}
    </ul>
    </div>
);
}

export default Tasks;
