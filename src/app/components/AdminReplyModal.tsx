import { useState } from "react";
import { X, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AdminReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId: string;
  complaintTitle: string;
}

export default function AdminReplyModal({
  isOpen,
  onClose,
  complaintId,
  complaintTitle,
}: AdminReplyModalProps) {
  const { user, addResponse } = useAuth();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!message.trim()) {
      setError("Balasan tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        addResponse(complaintId, {
          complaintId,
          adminId: user!.id,
          adminName: user!.name,
          message: message.trim(),
        });

        setMessage("");
        setError("");
        onClose();
      } catch (err) {
        setError("Gagal mengirim balasan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Balas Pengaduan
            </h2>
            <p className="text-sm text-gray-600 mt-1">{complaintTitle}</p>
          </div>
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

          {/* Success Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Balasan yang Anda kirim akan langsung ditampilkan ke user pelapor. Pastikan balasan sudah akurat dan membantu.
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balasan untuk Pengaduan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis balasan/respon untuk pengaduan ini..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maksimal 5000 karakter
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
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
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isLoading}
            >
              <Send className="w-4 h-4" />
              {isLoading ? "Mengirim..." : "Kirim Balasan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
