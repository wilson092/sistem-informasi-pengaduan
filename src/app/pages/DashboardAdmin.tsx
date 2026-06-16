import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Clock, FileText, MessageSquare, TrendingUp, XCircle } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_COLORS,
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES,
  STATUS_COLORS,
  TANGERANG_DISTRICTS,
} from "../constants/complaint";
import { useAuth } from "../context/AuthContext";
import type { ComplaintStatus } from "../types/complaint";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { getAllComplaints, updateComplaintStatus } = useAuth();
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [districtFilter, setDistrictFilter] = useState("Semua");
  const [dateFilter, setDateFilter] = useState("");

  const complaints = getAllComplaints();
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = statusFilter === "Semua" || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === "Semua" || complaint.category === categoryFilter;
    const matchesDistrict = districtFilter === "Semua" || complaint.district === districtFilter;
    const matchesDate = !dateFilter || complaint.createdAt.slice(0, 10) === dateFilter;
    return matchesStatus && matchesCategory && matchesDistrict && matchesDate;
  });

  const stats = [
    { title: "Total Pengaduan", value: complaints.length.toString(), icon: FileText, color: "blue", change: "+12.5%" },
    { title: "Diterima", value: complaints.filter((c) => c.status === "Diterima").length.toString(), icon: Clock, color: "blue", change: "+4.3%" },
    { title: "Sedang Diproses", value: complaints.filter((c) => c.status === "Sedang Diproses").length.toString(), icon: AlertCircle, color: "yellow", change: "+18.2%" },
    { title: "Selesai Ditangani", value: complaints.filter((c) => c.status === "Selesai Ditangani").length.toString(), icon: CheckCircle2, color: "green", change: "+18.2%" },
    { title: "Ditolak", value: complaints.filter((c) => c.status === "Ditolak").length.toString(), icon: XCircle, color: "red", change: "-2.1%" },
  ];

  const monthlyData = [
    { month: "Jan", pengaduan: 65 },
    { month: "Feb", pengaduan: 78 },
    { month: "Mar", pengaduan: 90 },
    { month: "Apr", pengaduan: 81 },
    { month: "Mei", pengaduan: 95 },
    { month: "Jun", pengaduan: complaints.length },
  ];

  const categoryMap = new Map<string, number>();
  complaints.forEach((complaint) => {
    categoryMap.set(complaint.category, (categoryMap.get(complaint.category) || 0) + 1);
  });
  const categoryData = Array.from(categoryMap, ([name, value]) => ({ name, value }));

  const getStatusColor = (status: string) =>
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-700";

  const handleReply = (complaintId: string) => {
    localStorage.setItem("replyComplaintId", complaintId);
    navigate(`/pengaduan/${complaintId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-600 mt-1">Monitoring Pengaduan Kebersihan Lingkungan Kabupaten Tangerang</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Tren Pengaduan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorPengaduan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area type="monotone" dataKey="pengaduan" stroke="#3b82f6" strokeWidth={2} fill="url(#colorPengaduan)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Kategori Pengaduan</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">Belum ada data kategori</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Monitoring Pengaduan ({filteredComplaints.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
              <option>Semua</option>
              {COMPLAINT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
              <option>Semua</option>
              {COMPLAINT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
              <option>Semua</option>
              {TANGERANG_DISTRICTS.map((district) => <option key={district} value={district}>{district}</option>)}
            </select>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        </div>
        {filteredComplaints.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Belum ada pengaduan</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Nama User</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Kecamatan</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Balasan</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => {
                  const userName = complaint.userId === "user-002" ? "John Doe" : "Anonymous";
                  return (
                    <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{complaint.id}</td>
                      <td className="px-6 py-4 text-gray-800">{userName}</td>
                      <td className="px-6 py-4 text-gray-800 max-w-xs truncate">{complaint.title}</td>
                      <td className="px-6 py-4 text-gray-600">{complaint.category}</td>
                      <td className="px-6 py-4 text-gray-600">{complaint.district}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={complaint.status}
                          onChange={(e) => updateComplaintStatus(complaint.id, e.target.value as ComplaintStatus)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(complaint.status)}`}
                        >
                          {COMPLAINT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className={`px-3 py-1 rounded-full font-medium ${complaint.adminResponse.length > 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {complaint.adminResponse.length > 0 ? "Sudah Direspon" : "Belum Direspon"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button onClick={() => handleReply(complaint.id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-xs">
                            <MessageSquare className="w-4 h-4" />
                            Balas
                          </button>
                          <button onClick={() => navigate(`/pengaduan/${complaint.id}`)} className="text-gray-600 hover:text-gray-700 font-medium text-xs">
                            Lihat
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
