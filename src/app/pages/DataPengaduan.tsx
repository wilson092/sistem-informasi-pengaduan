import { useState } from "react";
import { Search, Filter, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, TANGERANG_DISTRICTS, STATUS_COLORS } from "../constants/complaint";
import { useAuth } from "../context/AuthContext";
import ComplaintFormModal from "../components/ComplaintFormModal";

export default function DataPengaduan() {
  const navigate = useNavigate();
  const { user, getUserComplaints, getAllComplaints } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [districtFilter, setDistrictFilter] = useState("Semua");
  const [dateFilter, setDateFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const isAdmin = user?.role === "admin";
  const allComplaints = isAdmin ? getAllComplaints() : getUserComplaints();

  const filteredData = allComplaints.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "Semua" || item.category === categoryFilter;
    const matchesDistrict = districtFilter === "Semua" || item.district === districtFilter;
    const matchesDate = !dateFilter || item.createdAt.slice(0, 10) === dateFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesDistrict && matchesDate;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Diterima":
        return "Diterima";
      case "Sedang Diproses":
        return "Sedang Diproses";
      case "Selesai Ditangani":
        return "Selesai";
      case "Ditolak":
        return "Ditolak";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-700";
  };

  const getUserName = (userId: string) => {
    if (userId === "user-002") return "John Doe";
    return "Anonymous";
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isAdmin ? "Data Pengaduan" : "Pengaduan Saya"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin
              ? "Monitoring pengaduan kebersihan lingkungan"
              : "Lihat daftar pengaduan yang Anda buat"}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30"
          >
            <Plus className="w-5 h-5" />
            Buat Pengaduan
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pengaduan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option>Semua</option>
              {COMPLAINT_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          {isAdmin && (
            <>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option>Semua</option>
                {COMPLAINT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option>Semua</option>
                {TANGERANG_DISTRICTS.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>Tidak ada pengaduan ditemukan</p>
          </div>
        ) : (
          <>
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
                    {isAdmin && (
                      <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                        Pelapor
                      </th>
                    )}
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                      Kecamatan
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                        Respon
                      </th>
                    )}
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 text-gray-800 max-w-xs truncate">
                        {item.title}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {getUserName(item.userId)}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {item.district}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                              item.adminResponse.length > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.adminResponse.length > 0 ? "Sudah" : "Belum"}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/pengaduan/${item.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Menampilkan {filteredData.length} dari {allComplaints.length} data
              </p>
            </div>
          </>
        )}
      </div>

      {/* Complaint Modal */}
      <ComplaintFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
