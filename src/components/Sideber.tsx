import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import plusIcon from "../assets/icon/plus.png";
import tasktrayIcon from "../assets/icon/tasktray.png";
import tableIcon from "../assets/icon/Table.png";
import tasksIcon from "../assets/icon/Tasks.png";
import appIcon from "../assets/icon/NORTA-icon-3.png";
import homeIcon from "../assets/icon/Home.png";
import TaskForm from "./TaskForm";
import UserProfile from "./UserProfile";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showLabels, setShowLabels] = useState(false); // デフォルトで縮小状態
    const location = useLocation();
    const { user } = useAuth();

    const openTaskForm = () => setIsTaskFormOpen(true);
    const closeTaskForm = () => setIsTaskFormOpen(false);
    const openProfile = () => setIsProfileOpen(true);
    const closeProfile = () => setIsProfileOpen(false);
    const toggleLabels = () => setShowLabels(!showLabels);

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className={`sidebar ${showLabels ? 'sidebar-expanded' : ''}`}>
                <div className="sidebar-brand">
                    <Link to="/" className={`sidebar-item ${isActive("/") ? "active" : ""}`}>
                        <img src={appIcon} alt="ホーム" />
                        {showLabels && <span className="sidebar-label">ホーム</span>}
                    </Link>
                </div>
                
                {/* ユーザー情報表示 */}
                <div className="sidebar-user">
                    <div 
                        className="sidebar-item user-item" 
                        onClick={openProfile}
                        title="ユーザープロフィール"
                    >
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="プロフィール" className="user-avatar" />
                        ) : (
                            <div className="user-avatar-placeholder">
                                {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                            </div>
                        )}
                        {showLabels && (
                            <div className="user-info">
                                <span className="user-name">{user?.displayName || 'ユーザー'}</span>
                                <span className="user-email">{user?.email}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="sidebar-main">
                    <div 
                        className="sidebar-item action-item" 
                        onClick={openTaskForm}
                        title="新しいタスクを追加"
                    >
                        <img src={plusIcon} alt="タスク追加" />
                        {showLabels && <span className="sidebar-label">新規作成</span>}
                    </div>
                    
                    <Link 
                        to="/tasks" 
                        className={`sidebar-item ${isActive("/tasks") ? "active" : ""}`}
                        title="タスク一覧"
                    >
                        <img src={tasksIcon} alt="タスク一覧" />
                        {showLabels && <span className="sidebar-label">タスク一覧</span>}
                    </Link>
                    
                    <Link 
                        to="/table" 
                        className={`sidebar-item ${isActive("/table") ? "active" : ""}`}
                        title="テーブル表示"
                    >
                        <img src={tableIcon} alt="テーブル" />
                        {showLabels && <span className="sidebar-label">表形式</span>}
                    </Link>
                    
                    <Link 
                        to="/gantt" 
                        className={`sidebar-item ${isActive("/gantt") ? "active" : ""}`}
                        title="ガントチャート"
                    >
                        <img src={homeIcon} alt="ガントチャート" />
                        {showLabels && <span className="sidebar-label">スケジュール</span>}
                    </Link>
                </div>
                
                <div className="sidebar-footer">
                    <div 
                        className="sidebar-item toggle-item" 
                        onClick={toggleLabels}
                        title={showLabels ? "アイコンのみ表示" : "ラベルを表示"}
                    >
                        <img src={tasktrayIcon} alt="表示切替" />
                        {showLabels && <span className="sidebar-label">表示切替</span>}
                    </div>
                </div>
            </div>
            
            {isTaskFormOpen && <TaskForm onClose={closeTaskForm} />}
            {isProfileOpen && <UserProfile onClose={closeProfile} />}
        </>
    );
};

export default Sidebar;