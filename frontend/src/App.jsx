import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AdminDashboard from "./pages/AdminDashboard";
import TicketDetail from "./pages/TicketDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/tickets/:id" element={<TicketDetail />} />
    </Routes>
  );
}

export default App;
