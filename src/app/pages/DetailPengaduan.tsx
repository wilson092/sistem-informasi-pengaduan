import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Tag,
  MessageSquare,
  Send,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminReplyModal from "../components/AdminReplyModal";

export default function DetailPengaduan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, getComplaintById, updateComplaintStatus } = useAuth();

  const [showReplyModal, setShowReplyModal] = useState(false);

  const complaint = id ? getComplaintById(id) : null;

  if (!complaint) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/pengaduan")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-600">Pengaduan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const isOwner = complaint.userId === user?.id;

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

  const getUserName = (userId: string) => {
    // Demo: Map user ID to name
    if (userId === "user-002") return "John Doe";
    return "Anonymous";
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/pengaduan")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">Detail Pengaduan</h1>
          <p className="text-gray-600 mt-1">ID: {complaint.id}</p>
        </div>
        {isAdmin && (
          <select
            value={complaint.status}
            onChange={(e) =>
              updateComplaintStatus(complaint.id, e.target.value as any)
            }
            className={`px-4 py-2.5 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium cursor-pointer ${getStatusColor(
              complaint.status
            )}`}
          >
            <option value="pending">Pending</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {complaint.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Kategori</p>
                  <p className="font-medium text-gray-800">
                    {complaint.category}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Tanggal Dibuat</p>
                  <p className="font-medium text-gray-800">
                    {new Date(complaint.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">
                {complaint.description}
              </p>
              {complaint.imageUrl && (
                <div className="mt-4">
                  <img
                    src={complaint.imageUrl}
                    alt="Dokumentasi pengaduan"
                    className="rounded-lg max-h-96 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Responses/Chat Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Respon dan Balasan
              </h3>
              {isAdmin && (
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Send className="w-4 h-4" />
                  Balas
                </button>
              )}
            </div>

            {complaint.responses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada respon dari admin</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaint.responses.map((response) => (
                  <div key={response.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        A
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {response.adminName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(response.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {response.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pelapor Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Info Pelapor</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-medium text-gray-800">
                    {getUserName(complaint.userId)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Status Saat Ini</h3>
            <div className="text-center py-4">
              <span
                className={`inline-block px-4 py-2 font-medium rounded-full text-lg ${getStatusColor(
                  complaint.status
                )}`}
              >
                {getStatusLabel(complaint.status)}
              </span>
            </div>
          </div>

          {/* Response Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">
              Status Respon Admin
            </h3>
            <div className="text-center py-4">
              <span
                className={`inline-block px-4 py-2 font-medium rounded-full text-lg ${
                  complaint.responseStatus === "sudah"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {complaint.responseStatus === "sudah"
                  ? "✓ Sudah Direspon"
                  : "Belum Direspon"}
              </span>
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Aksi Admin</h3>
              <button
                onClick={() => setShowReplyModal(true)}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Balas Pengaduan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Reply Modal */}
      <AdminReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        complaintId={complaint.id}
        complaintTitle={complaint.title}
      />
    </div>
  );
}
