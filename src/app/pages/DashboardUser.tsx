import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ComplaintFormModal from "../components/ComplaintFormModal";

export default function DashboardUser() {
  const navigate = useNavigate();
  const { user, getUserComplaints } = useAuth();
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const complaints = getUserComplaints();

  // Calculate stats
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const disposCount = complaints.filter((c) => c.status === "diproses").length;
  const selesaiCount = complaints.filter((c) => c.status === "selesai").length;

  const stats = [
    {
      title: "Total Pengaduan Saya",
      value: totalComplaints.toString(),
      icon: FileText,
      color: "blue",
      change: "Laporan Anda",
    },
    {
      title: "Pending",
      value: pendingCount.toString(),
      icon: Clock,
      color: "yellow",
      change: "Menunggu",
    },
    {
      title: "Diproses",
      value: disposCount.toString(),
      icon: AlertCircle,
      color: "orange",
      change: "Sedang Ditangani",
    },
    {
      title: "Selesai",
      value: selesaiCount.toString(),
      icon: CheckCircle2,
      color: "green",
      change: "Terselesaikan",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-700";
      case "diproses":
        return "bg-orange-100 text-orange-700";
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

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Saya
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola pengaduan dan respon dari admin
          </p>
        </div>
        <button
          onClick={() => setShowComplaintModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Buat Pengaduan Baru
        </button>
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

      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">
            Daftar Pengaduan Saya ({complaints.length})
          </h3>
        </div>
        {complaints.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Anda belum membuat pengaduan apapun
            </p>
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
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    ID
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
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Respon
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {complaints.map((complaint) => {
                  const date = new Date(complaint.createdAt);
                  const formattedDate = date.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={complaint.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        {complaint.id}
                      </td>
                      <td className="px-6 py-4 text-gray-800 max-w-xs truncate">
                        {complaint.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {complaint.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {getStatusLabel(complaint.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            complaint.responseStatus === "sudah"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {complaint.responseStatus === "sudah"
                            ? "✓ Ada Respon"
                            : "Belum Direspon"}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Form Modal */}
      <ComplaintFormModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
      />
    </div>
  );
}
