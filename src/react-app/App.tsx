// src/react-app/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router";

// Core pages (preserved)
import Landing from "@/react-app/pages/Landing";
import Login from "@/react-app/pages/Login";
import Signup from "@/react-app/pages/Signup";
import Profile from "@/react-app/pages/Profile";
import Chat from "@/react-app/pages/Chat";

// Transitional pages (renamed in place, pending Phase 2 rewrite)
import HostelDashboard from "@/react-app/pages/TripPlanner";
import AIAssistant from "@/react-app/pages/Chat";
import RoomManagement from "@/react-app/pages/InteractiveMap";
import ComplaintManagement from "@/react-app/pages/Community";
import LeaveManagement from "@/react-app/pages/ItineraryPlanner";

// Student portal stubs
import StudentDashboard from "@/react-app/pages/student/Dashboard";
import StudentRoom from "@/react-app/pages/student/Room";
import StudentComplaints from "@/react-app/pages/student/Complaints";

// Warden portal stubs
import WardenDashboard from "@/react-app/pages/warden/Dashboard";
import WardenStudents from "@/react-app/pages/warden/Students";
import WardenComplaints from "@/react-app/pages/warden/Complaints";
import WardenLeave from "@/react-app/pages/warden/Leave";

// Admin portal stubs
import AdminDashboard from "@/react-app/pages/admin/Dashboard";
import AdminRooms from "@/react-app/pages/admin/Rooms";
import AdminStudents from "@/react-app/pages/admin/Students";
import AdminReports from "@/react-app/pages/admin/Reports";

// Visitor portal stub
import VisitorRequest from "@/react-app/pages/visitor/Request";

// Student portal remaining stubs
import StudentLeave from "@/react-app/pages/student/Leave";
import StudentFees from "@/react-app/pages/student/Fees";
import StudentProfile from "@/react-app/pages/student/StudentProfile";

import TranslateButton from "./components/TranslateButton";

export default function App() {
  return (
    <Router>
      <TranslateButton />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* Legacy /signup redirect — keep working during transition */}
        <Route path="/signup" element={<Signup />} />

        {/* AI Assistant (preserved Chat infrastructure) */}
        <Route path="/chat" element={<Chat />} />

        {/* ── Student Portal ── */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/room" element={<StudentRoom />} />
        <Route path="/student/complaints" element={<StudentComplaints />} />
        <Route path="/student/leave" element={<StudentLeave />} />
        <Route path="/student/fees" element={<StudentFees />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* ── Warden Portal ── */}
        <Route path="/warden/dashboard" element={<WardenDashboard />} />
        <Route path="/warden/students" element={<WardenStudents />} />
        <Route path="/warden/complaints" element={<WardenComplaints />} />
        <Route path="/warden/leave" element={<WardenLeave />} />

        {/* ── Admin Portal ── */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/* ── Visitor Portal ── */}
        <Route path="/visitor/request" element={<VisitorRequest />} />
      </Routes>
    </Router>
  );
}
