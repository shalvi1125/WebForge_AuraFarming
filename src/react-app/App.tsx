import { BrowserRouter as Router, Routes, Route } from "react-router";

import Landing from "@/react-app/pages/Landing";
import Login from "@/react-app/pages/Login";
import Signup from "@/react-app/pages/Signup";
import Chat from "@/react-app/pages/Chat";
import Features from "@/react-app/pages/Features";

import AdminDashboard from "@/react-app/pages/TripPlanner";
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

import AdminRooms from "@/react-app/pages/admin/Rooms";
import AdminStudents from "@/react-app/pages/admin/Students";
import AdminReports from "@/react-app/pages/admin/Reports";

import VisitorRequest from "@/react-app/pages/visitor/Request";

import TranslateButton from "./components/TranslateButton";

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

        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/room" element={<RoomAllocation />} />
        <Route path="/student/complaints" element={<StudentComplaints />} />
        <Route path="/student/leave" element={<LeaveManagement />} />
        <Route path="/student/fees" element={<StudentFees />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/announcements" element={<Announcements />} />
        <Route path="/profile" element={<StudentProfile />} />

        <Route path="/warden/dashboard" element={<WardenDashboard />} />
        <Route path="/warden/students" element={<WardenStudents />} />
        <Route path="/warden/complaints" element={<WardenComplaints />} />
        <Route path="/warden/leave" element={<WardenLeave />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        <Route path="/visitor/request" element={<VisitorRequest />} />
        <Route path="/announcements" element={<Announcements />} />
      </Routes>
    </Router>
  );
}
