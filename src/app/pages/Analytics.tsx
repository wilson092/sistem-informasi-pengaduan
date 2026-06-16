import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, TrendingUp } from "lucide-react";
import { CHART_COLORS, COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, TANGERANG_DISTRICTS } from "../constants/complaint";
import { useAuth } from "../context/AuthContext";

function countBy(items: string[], allLabels: string[]) {
  return allLabels
    .map((label) => ({
      name: label,
      value: items.filter((item) => item === label).length,
    }))
    .filter((item) => item.value > 0);
}

export default function Analytics() {
  const { getAllComplaints } = useAuth();
  const complaints = getAllComplaints();
  const total = complaints.length;
  const completed = complaints.filter((complaint) => complaint.status === "Selesai Ditangani").length;
  const responded = complaints.filter((complaint) => complaint.adminResponse.length > 0).length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const responseRate = total ? Math.round((responded / total) * 100) : 0;

  const categoryStats = countBy(complaints.map((complaint) => complaint.category), COMPLAINT_CATEGORIES);
  const statusStats = countBy(complaints.map((complaint) => complaint.status), COMPLAINT_STATUSES);
  const districtStats = countBy(complaints.map((complaint) => complaint.district), TANGERANG_DISTRICTS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Statistik</h1>
        <p className="text-gray-600 mt-1">Statistik pengaduan kebersihan lingkungan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Pengaduan</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{total}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <span className="text-sm text-gray-600">Kabupaten Tangerang</span>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Tingkat Penyelesaian</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{completionRate}%</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <span className="text-sm text-gray-600">{completed} selesai ditangani</span>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Balasan Admin</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{responseRate}%</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <span className="text-sm text-gray-600">{responded} pengaduan sudah dibalas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Pengaduan per Kategori</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Pengaduan per Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Pengaduan per Kecamatan</h3>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={districtStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
