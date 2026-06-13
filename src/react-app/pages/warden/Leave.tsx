// Placeholder – warden leave approvals (Phase 2)
import { Link } from 'react-router';
export default function WardenLeave() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-900 mb-4">Leave Approvals</h1>
        <p className="text-green-600 mb-6">Approve or reject leave requests — coming in Phase 2</p>
        <Link to="/warden/dashboard" className="text-green-500 underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
