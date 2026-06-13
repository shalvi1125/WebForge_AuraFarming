import { useEffect, useState } from 'react';

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface HostelComplaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  date: string;
  assignedTo: string;
  student: string;
  room: string;
  roomId: string;
}

export const COMPLAINTS_STORAGE_KEY = 'hostelComplaints';
export const COMPLAINTS_UPDATED_EVENT = 'hostelComplaintsUpdated';

export const DEFAULT_COMPLAINTS: HostelComplaint[] = [
  {
    id: 'CMP-041',
    title: 'Water leakage near bathroom sink',
    description: 'There is a constant drip from the pipe under the sink causing the floor to stay wet.',
    category: 'Plumbing',
    status: 'In Progress',
    priority: 'High',
    date: '10 Jun 2025',
    assignedTo: 'Rajan Kumar',
    student: 'Aryan Sharma',
    room: '204',
    roomId: '204',
  },
  {
    id: 'CMP-040',
    title: 'Power socket not working',
    description: 'Power socket sparks when used and needs urgent inspection.',
    category: 'Electrical',
    status: 'Open',
    priority: 'High',
    date: '11 Jun 2025',
    assignedTo: 'Unassigned',
    student: 'Rohit Verma',
    room: '202',
    roomId: '202',
  },
  {
    id: 'CMP-039',
    title: 'Wi-Fi outage in west wing',
    description: 'Internet has been unavailable in the west wing since morning.',
    category: 'Internet',
    status: 'Open',
    priority: 'Medium',
    date: '11 Jun 2025',
    assignedTo: 'IT Support',
    student: 'Sneha Patil',
    room: '208',
    roomId: '208',
  },
  {
    id: 'CMP-038',
    title: 'Broken window latch',
    description: 'Window latch is broken and cannot be secured at night.',
    category: 'Furniture',
    status: 'Open',
    priority: 'Critical',
    date: '10 Jun 2025',
    assignedTo: 'Emergency Maintenance',
    student: 'Vikash M.',
    room: '206',
    roomId: '206',
  },
  {
    id: 'CMP-031',
    title: 'Mess food quality issue',
    description: 'The dinner served on 01 Jun was undercooked and caused stomach issues.',
    category: 'Hygiene',
    status: 'Resolved',
    priority: 'Medium',
    date: '01 Jun 2025',
    assignedTo: 'Mess Supervisor',
    student: 'Aryan Sharma',
    room: '204',
    roomId: '204',
  },
];

function emitComplaintsUpdated() {
  window.dispatchEvent(new Event(COMPLAINTS_UPDATED_EVENT));
}

export function getComplaints(): HostelComplaint[] {
  if (typeof window === 'undefined') return DEFAULT_COMPLAINTS;

  try {
    const stored = window.localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(DEFAULT_COMPLAINTS));
      return DEFAULT_COMPLAINTS;
    }
    const parsed = JSON.parse(stored) as HostelComplaint[];
    return Array.isArray(parsed) ? parsed : DEFAULT_COMPLAINTS;
  } catch {
    window.localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(DEFAULT_COMPLAINTS));
    return DEFAULT_COMPLAINTS;
  }
}

export function saveComplaints(complaints: HostelComplaint[]): void {
  window.localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
  emitComplaintsUpdated();
}

export function createComplaintId(complaints: HostelComplaint[]): string {
  const maxId = complaints.reduce((max, complaint) => {
    const match = complaint.id.match(/CMP-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `CMP-${String(maxId + 1).padStart(3, '0')}`;
}

export function getStatusCounts(complaints: HostelComplaint[]) {
  return {
    total: complaints.length,
    open: complaints.filter((complaint) => complaint.status === 'Open').length,
    inProgress: complaints.filter((complaint) => complaint.status === 'In Progress').length,
    resolved: complaints.filter((complaint) => complaint.status === 'Resolved').length,
  };
}

export function useComplaints() {
  const [complaints, setComplaintsState] = useState<HostelComplaint[]>(() => getComplaints());

  useEffect(() => {
    const refresh = () => setComplaintsState(getComplaints());
    window.addEventListener(COMPLAINTS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(COMPLAINTS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  function setComplaints(next: HostelComplaint[]) {
    saveComplaints(next);
    setComplaintsState(next);
  }

  function addComplaint(complaint: Omit<HostelComplaint, 'id'>) {
    const current = getComplaints();
    const next = [{ ...complaint, id: createComplaintId(current) }, ...current];
    setComplaints(next);
  }

  function updateComplaint(id: string, updates: Partial<HostelComplaint>) {
    const next = getComplaints().map((complaint) => (
      complaint.id === id ? { ...complaint, ...updates } : complaint
    ));
    setComplaints(next);
  }

  return { complaints, addComplaint, updateComplaint, setComplaints };
}
