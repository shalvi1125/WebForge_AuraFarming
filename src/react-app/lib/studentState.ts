import { useEffect, useState } from 'react';

export const STUDENT_NAME = 'Aryan Sharma';
export const STUDENT_ROLL = 'CS21B047';
export const STUDENT_ROOM = '204';
export const STUDENT_BLOCK = 'Block B';
export const STUDENT_HOSTEL = 'Tagore Hostel';

const STUDENT_STATE_EVENT = 'studentPortalStateUpdated';

export interface StudentProfileData {
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  year: string;
  department: string;
  hostel: string;
  block: string;
  room: string;
  roomCapacity?: number;
  occupiedBeds?: number;
  joined: string;
  avatar: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  parent: {
    name: string;
    relation: string;
    phone: string;
    email: string;
    address: string;
  };
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveRequest {
  id: string;
  reason: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: LeaveStatus;
  appliedOn: string;
  warden: string;
  approvalNotes?: string;
  reviewedOn?: string;
}

export type FeeStatus = 'paid' | 'pending' | 'overdue';

export interface FeePayment {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: FeeStatus;
  paidOn?: string;
  receiptNo?: string;
}

export type NoticeType = 'general' | 'mess' | 'maintenance' | 'emergency' | 'event';

export interface AnnouncementComment {
  id: string;
  author: string;
  body: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: NoticeType;
  date: string;
  pinned?: boolean;
  likes: number;
  likedBy: string[];
  commentsList: AnnouncementComment[];
}

const PROFILE_KEY = 'studentProfile';
const LEAVE_KEY = 'studentLeaveRequests';
const FEES_KEY = 'studentFeePayments';
const ANNOUNCEMENTS_KEY = 'studentAnnouncements';

export const DEFAULT_PROFILE: StudentProfileData = {
  name: STUDENT_NAME,
  rollNo: STUDENT_ROLL,
  email: 'aryan.sharma@university.edu',
  phone: '+91 98765 43210',
  year: '3rd Year',
  department: 'CSE',
  hostel: STUDENT_HOSTEL,
  block: STUDENT_BLOCK,
  room: STUDENT_ROOM,
  roomCapacity: 4,
  occupiedBeds: 3,
  joined: 'Aug 2022',
  avatar: 'AS',
  emergencyContact: {
    name: 'Rahul Sharma',
    relation: 'Brother',
    phone: '+91 98765 11022',
  },
  parent: {
    name: 'Ramesh Sharma',
    relation: 'Father',
    phone: '+91 98111 22334',
    email: 'ramesh.sharma@example.com',
    address: 'Jaipur, Rajasthan',
  },
};

export const DEFAULT_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'LV-014', reason: 'Family function - summer break', fromDate: '2025-06-14', toDate: '2025-06-17', days: 4, status: 'Pending', appliedOn: '2025-06-10', warden: 'Dr. Priya Mehta' },
  { id: 'LV-011', reason: 'Medical appointment', fromDate: '2025-06-02', toDate: '2025-06-02', days: 1, status: 'Approved', appliedOn: '2025-06-01', warden: 'Dr. Priya Mehta' },
  { id: 'LV-008', reason: 'College fest at home campus', fromDate: '2025-05-20', toDate: '2025-05-22', days: 3, status: 'Rejected', appliedOn: '2025-05-18', warden: 'Dr. Priya Mehta' },
  { id: 'LV-005', reason: 'Personal work at hometown', fromDate: '2025-05-05', toDate: '2025-05-07', days: 3, status: 'Approved', appliedOn: '2025-05-03', warden: 'Dr. Priya Mehta' },
];

export const DEFAULT_FEES: FeePayment[] = [
  { id: 'PAY-024', description: 'Hostel Fee - Semester 2', amount: 8000, date: '01 May 2025', status: 'paid', paidOn: '01 May 2025', receiptNo: 'RCT-024' },
  { id: 'PAY-021', description: 'Mess Fee - April', amount: 3500, date: '01 Apr 2025', status: 'paid', paidOn: '01 Apr 2025', receiptNo: 'RCT-021' },
  { id: 'PAY-018', description: 'Hostel Fee - Semester 1', amount: 8000, date: '15 Jan 2025', status: 'paid', paidOn: '15 Jan 2025', receiptNo: 'RCT-018' },
  { id: 'PAY-027', description: 'Mess Fee - June', amount: 3500, date: 'Due 30 Jun', status: 'pending' },
  { id: 'PAY-028', description: 'Late Fee - May Mess', amount: 1000, date: 'Due 30 Jun', status: 'overdue' },
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Hostel Curfew Extended for Fest Week', body: 'Curfew extended to 11:00 PM from 14-18 Jun for college fest participants. Carry ID cards at all times.', type: 'general', date: '12 Jun', pinned: true, likes: 42, likedBy: [], commentsList: [{ id: 'C-1', author: 'Aryan Sharma', body: 'This helps with fest practice, thanks.', date: '12 Jun' }] },
  { id: '2', title: 'Mess Menu Update - Special Dinner', body: 'Special North Indian thali on Sunday. Veg and non-veg options available. Timings: 7-9 PM.', type: 'mess', date: '11 Jun', likes: 89, likedBy: [], commentsList: [] },
  { id: '3', title: 'Block B - Water Supply Maintenance', body: 'Water supply will be interrupted on 15 Jun, 9 AM-12 PM for pipeline repair. Store water in advance.', type: 'maintenance', date: '10 Jun', likes: 23, likedBy: [], commentsList: [] },
  { id: '4', title: 'Fire Drill - Mandatory Attendance', body: 'Emergency fire drill scheduled for 16 Jun at 4 PM. All students must assemble at the main ground.', type: 'emergency', date: '09 Jun', likes: 56, likedBy: [], commentsList: [] },
  { id: '5', title: 'Inter-Hostel Cricket Tournament', body: 'Registrations open until 20 Jun. Teams of 11. Sign up at the warden office or via the student portal.', type: 'event', date: '08 Jun', likes: 124, likedBy: [], commentsList: [] },
];

