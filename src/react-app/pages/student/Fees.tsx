// Placeholder – student fee status (Phase 2)
import { Link } from 'react-router';
export default function StudentFees() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Fee Status</h1>
        <p className="text-blue-600 mb-6">View dues and payment history — coming in Phase 2</p>
        <Link to="/student/dashboard" className="text-blue-500 underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
