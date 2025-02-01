import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, deleteTask } from "../features/tasksSlice";
import "./Tasks.css";

function Tasks() {
const dispatch = useDispatch<AppDispatch>();
const tasks = useSelector((state: RootState) => state.tasks.tasks);

useEffect(() => {
    dispatch(fetchTasks());
}, [dispatch]);

return (
    <div className="tasks-container">
    <h1 className="tasks-title">Tasks</h1>
    <div className="task-list">
        {tasks.map((task) => (
        <div key={task.id} className="task-card">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p className="task-meta">Due: {task.dueDate}</p>
            <p className="task-meta">Assignee: {task.assignee}</p>
            <p className="task-meta">Priority: {task.priority}</p>
            <button onClick={() => dispatch(deleteTask(task.id))} className="task-delete-button">Delete</button>
        </div>
        ))}
    </div>
    </div>
);
}

export default Tasks;
    