function emitUpdate(key: string) {
  window.dispatchEvent(new CustomEvent(STUDENT_STATE_EVENT, { detail: key }));
}

export function readStudentStorage<T>(key: string, fallback: T): T {
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

function writeStudentStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  emitUpdate(key);
}

function useStudentStorage<T>(key: string, fallback: T) {
  const [value, setValueState] = useState<T>(() => readStudentStorage(key, fallback));

  useEffect(() => {
    const refresh = () => setValueState(readStudentStorage(key, fallback));
    window.addEventListener(STUDENT_STATE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STUDENT_STATE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [fallback, key]);

  function setValue(next: T | ((current: T) => T)) {
    const current = readStudentStorage(key, fallback);
    const resolved = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
    writeStudentStorage(key, resolved);
    setValueState(resolved);
  }

  return [value, setValue] as const;
}

export function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export function formatDisplayDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function todayDisplay() {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function daysBetweenInclusive(fromDate: string, toDate: string) {
  const from = new Date(`${fromDate}T00:00:00`);
  const to = new Date(`${toDate}T00:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 1;
  return Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
}

function nextNumericId(prefix: string, ids: string[]) {
  const max = ids.reduce((current, id) => {
    const match = id.match(new RegExp(`${prefix}-(\\d+)`));
    return match ? Math.max(current, Number(match[1])) : current;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export function useStudentProfile() {
  const [profile, setProfile] = useStudentStorage(PROFILE_KEY, DEFAULT_PROFILE);
  return { profile, setProfile };
}

export function useLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useStudentStorage(LEAVE_KEY, DEFAULT_LEAVE_REQUESTS);

  function addLeaveRequest(input: { reason: string; fromDate: string; toDate: string }) {
    const current = readStudentStorage(LEAVE_KEY, DEFAULT_LEAVE_REQUESTS);
    const request: LeaveRequest = {
      id: nextNumericId('LV', current.map((item) => item.id)),
      reason: input.reason,
      fromDate: input.fromDate,
      toDate: input.toDate,
      days: daysBetweenInclusive(input.fromDate, input.toDate),
      status: 'Pending',
      appliedOn: new Date().toISOString().slice(0, 10),
      warden: 'Dr. Priya Mehta',
    };
    setLeaveRequests([request, ...current]);
  }

  function cancelLeaveRequest(id: string) {
    setLeaveRequests((current) => current.map((item) => item.id === id && item.status === 'Pending' ? { ...item, status: 'Cancelled' } : item));
  }

  function updateLeaveRequest(id: string, updates: Partial<LeaveRequest>) {
    setLeaveRequests((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item));
  }

  return { leaveRequests, addLeaveRequest, cancelLeaveRequest, updateLeaveRequest, setLeaveRequests };
}

export function useFees() {
  const [payments, setPayments] = useStudentStorage(FEES_KEY, DEFAULT_FEES);

  function payOutstanding() {
    const current = readStudentStorage(FEES_KEY, DEFAULT_FEES);
    const receiptNo = `RCT-${Date.now().toString().slice(-6)}`;
    const paidOn = todayDisplay();
    setPayments(current.map((payment) => (
      payment.status === 'paid' ? payment : { ...payment, status: 'paid', paidOn, receiptNo }
    )));
    return receiptNo;
  }

  return { payments, setPayments, payOutstanding };
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useStudentStorage(ANNOUNCEMENTS_KEY, DEFAULT_ANNOUNCEMENTS);

  function toggleLike(id: string) {
    setAnnouncements((current) => current.map((notice) => {
      if (notice.id !== id) return notice;
      const liked = notice.likedBy.includes(STUDENT_NAME);
      return {
        ...notice,
        likedBy: liked ? notice.likedBy.filter((name) => name !== STUDENT_NAME) : [...notice.likedBy, STUDENT_NAME],
        likes: liked ? Math.max(0, notice.likes - 1) : notice.likes + 1,
      };
    }));
  }

  function addComment(id: string, body: string) {
    const trimmed = body.trim();
    if (!trimmed) return;
    setAnnouncements((current) => current.map((notice) => (
      notice.id === id
        ? {
            ...notice,
            commentsList: [
              ...notice.commentsList,
              { id: `COM-${Date.now()}`, author: STUDENT_NAME, body: trimmed, date: todayDisplay() },
            ],
          }
        : notice
    )));
  }

  function deleteComment(noticeId: string, commentId: string) {
    setAnnouncements((current) => current.map((notice) => (
      notice.id === noticeId
        ? { ...notice, commentsList: notice.commentsList.filter((comment) => comment.id !== commentId || comment.author !== STUDENT_NAME) }
        : notice
    )));
  }

  return { announcements, toggleLike, addComment, deleteComment };
}

export function getFeeSummary(payments: FeePayment[]) {
  const totalPaid = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = payments.filter((payment) => payment.status !== 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  return { totalPaid, outstanding };
}
