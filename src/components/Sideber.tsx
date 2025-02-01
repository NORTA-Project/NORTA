import React, { useState } from "react";
import { Link } from "react-router-dom";
import plusIcon from "../assets/icon/plus.png";
import tasktrayIcon from "../assets/icon/tasktray.png";
// import homeIcon from "../assets/icon/Home.png";
import tableIcon from "../assets/icon/Table.png";
import tasksIcon from "../assets/icon/Tasks.png";
import appIcon from "../assets/icon/NORTA-icon-3.png";
import TaskForm from "./TaskForm";

const Sidebar: React.FC = () => {
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

    const openTaskForm = () => setIsTaskFormOpen(true);
    const closeTaskForm = () => setIsTaskFormOpen(false);

return (
    <div className="sidebar">
    
    <Link to="/">
        <img src={appIcon} alt="Home" />
    </Link>
    <img src={plusIcon} alt="Add Task" onClick={openTaskForm} />
    <Link to="/tasks">
        <img src={tasksIcon} alt="Tasks" />
    </Link>
    <Link to="/table">
        <img src={tableIcon} alt="Table" />
    </Link>
    <img src={tasktrayIcon} alt="Feature 2" />
    <img src={tasktrayIcon} alt="Feature 3" />
    <img src={tasktrayIcon} alt="Feature 4" />
    {isTaskFormOpen && <TaskForm onClose={closeTaskForm} />}
    </div>
);
};

export default Sidebar;