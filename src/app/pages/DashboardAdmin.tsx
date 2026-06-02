import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../context/AuthContext";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { getAllComplaints, updateComplaintStatus } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);

  const complaints = getAllComplaints();

  // Calculate stats
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const diposCount = complaints.filter((c) => c.status === "diproses").length;
  const selesaiCount = complaints.filter((c) => c.status === "selesai").length;
  const belumRespon = complaints.filter((c) => c.responseStatus === "belum").length;

  const stats = [
    {
      title: "Total Pengaduan",
      value: totalComplaints.toString(),
      icon: FileText,
      color: "blue",
      change: "+12.5%",
    },
    {
      title: "Pending",
      value: pendingCount.toString(),
      icon: Clock,
      color: "yellow",
      change: "+4.3%",
    },
    {
      title: "Selesai",
      value: selesaiCount.toString(),
      icon: CheckCircle2,
      color: "green",
      change: "+18.2%",
    },
    {
      title: "Belum Direspon",
      value: belumRespon.toString(),
      icon: AlertCircle,
      color: "red",
      change: "-2.1%",
    },
  ];

  // Monthly data
  const monthlyData = [
    { month: "Jan", pengaduan: 65 },
    { month: "Feb", pengaduan: 78 },
    { month: "Mar", pengaduan: 90 },
    { month: "Apr", pengaduan: 81 },
    { month: "May", pengaduan: 95 },
    { month: "Jun", pengaduan: complaints.length },
  ];

  // Category data from complaints
  const categoryMap = new Map<string, number>();
  complaints.forEach((c) => {
    categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + 1);
  });
  const categoryData = Array.from(categoryMap, ([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-700";
      case "diproses":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "diproses":
        return "Diproses";
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  };

  const getResponseStatusLabel = (status: string) => {
    return status === "sudah" ? "✓ Sudah Direspon" : "Belum Direspon";
  };

  const handleReply = (complaintId: string) => {
    // Simpan complaint ID ke localStorage untuk dibuka di modal
    localStorage.setItem("replyComplaintId", complaintId);
    navigate(`/pengaduan/${complaintId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-600 mt-1">
          Overview statistik pengaduan dan monitoring sistem
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">
            Tren Pengaduan Bulanan
          </h3>
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
              <Area
                type="monotone"
                dataKey="pengaduan"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorPengaduan)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">
            Kategori Pengaduan
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Belum ada data kategori
            </div>
          )}
        </div>
      </div>

      {/* All Complaints Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">
            Semua Pengaduan ({complaints.length})
          </h3>
        </div>
        {complaints.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada pengaduan
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Nama User
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Status Respon
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {complaints.map((complaint) => {
                  // Find user name (for demo, we'll extract from complaint)
                  const userName =
                    complaint.userId === "user-002"
                      ? "John Doe"
                      : "Anonymous";
                  return (
                    <tr
                      key={complaint.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        {complaint.id}
                      </td>
                      <td className="px-6 py-4 text-gray-800">{userName}</td>
                      <td className="px-6 py-4 text-gray-800 max-w-xs truncate">
                        {complaint.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {complaint.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            updateComplaintStatus(
                              complaint.id,
                              e.target.value as any
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="diproses">Diproses</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            complaint.responseStatus === "sudah"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {getResponseStatusLabel(complaint.responseStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(complaint.id)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-xs"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Balas
                          </button>
                          <button
                            onClick={() => navigate(`/pengaduan/${complaint.id}`)}
                            className="text-gray-600 hover:text-gray-700 font-medium text-xs"
                          >
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
