import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Infrastruktur",
  "Pelayanan",
  "Kebersihan",
  "Keamanan",
  "Lainnya",
];

export default function ComplaintFormModal({
  isOpen,
  onClose,
}: ComplaintFormModalProps) {
  const { user, addComplaint } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Judul pengaduan harus diisi");
      return;
    }
    if (!formData.category) {
      setError("Kategori harus dipilih");
      return;
    }
    if (!formData.description.trim()) {
      setError("Deskripsi pengaduan harus diisi");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        addComplaint({
          userId: user!.id,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          imageUrl: formData.imageUrl || undefined,
          status: "pending",
        });

        setFormData({ title: "", category: "", description: "", imageUrl: "" });
        onClose();
      } catch (err) {
        setError("Gagal menambahkan pengaduan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            Buat Pengaduan Baru
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Pengaduan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Contoh: Jalan Rusak di Jl. Sudirman"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              disabled={isLoading}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Jelaskan detail pengaduan Anda dengan lengkap..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Tuliskan deskripsi yang jelas dan detail agar pengaduan Anda dapat
              ditangani dengan baik
            </p>
          </div>

          {/* URL Foto (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Foto (Opsional)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://contoh.com/foto.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Salin URL lengkap dari foto atau gambar yang ingin Anda sertakan
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Mengirim..." : "Kirim Pengaduan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
