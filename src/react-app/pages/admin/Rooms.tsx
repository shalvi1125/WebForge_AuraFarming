import { Link } from 'react-router';
import { BedDouble, ArrowLeft, BrainCircuit, AlertCircle, Wrench, Users, TrendingUp } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import { useComplaints } from '@/react-app/lib/complaints';
import { useWardenStudents } from '@/react-app/lib/wardenState';

const ADMIN = { name: 'Dr. Rajesh Kumar', avatar: 'RK' };
const maintenanceCategories = ['Plumbing', 'Electrical', 'Furniture', 'Hygiene', 'Security'];

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export default function AdminRooms() {
  const { students } = useWardenStudents();
  const { complaints } = useComplaints();
  const activeComplaints = complaints.filter((complaint) => complaint.status !== 'Resolved');
  const maintenanceComplaints = activeComplaints.filter((complaint) => maintenanceCategories.includes(complaint.category));
  const rooms = Array.from(new Map(students.map((student) => [student.room, {
    room: student.room,
    block: student.block,
    hostel: student.hostel,
    capacity: student.roomCapacity,
    occupied: student.occupiedBeds,
  }])).values());
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const occupiedBeds = rooms.reduce((sum, room) => sum + room.occupied, 0);
  const vacantBeds = Math.max(0, totalCapacity - occupiedBeds);
  const occupancyPercent = percent(occupiedBeds, totalCapacity);
  const roomUtilizationPercent = percent(rooms.filter((room) => room.occupied > 0).length, rooms.length);
  const fullRooms = rooms.filter((room) => room.occupied >= room.capacity).length;
  const underUtilizedRooms = rooms.filter((room) => room.occupied > 0 && room.occupied < room.capacity).length;

  const blockSummaries = Array.from(new Set(rooms.map((room) => room.block))).map((block) => {
    const blockRooms = rooms.filter((room) => room.block === block);
    const blockCapacity = blockRooms.reduce((sum, room) => sum + room.capacity, 0);
    const blockOccupied = blockRooms.reduce((sum, room) => sum + room.occupied, 0);
    const blockComplaints = activeComplaints.filter((complaint) => blockRooms.some((room) => room.room === complaint.room || room.room === complaint.roomId));
    return {
      name: `Block ${block}`,
      total: blockCapacity,
      occupied: blockOccupied,
      rooms: blockRooms.length,
      maintenance: blockComplaints.filter((complaint) => maintenanceCategories.includes(complaint.category)).length,
      complaints: blockComplaints.length,
    };
  });

  const roomDensity = rooms.map((room) => ({
    ...room,
    complaints: activeComplaints.filter((complaint) => complaint.room === room.room || complaint.roomId === room.room).length,
    maintenance: maintenanceComplaints.filter((complaint) => complaint.room === room.room || complaint.roomId === room.room).length,
    utilization: percent(room.occupied, room.capacity),
  })).sort((a, b) => b.complaints - a.complaints || b.utilization - a.utilization);
  const maxRoomComplaints = Math.max(1, ...roomDensity.map((room) => room.complaints));

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Admin Portal" userName={ADMIN.name} avatar={ADMIN.avatar} homeHref="/admin/dashboard" dark
        links={[{ label: 'Campus Map', href: '/admin/room' }, { label: 'Rooms', href: '/admin/rooms' }, { label: 'Reports', href: '/admin/reports' }]} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#071B34]">Room Management</h1>
          <Link to="/admin/room" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4F72] hover:text-[#4CC9F0] bg-white px-4 py-2 rounded-lg border border-[#071B34]/10">
            Open Campus Operations Map
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Occupancy', value: `${occupancyPercent}%`, icon: Users },
            { label: 'Room Utilization', value: `${roomUtilizationPercent}%`, icon: BedDouble },
            { label: 'Active Complaints', value: String(activeComplaints.length), icon: AlertCircle },
            { label: 'Maintenance Queue', value: String(maintenanceComplaints.length), icon: Wrench },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <Icon className="w-5 h-5 text-[#1B4F72] mb-3" />
                <p className="text-xs text-[#374151]">{metric.label}</p>
                <p className="text-2xl font-extrabold text-[#1B4F72] mt-1">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blockSummaries.map((block) => (
            <div key={block.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover">
              <div className="flex items-center gap-2 mb-3"><BedDouble className="w-5 h-5 text-[#1B4F72]" /><h3 className="font-semibold">{block.name}</h3></div>
              <p className="text-2xl font-extrabold text-[#1B4F72]">{percent(block.occupied, block.total)}%</p>
              <p className="text-xs text-[#374151] font-medium mt-1">{block.occupied}/{block.total} occupied - {block.rooms} rooms - {block.maintenance} maintenance</p>
              <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-[#4CC9F0] rounded-full" style={{ width: `${percent(block.occupied, block.total)}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="font-semibold text-[#071B34] text-sm mb-4">Complaint Density by Room</p>
            <div className="space-y-4">
              {roomDensity.map((room) => (
                <div key={room.room}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#374151]">Room {room.room}</span>
                    <span className="font-semibold text-[#071B34]">{room.complaints} active</span>
                  </div>
                  <div className="h-2 bg-[#071B34]/8 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1B4F72] rounded-full" style={{ width: `${percent(room.complaints, maxRoomComplaints)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="font-semibold text-[#071B34] text-sm mb-4">Capacity Insights</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Vacant Beds', value: vacantBeds },
                { label: 'Full Rooms', value: fullRooms },
                { label: 'Under-utilized Rooms', value: underUtilizedRooms },
                { label: 'Tracked Rooms', value: rooms.length },
              ].map((item) => (
                <div key={item.label} className="bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/8">
                  <p className="text-xs text-[#374151]">{item.label}</p>
                  <p className="text-2xl font-extrabold text-[#071B34] mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-3 bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/10">
              <BrainCircuit className="w-5 h-5 text-[#1B4F72] shrink-0" />
              <p className="text-sm text-[#071B34]">
                Capacity planning: {vacantBeds} vacant bed{vacantBeds === 1 ? '' : 's'} remain across {rooms.length} tracked rooms. {maintenanceComplaints.length} active maintenance-linked complaint{maintenanceComplaints.length === 1 ? '' : 's'} may affect allocation.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="font-semibold text-[#071B34] text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#1B4F72]" /> Maintenance Overview</p>
          <div className="grid md:grid-cols-2 gap-3">
            {maintenanceComplaints.length ? maintenanceComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/8">
                <p className="text-sm font-semibold text-[#071B34]">{complaint.title}</p>
                <p className="text-xs text-[#374151] mt-1">{complaint.id} - Room {complaint.room} - {complaint.category} - {complaint.status}</p>
              </div>
            )) : <p className="text-sm text-[#374151]">No active maintenance-linked complaints.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
