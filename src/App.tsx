import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Table from "./pages/Table";
import Gantt from "./pages/Gantt";
import Sidebar from "./components/Sideber";
import "./App.css";

function App() {
  return (
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
    </div>
  );
}

export default App;
