// src/react-app/pages/student/Complaints.tsx
import { useState } from 'react';
import { Link } from 'react-router';
import {
  Building2, AlertCircle, ChevronRight, X, Plus,
  BrainCircuit, Clock, CheckCircle2, Wrench, Zap,
  Trash2, ShieldAlert, Wifi, Sofa, Droplets,
  Upload, Filter, ArrowLeft,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────
type Status = 'Open' | 'In Progress' | 'Resolved';
type Priority = 'High' | 'Medium' | 'Low';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: Status;
  priority: Priority;
  date: string;
  assignedTo: string;
}

// ── Mock Data ─────────────────────────────────────────────
const mockComplaints: Complaint[] = [
  { id: 'CMP-041', title: 'Water leakage near bathroom sink', description: 'There is a constant drip from the pipe under the sink causing the floor to stay wet.', category: 'Plumbing', status: 'In Progress', priority: 'High', date: '10 Jun 2025', assignedTo: 'Rajan Kumar' },
  { id: 'CMP-038', title: 'Wi-Fi not working in room', description: 'Internet has been down in Room 204 for 3 days. Cannot attend online classes.', category: 'Internet', status: 'Open', priority: 'Medium', date: '07 Jun 2025', assignedTo: 'Unassigned' },
  { id: 'CMP-035', title: 'Broken wardrobe door hinge', description: 'The door of the wardrobe in Room 204 has a broken hinge and keeps falling off.', category: 'Furniture', status: 'Open', priority: 'Low', date: '04 Jun 2025', assignedTo: 'Unassigned' },
  { id: 'CMP-031', title: 'Mess food quality issue', description: 'The dinner served on 01 Jun was undercooked and caused stomach issues.', category: 'Hygiene', status: 'Resolved', priority: 'Medium', date: '01 Jun 2025', assignedTo: 'Mess Supervisor' },
  { id: 'CMP-027', title: 'Room light flickering', description: 'The tube light in the study area flickers constantly and causes eye strain.', category: 'Electrical', status: 'Resolved', priority: 'Low', date: '25 May 2025', assignedTo: 'Electrician Team' },
  { id: 'CMP-022', title: 'Suspicious person near block gate', description: 'Unfamiliar individual loitering near Block B gate late at night.', category: 'Security', status: 'Resolved', priority: 'High', date: '18 May 2025', assignedTo: 'Security Dept.' },
];

const categories = ['Plumbing', 'Electrical', 'Hygiene', 'Furniture', 'Security', 'Internet'];

const categoryIcons: Record<string, any> = {
  Plumbing: Droplets,
  Electrical: Zap,
  Hygiene: Trash2,
  Furniture: Sofa,
  Security: ShieldAlert,
  Internet: Wifi,
};

const categoryColors: Record<string, string> = {
  Plumbing:   'bg-blue-100 text-blue-700',
  Electrical: 'bg-yellow-100 text-yellow-700',
  Hygiene:    'bg-green-100 text-green-700',
  Furniture:  'bg-orange-100 text-orange-700',
  Security:   'bg-red-100 text-red-700',
  Internet:   'bg-purple-100 text-purple-700',
};

const statusStyles: Record<Status, string> = {
  Open:         'bg-rose-100 text-rose-700',
  'In Progress':'bg-amber-100 text-amber-700',
  Resolved:     'bg-green-100 text-green-700',
};

const priorityStyles: Record<Priority, string> = {
  High:   'bg-rose-50 text-rose-600 border border-rose-200',
  Medium: 'bg-amber-50 text-amber-600 border border-amber-200',
  Low:    'bg-green-50 text-green-600 border border-green-200',
};

