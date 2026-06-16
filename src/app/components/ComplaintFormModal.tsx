import { useState } from "react";
import { X } from "lucide-react";
import { COMPLAINT_CATEGORIES, TANGERANG_DISTRICTS } from "../constants/complaint";
import { useAuth } from "../context/AuthContext";

interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData = {
  title: "",
  category: "",
  customCategoryDescription: "",
  district: "",
  subDistrict: "",
  description: "",
  photoUrl: "",
};

export default function ComplaintFormModal({ isOpen, onClose }: ComplaintFormModalProps) {
  const { user, addComplaint } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isCustomCategory = formData.category === "Kategori Lain";

  const resetForm = () => setFormData(initialFormData);

  const handleCategoryChange = (category: string) => {
    setFormData({
      ...formData,
      category,
      customCategoryDescription: category === "Kategori Lain" ? formData.customCategoryDescription : "",
    });
  };

  const handlePhotoChange = (file: File | undefined) => {
    if (!file) {
      setFormData({ ...formData, photoUrl: "" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, photoUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

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
    if (isCustomCategory && formData.customCategoryDescription.trim().length < 10) {
      setError("Jelaskan kategori pengaduan wajib diisi minimal 10 karakter");
      return;
    }
    if (!formData.district) {
      setError("Kecamatan harus dipilih");
      return;
    }
    if (!formData.subDistrict.trim()) {
      setError("Kelurahan harus diisi");
      return;
    }
    if (!formData.description.trim()) {
      setError("Deskripsi pengaduan harus diisi");
      return;
    }
    if (!formData.photoUrl) {
      setError("Foto bukti harus diunggah");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        addComplaint({
          userId: user!.id,
          title: formData.title.trim(),
          category: formData.category as any,
          customCategoryDescription: isCustomCategory ? formData.customCategoryDescription.trim() : "",
          district: formData.district,
          subDistrict: formData.subDistrict.trim(),
          description: formData.description.trim(),
          photoUrl: formData.photoUrl,
          status: "Diterima",
        });

        resetForm();
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
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Buat Pengaduan Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Pengaduan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Sampah menumpuk di Jalan Raya Serpong"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
              disabled={isLoading}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {COMPLAINT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {isCustomCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jelaskan Kategori Pengaduan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customCategoryDescription}
                onChange={(e) => setFormData({ ...formData, customCategoryDescription: e.target.value })}
                placeholder="Contoh: Bau menyengat dari TPS sementara"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={isLoading}
                minLength={10}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimal 10 karakter</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kecamatan <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
              disabled={isLoading}
              required
            >
              <option value="">-- Pilih Kecamatan --</option>
              {TANGERANG_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kelurahan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subDistrict}
              onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
              placeholder="Nama kelurahan atau desa"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan lokasi dan kondisi pengaduan dengan lengkap..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Foto Bukti <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              disabled={isLoading}
              required
            />
            {formData.photoUrl && (
              <img src={formData.photoUrl} alt="Preview foto bukti" className="mt-3 rounded-lg max-h-48 object-cover" />
            )}
          </div>

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
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
