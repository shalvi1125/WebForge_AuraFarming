import { useEffect, useMemo, useState } from 'react';
import {
  type LeaveRequest,
  type LeaveStatus,
  type StudentProfileData,
  todayDisplay,
  useLeaveRequests,
  useStudentProfile,
} from '@/react-app/lib/studentState';

const WARDEN_STATE_EVENT = 'wardenPortalStateUpdated';
const WARDEN_STUDENTS_KEY = 'wardenStudents';
const WARDEN_LEAVE_KEY = 'wardenLeaveRequests';

export interface WardenStudent {
  name: string;
  rollNo: string;
  room: string;
  year: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Attention';
  hostel: string;
  block: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  emergencyContact: string;
  joined: string;
  roomCapacity: number;
  occupiedBeds: number;
}

export interface WardenLeaveRequest extends LeaveRequest {
  student: string;
  rollNo: string;
  room: string;
  source: 'student' | 'warden';
}

export const WARDEN = {
  name: 'Dr. Priya Mehta',
  hostel: 'Tagore Hostel',
  block: 'Block B',
  avatar: 'PM',
};

export const DEFAULT_WARDEN_STUDENTS: WardenStudent[] = [
  {
    name: 'Rohit Verma',
    rollNo: 'EC21B032',
    room: '202',
    year: '3rd Year',
    department: 'ECE',
    status: 'Active',
    hostel: WARDEN.hostel,
    block: WARDEN.block,
    email: 'rohit.verma@university.edu',
    phone: '+91 98765 20021',
    parentName: 'Mahesh Verma',
    parentPhone: '+91 98111 20021',
    emergencyContact: 'Mahesh Verma - +91 98111 20021',
    joined: 'Aug 2022',
    roomCapacity: 4,
    occupiedBeds: 4,
  },
  {
    name: 'Sneha Patil',
    rollNo: 'ME21B018',
    room: '208',
    year: '2nd Year',
    department: 'Mechanical',
    status: 'On Leave',
    hostel: WARDEN.hostel,
    block: WARDEN.block,
    email: 'sneha.patil@university.edu',
    phone: '+91 98765 20818',
    parentName: 'Anita Patil',
    parentPhone: '+91 98111 20818',
    emergencyContact: 'Anita Patil - +91 98111 20818',
    joined: 'Aug 2023',
    roomCapacity: 4,
    occupiedBeds: 2,
  },
  {
    name: 'Vikash M.',
    rollNo: 'CS21B061',
    room: '206',
    year: '3rd Year',
    department: 'CSE',
    status: 'Attention',
    hostel: WARDEN.hostel,
    block: WARDEN.block,
    email: 'vikash.m@university.edu',
    phone: '+91 98765 20661',
    parentName: 'Mohan Kumar',
    parentPhone: '+91 98111 20661',
    emergencyContact: 'Mohan Kumar - +91 98111 20661',
    joined: 'Aug 2022',
    roomCapacity: 4,
    occupiedBeds: 2,
  },
  {
    name: 'Karan Joshi',
    rollNo: 'CS21B051',
    room: '215',
    year: '3rd Year',
    department: 'CSE',
    status: 'Active',
    hostel: WARDEN.hostel,
    block: WARDEN.block,
    email: 'karan.joshi@university.edu',
    phone: '+91 98765 21551',
    parentName: 'Deepak Joshi',
    parentPhone: '+91 98111 21551',
    emergencyContact: 'Deepak Joshi - +91 98111 21551',
    joined: 'Aug 2022',
    roomCapacity: 4,
    occupiedBeds: 3,
  },
  {
    name: 'Priya Singh',
    rollNo: 'IT21B029',
    room: '203',
    year: '2nd Year',
    department: 'IT',
    status: 'Active',
    hostel: WARDEN.hostel,
    block: WARDEN.block,
    email: 'priya.singh@university.edu',
    phone: '+91 98765 20329',
    parentName: 'Neeraj Singh',
    parentPhone: '+91 98111 20329',
    emergencyContact: 'Neeraj Singh - +91 98111 20329',
    joined: 'Aug 2023',
    roomCapacity: 4,
    occupiedBeds: 1,
  },
];

