import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import { TopNav, Sidebar } from "./components";
import {
  Dashboard,
  Students,
  Teachers,
  Classes,
  Subjects,
  Marks,
  Reports,
} from "./pages";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <TopNav
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="pt-20 md:ml-64 transition-all duration-300">
          <div className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/marks" element={<Marks />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