// Demo AI categorization map
const aiDemoMap: Record<string, { category: string; priority: Priority; resolution: string; confidence: number }> = {
  default:          { category: 'General',   priority: 'Low',    resolution: '3 Days',    confidence: 78 },
  plumb:            { category: 'Plumbing',  priority: 'High',   resolution: '1 Day',     confidence: 96 },
  water:            { category: 'Plumbing',  priority: 'Medium', resolution: '2 Days',    confidence: 94 },
  leak:             { category: 'Plumbing',  priority: 'High',   resolution: '1 Day',     confidence: 97 },
  pipe:             { category: 'Plumbing',  priority: 'Medium', resolution: '2 Days',    confidence: 91 },
  light:            { category: 'Electrical',priority: 'Low',    resolution: '1 Day',     confidence: 89 },
  electric:         { category: 'Electrical',priority: 'Medium', resolution: '1 Day',     confidence: 92 },
  wifi:             { category: 'Internet',  priority: 'Medium', resolution: '1 Day',     confidence: 95 },
  internet:         { category: 'Internet',  priority: 'High',   resolution: '4 Hours',   confidence: 93 },
  network:          { category: 'Internet',  priority: 'Medium', resolution: '1 Day',     confidence: 88 },
  food:             { category: 'Hygiene',   priority: 'Medium', resolution: '1 Day',     confidence: 87 },
  mess:             { category: 'Hygiene',   priority: 'Medium', resolution: '1 Day',     confidence: 85 },
  clean:            { category: 'Hygiene',   priority: 'Low',    resolution: '2 Days',    confidence: 82 },
  wardrobe:         { category: 'Furniture', priority: 'Low',    resolution: '3 Days',    confidence: 90 },
  chair:            { category: 'Furniture', priority: 'Low',    resolution: '3 Days',    confidence: 88 },
  table:            { category: 'Furniture', priority: 'Low',    resolution: '3 Days',    confidence: 86 },
  security:         { category: 'Security',  priority: 'High',   resolution: '2 Hours',   confidence: 98 },
  suspicious:       { category: 'Security',  priority: 'High',   resolution: '2 Hours',   confidence: 97 },
};

function getAIResult(title: string) {
  const lower = title.toLowerCase();
  for (const key of Object.keys(aiDemoMap)) {
    if (key !== 'default' && lower.includes(key)) return aiDemoMap[key];
  }
  return aiDemoMap.default;
}

// ── Status Icon ───────────────────────────────────────────
function StatusIcon({ s }: { s: Status }) {
  if (s === 'Resolved') return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (s === 'In Progress') return <Clock className="w-3.5 h-3.5" />;
  return <AlertCircle className="w-3.5 h-3.5" />;
}

