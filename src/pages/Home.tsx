import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "../store";
import { fetchTasks } from "../features/tasksSlice";
import HelpTooltip from "../components/HelpTooltip";
import useAuth from "../hooks/useAuth";
import "./Home.css";

function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    
    // ユーザーのタスクを取得
    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchTasks(user.uid));
        }
    }, [dispatch, user?.uid]);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "完了").length;
    const inProgressTasks = tasks.filter(task => task.status === "進行中").length;
    const pendingTasks = tasks.filter(task => task.status === "未着手").length;

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>NORTA - タスク管理システム</h1>
                <p>効率的なタスク管理でプロジェクトを成功に導きます</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>総タスク数</h3>
                    <span className="stat-number">{totalTasks}</span>
                </div>
                <div className="stat-card completed">
                    <h3>完了</h3>
                    <span className="stat-number">{completedTasks}</span>
                </div>
                <div className="stat-card in-progress">
                    <h3>進行中</h3>
                    <span className="stat-number">{inProgressTasks}</span>
                </div>
                <div className="stat-card pending">
                    <h3>未着手</h3>
                    <span className="stat-number">{pendingTasks}</span>
                </div>
            </div>

            <div className="quick-actions">
                <h2>クイックアクション</h2>
                <div className="action-buttons">
                    <HelpTooltip content="カード形式でタスクを確認・編集できます。視覚的で分かりやすい表示です。" position="bottom">
                        <Link to="/tasks" className="action-button primary">
                            <span>📋</span>
                            タスク一覧
                        </Link>
                    </HelpTooltip>
                    <HelpTooltip content="表形式でタスクデータを一覧表示。並び替えやフィルタ機能が使えます。" position="bottom">
                        <Link to="/table" className="action-button secondary">
                            <span>📊</span>
                            テーブル表示
                        </Link>
                    </HelpTooltip>
                    <HelpTooltip content="タスクの期間をバーで表示するスケジュール管理ツールです。" position="bottom">
                        <Link to="/gantt" className="action-button tertiary">
                            <span>📅</span>
                            スケジュール
                        </Link>
                    </HelpTooltip>
                </div>
            </div>

            <div className="beginner-guide">
                <h2>🎯 はじめての方へ</h2>
                <div className="guide-steps">
                    <div className="guide-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>タスクを作成する</h3>
                            <p>左のサイドバーの「＋」ボタンか「新規作成」をクリックして、新しいタスクを作成しましょう。</p>
                        </div>
                    </div>
                    <div className="guide-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>タスクを管理する</h3>
                            <p>「タスク一覧」でカード形式、「表形式」で詳細データ、「スケジュール」で期間を確認できます。</p>
                        </div>
                    </div>
                    <div className="guide-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>進捗を更新する</h3>
                            <p>タスクをクリックして編集し、「未着手」→「進行中」→「完了」の順で進捗を更新しましょう。</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="recent-tasks">
                <h2>最近のタスク</h2>
                {tasks.length > 0 ? (
                    <div className="task-preview-list">
                        {tasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="task-preview">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <span className={`status-badge ${task.status}`}>
                                    {task.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-tasks">まだタスクがありません。新しいタスクを作成してください。</p>
                )}
            </div>
        </div>
    );
}

export default Home;
