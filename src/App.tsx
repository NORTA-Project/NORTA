import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Table from "./pages/table";
import Sidebar from "./components/Sideber"; // Sidebarをインポート

function App() {
  return (
    <div>
      <Sidebar /> {/* Sidebarを追加 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/table" element={<Table />} />
      </Routes>
    </div>
  );
}

export default App;