// ── Complaint Detail Modal ────────────────────────────────
function ComplaintModal({ complaint, onClose }: { complaint: Complaint; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <p className="text-indigo-200 text-xs mb-1">{complaint.id}</p>
          <h2 className="text-lg font-bold pr-8">{complaint.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{complaint.category}</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{complaint.date}</span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">{complaint.description}</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[complaint.status]}`}>{complaint.status}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Priority</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyles[complaint.priority]}`}>{complaint.priority}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Assigned To</p>
              <p className="text-xs font-semibold text-gray-700">{complaint.assignedTo}</p>
            </div>
          </div>
          {/* Timeline */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timeline</p>
            <div className="space-y-2">
              {[
                { label: 'Complaint Filed', date: complaint.date, done: true },
                { label: 'Assigned to Staff', date: complaint.assignedTo !== 'Unassigned' ? complaint.date : '—', done: complaint.assignedTo !== 'Unassigned' },
                { label: 'Resolved', date: complaint.status === 'Resolved' ? complaint.date : '—', done: complaint.status === 'Resolved' },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${t.done ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${t.done ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <p className={`text-xs font-medium ${t.done ? 'text-gray-800' : 'text-gray-400'}`}>{t.label}</p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function StudentComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [aiResult, setAiResult] = useState<ReturnType<typeof getAIResult> | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const stats = [
    { label: 'Total',       value: complaints.length,                                                          color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'Open',        value: complaints.filter((c: Complaint) => c.status === 'Open').length,            color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-100' },
    { label: 'In Progress', value: complaints.filter((c: Complaint) => c.status === 'In Progress').length,     color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
    { label: 'Resolved',    value: complaints.filter((c: Complaint) => c.status === 'Resolved').length,        color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  ];

  const filtered = complaints.filter((c: Complaint) => {
    const matchStatus   = filterStatus === 'All'   || c.status === filterStatus;
    const matchCategory = filterCategory === 'All' || c.category === filterCategory;
    return matchStatus && matchCategory;
  });

  function handleTitleChange(val: string): void {
    setFormTitle(val);
    if (val.trim().length > 3) setAiResult(getAIResult(val));
    else setAiResult(null);
    setSubmitted(false);
  }

  function handleSubmit() {
    if (!formTitle.trim() || !formDesc.trim() || !formCategory) return;
    const ai = getAIResult(formTitle);
    const newComplaint: Complaint = {
      id: `CMP-${String(Math.floor(Math.random() * 900) + 100)}`,
      title: formTitle,
      description: formDesc,
      category: formCategory,
      status: 'Open',
      priority: ai.priority,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      assignedTo: 'Unassigned',
    };
    setComplaints([newComplaint, ...complaints]);
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setFormTitle(''); setFormDesc(''); setFormCategory(''); setAiResult(null); setSubmitted(false);
    }, 1800);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-gray-900 text-sm">HostelIQ</p>
              <p className="text-xs text-indigo-500">Student Portal</p>
            </div>
          </div>
          <Link to="/student/dashboard" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Complaints</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track and manage all your hostel complaints</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> File New Complaint
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm`}>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map(cat => {
            const Icon = cat !== 'All' ? categoryIcons[cat] : Filter;
            const active = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat}
              </button>
            );
          })}
          <div className="ml-auto flex gap-2">
            {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filterStatus === s
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Complaint List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h2 className="font-semibold text-gray-800">Complaints</h2>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">{filtered.length}</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No complaints match your filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(c => {
                const CatIcon = categoryIcons[c.category] || Wrench;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${categoryColors[c.category] || 'bg-gray-100 text-gray-500'}`}>
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{c.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline-flex items-center gap-1 ${statusStyles[c.status]}`}>
                          <StatusIcon s={c.status} /> {c.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                        <span>{c.id}</span>
                        <span>·</span>
                        <span>{c.date}</span>
                        <span>·</span>
                        <span>{c.assignedTo}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[c.priority]}`}>{c.priority}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium sm:hidden ${statusStyles[c.status]}`}>{c.status}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selected && <ComplaintModal complaint={selected} onClose={() => setSelected(null)} />}

      {/* ── File Complaint Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white relative sticky top-0 z-10">
              <button onClick={() => { setShowForm(false); setFormTitle(''); setFormDesc(''); setFormCategory(''); setAiResult(null); setSubmitted(false); }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <h2 className="text-lg font-bold">File New Complaint</h2>
              </div>
              <p className="text-indigo-200 text-xs mt-1">AI will automatically categorize and prioritize your complaint</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Complaint Title <span className="text-rose-500">*</span></label>
                <input
                  value={formTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Water leakage near bathroom sink"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              {/* AI Categorization Card */}
              {aiResult && !submitted && (
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-cyan-400" />
                    <p className="text-white font-semibold text-sm">AI Analysis</p>
                    <span className="ml-auto bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full font-medium">{aiResult.confidence}% confidence</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Category',    value: aiResult.category },
                      { label: 'Priority',    value: aiResult.priority },
                      { label: 'Est. Resolution', value: aiResult.resolution },
                    ].map(row => (
                      <div key={row.label} className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-indigo-300 text-xs mb-1">{row.label}</p>
                        <p className="text-white text-xs font-bold">{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-indigo-200 text-xs">AI will auto-assign this to the relevant department upon submission.</p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-rose-500">*</span></label>
                <textarea
                  value={formDesc}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => {
                    const Icon = categoryIcons[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormCategory(cat)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          formCategory === cat
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Attach Photo <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                  <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-300 mt-0.5">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Submit */}
              {submitted ? (
                <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 py-3 rounded-xl text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5" /> Complaint filed successfully!
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!formTitle.trim() || !formDesc.trim() || !formCategory}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Submit Complaint
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