export const DEFAULT_WARDEN_LEAVE_REQUESTS: WardenLeaveRequest[] = [
  {
    id: 'LV-013',
    student: 'Sneha Patil',
    rollNo: 'ME21B018',
    room: '208',
    reason: 'Medical appointment',
    fromDate: '2025-06-15',
    toDate: '2025-06-15',
    days: 1,
    status: 'Pending',
    appliedOn: '2025-06-11',
    warden: WARDEN.name,
    source: 'warden',
  },
  {
    id: 'LV-012',
    student: 'Karan Joshi',
    rollNo: 'CS21B051',
    room: '215',
    reason: 'Home visit',
    fromDate: '2025-06-12',
    toDate: '2025-06-14',
    days: 3,
    status: 'Approved',
    appliedOn: '2025-06-09',
    warden: WARDEN.name,
    approvalNotes: 'Approved. Return before evening roll call.',
    reviewedOn: '12 Jun 2025',
    source: 'warden',
  },
  {
    id: 'LV-010',
    student: 'Rohit Verma',
    rollNo: 'EC21B032',
    room: '202',
    reason: 'Project presentation travel',
    fromDate: '2025-06-18',
    toDate: '2025-06-19',
    days: 2,
    status: 'Pending',
    appliedOn: '2025-06-12',
    warden: WARDEN.name,
    source: 'warden',
  },
];

function emitWardenUpdate(key: string) {
  window.dispatchEvent(new CustomEvent(WARDEN_STATE_EVENT, { detail: key }));
}

function readWardenStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeWardenStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  emitWardenUpdate(key);
}

function useWardenStorage<T>(key: string, fallback: T) {
  const [value, setValueState] = useState<T>(() => readWardenStorage(key, fallback));

  useEffect(() => {
    const refresh = () => setValueState(readWardenStorage(key, fallback));
    window.addEventListener(WARDEN_STATE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(WARDEN_STATE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [fallback, key]);

  function setValue(next: T | ((current: T) => T)) {
    const current = readWardenStorage(key, fallback);
    const resolved = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
    writeWardenStorage(key, resolved);
    setValueState(resolved);
  }

  return [value, setValue] as const;
}

function profileToWardenStudent(profile: StudentProfileData): WardenStudent {
  return {
    name: profile.name,
    rollNo: profile.rollNo,
    room: profile.room,
    year: profile.year,
    department: profile.department,
    status: 'Active',
    hostel: profile.hostel,
    block: profile.block,
    email: profile.email,
    phone: profile.phone,
    parentName: profile.parent.name,
    parentPhone: profile.parent.phone,
    emergencyContact: `${profile.emergencyContact.name} - ${profile.emergencyContact.phone}`,
    joined: profile.joined,
    roomCapacity: profile.roomCapacity || 4,
    occupiedBeds: profile.occupiedBeds || 3,
  };
}

export function useWardenStudents() {
  const { profile } = useStudentProfile();
  const [storedStudents, setStoredStudents] = useWardenStorage(WARDEN_STUDENTS_KEY, DEFAULT_WARDEN_STUDENTS);

  const students = useMemo(() => {
    const profileStudent = profileToWardenStudent(profile);
    const remaining = storedStudents.filter((student) => student.rollNo !== profile.rollNo && student.name !== profile.name);
    return [profileStudent, ...remaining];
  }, [profile, storedStudents]);

  return { students, setStoredStudents };
}

export function useWardenLeaveRequests() {
  const { profile } = useStudentProfile();
  const { leaveRequests: studentLeaveRequests, updateLeaveRequest } = useLeaveRequests();
  const [storedRequests, setStoredRequests] = useWardenStorage(WARDEN_LEAVE_KEY, DEFAULT_WARDEN_LEAVE_REQUESTS);

  const leaveRequests = useMemo<WardenLeaveRequest[]>(() => {
    const currentStudentRequests = studentLeaveRequests.map((request) => ({
      ...request,
      student: profile.name,
      rollNo: profile.rollNo,
      room: profile.room,
      source: 'student' as const,
    }));
    return [...currentStudentRequests, ...storedRequests];
  }, [profile.name, profile.rollNo, profile.room, studentLeaveRequests, storedRequests]);

  function reviewLeaveRequest(id: string, status: Extract<LeaveStatus, 'Approved' | 'Rejected'>, approvalNotes: string) {
    const notes = approvalNotes.trim();
    const reviewedOn = todayDisplay();
    if (studentLeaveRequests.some((request) => request.id === id)) {
      updateLeaveRequest(id, { status, approvalNotes: notes, reviewedOn });
      return;
    }
    setStoredRequests((current) => current.map((request) => (
      request.id === id ? { ...request, status, approvalNotes: notes, reviewedOn } : request
    )));
  }

  return { leaveRequests, reviewLeaveRequest, setStoredRequests };
}
