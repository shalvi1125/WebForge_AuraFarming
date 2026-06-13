// Placeholder – admin students (Phase 2)
import { Link } from 'react-router';
export default function AdminStudents() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-purple-900 mb-4">Students</h1>
        <p className="text-purple-600 mb-6">Manage all students — coming in Phase 2</p>
        <Link to="/admin/dashboard" className="text-purple-500 underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
