import { BrowserRouter as Router, Routes, Route } from "react-router";
import Landing from "@/react-app/pages/Landing";
import Login from "@/react-app/pages/Login";
import Signup from "@/react-app/pages/Signup";
import Chat from "@/react-app/pages/Chat";
import Features from "@/react-app/pages/Features";
import RoomAllocation from "@/react-app/pages/InteractiveMap";
import LeaveManagement from "@/react-app/pages/ItineraryPlanner";
import Announcements from "@/react-app/pages/Community";
import StudentProfile from "@/react-app/pages/Profile";
import StudentDashboard from "@/react-app/pages/student/Dashboard";
import StudentComplaints from "@/react-app/pages/student/Complaints";
import StudentFees from "@/react-app/pages/student/Fees";
import WardenDashboard from "@/react-app/pages/warden/Dashboard";
import WardenStudents from "@/react-app/pages/warden/Students";
import WardenComplaints from "@/react-app/pages/warden/Complaints";
import WardenLeave from "@/react-app/pages/warden/Leave";
import AdminDashboard from "@/react-app/pages/admin/Dashboard";
import AdminRooms from "@/react-app/pages/admin/Rooms";
import AdminStudents from "@/react-app/pages/admin/Students";
import AdminReports from "@/react-app/pages/admin/Reports";
import VisitorRequest from "@/react-app/pages/visitor/Request";
import TranslateButton from "./components/TranslateButton";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <TranslateButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/features" element={<Features />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/room" element={<ProtectedRoute role="student"><RoomAllocation view="student" /></ProtectedRoute>} />
        <Route path="/student/complaints" element={<ProtectedRoute role="student"><StudentComplaints /></ProtectedRoute>} />
        <Route path="/student/leave" element={<ProtectedRoute role="student"><LeaveManagement /></ProtectedRoute>} />
        <Route path="/student/fees" element={<ProtectedRoute role="student"><StudentFees /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/announcements" element={<ProtectedRoute role="student"><Announcements /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/visitor/request" element={<ProtectedRoute role="student"><VisitorRequest /></ProtectedRoute>} />
        <Route path="/announcements" element={<ProtectedRoute role="student"><Announcements /></ProtectedRoute>} />
        <Route path="/warden/dashboard" element={<ProtectedRoute role="warden"><WardenDashboard /></ProtectedRoute>} />
        <Route path="/warden/room" element={<ProtectedRoute role="warden"><RoomAllocation view="warden" /></ProtectedRoute>} />
        <Route path="/warden/students" element={<ProtectedRoute role="warden"><WardenStudents /></ProtectedRoute>} />
        <Route path="/warden/complaints" element={<ProtectedRoute role="warden"><WardenComplaints /></ProtectedRoute>} />
        <Route path="/warden/leave" element={<ProtectedRoute role="warden"><WardenLeave /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/room" element={<ProtectedRoute role="admin"><RoomAllocation view="admin" /></ProtectedRoute>} />
        <Route path="/admin/rooms" element={<ProtectedRoute role="admin"><AdminRooms /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
