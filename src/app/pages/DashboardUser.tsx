import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Clock, FileText, Plus, TrendingUp, XCircle } from "lucide-react";
import { STATUS_COLORS } from "../constants/complaint";
import { useAuth } from "../context/AuthContext";
import ComplaintFormModal from "../components/ComplaintFormModal";

export default function DashboardUser() {
  const navigate = useNavigate();
  const { getUserComplaints } = useAuth();
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const complaints = getUserComplaints();
  const totalComplaints = complaints.length;
  const diterimaCount = complaints.filter((c) => c.status === "Diterima").length;
  const prosesCount = complaints.filter((c) => c.status === "Sedang Diproses").length;
  const selesaiCount = complaints.filter((c) => c.status === "Selesai Ditangani").length;
  const ditolakCount = complaints.filter((c) => c.status === "Ditolak").length;

  const stats = [
    { title: "Total Pengaduan", value: totalComplaints.toString(), icon: FileText, color: "blue", change: "Laporan Anda" },
    { title: "Diterima", value: diterimaCount.toString(), icon: Clock, color: "blue", change: "Baru" },
    { title: "Sedang Diproses", value: prosesCount.toString(), icon: AlertCircle, color: "yellow", change: "Sedang Ditangani" },
    { title: "Selesai Ditangani", value: selesaiCount.toString(), icon: CheckCircle2, color: "green", change: "Terselesaikan" },
    { title: "Ditolak", value: ditolakCount.toString(), icon: XCircle, color: "red", change: "Perlu Diperbaiki" },
  ];

  const getStatusColor = (status: string) =>
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-700";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Saya</h1>
          <p className="text-gray-600 mt-1">Kelola pengaduan dan balasan admin</p>
        </div>
        <button
          onClick={() => setShowComplaintModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Buat Pengaduan Baru
        </button>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Riwayat Pengaduan ({complaints.length})</h3>
        </div>
        {complaints.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Anda belum membuat pengaduan apapun</p>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Buat Pengaduan Baru
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Balasan Admin</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{complaint.id}</td>
                    <td className="px-6 py-4 text-gray-800 max-w-xs truncate">{complaint.title}</td>
                    <td className="px-6 py-4 text-gray-600">{complaint.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          complaint.adminResponse.length > 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {complaint.adminResponse.length > 0 ? "Ada Balasan" : "Belum Direspon"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/pengaduan/${complaint.id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ComplaintFormModal isOpen={showComplaintModal} onClose={() => setShowComplaintModal(false)} />
    </div>
  );
}
