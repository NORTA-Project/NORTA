import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Table from "./pages/Table";
import Gantt from "./pages/Gantt";
import Sidebar from "./components/Sideber";
import AuthGuard from "./components/AuthGuard";
import DebugInfo from "./components/DebugInfo";
import TestPage from "./components/TestPage";
import "./App.css";

function App() {
  // テストモード: Firebase設定がない場合はテストページを表示
  const isDemo = !import.meta.env.VITE_API_KEY || import.meta.env.VITE_API_KEY === 'demo-api-key';
  
  if (isDemo) {
    return (
      <div className="app">
        <TestPage />
        <DebugInfo />
      </div>
    );
  }
  
  return (
    <AuthGuard>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/table" element={<Table />} />
            <Route path="/gantt" element={<Gantt />} />
          </Routes>
        </main>
        <DebugInfo />
      </div>
    </AuthGuard>
  );
}

export default App;
