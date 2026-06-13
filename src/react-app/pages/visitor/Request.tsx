// Placeholder – visitor request (Phase 2)
import { Link } from 'react-router';
export default function VisitorRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-900 mb-4">Visitor Request</h1>
        <p className="text-orange-600 mb-6">Submit a hostel visit request — coming in Phase 2</p>
        <Link to="/" className="text-orange-500 underline">← Back to Home</Link>
      </div>
    </div>
  );
}
