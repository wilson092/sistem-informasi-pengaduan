import type { ComplaintCategory, ComplaintStatus } from "../types/complaint";

export const APP_NAME = "Sistem Informasi Pengaduan Kebersihan Lingkungan Kabupaten Tangerang";
export const APP_SHORT_NAME = "SI Kebersihan";

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  "Sampah Liar",
  "Drainase Tersumbat",
  "Fasilitas Kebersihan Rusak",
  "Pencemaran Lingkungan",
  "Kategori Lain",
];

export const COMPLAINT_STATUSES: ComplaintStatus[] = [
  "Diterima",
  "Sedang Diproses",
  "Selesai Ditangani",
  "Ditolak",
];

export const TANGERANG_DISTRICTS = [
  "Balaraja",
  "Cikupa",
  "Curug",
  "Kelapa Dua",
  "Kosambi",
  "Kronjo",
  "Legok",
  "Mauk",
  "Pakuhaji",
  "Panongan",
  "Pasar Kemis",
  "Rajeg",
  "Sepatan",
  "Sepatan Timur",
  "Sindang Jaya",
  "Solear",
  "Sukadiri",
  "Sukamulya",
  "Teluknaga",
  "Tigaraksa",
  "Cisauk",
  "Gunung Kaler",
  "Jambe",
  "Kemiri",
  "Mekar Baru",
  "Pagedangan",
  "Jayanti",
  "Kresek",
  "Cisoka",
];

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  Diterima: "bg-blue-100 text-blue-700",
  "Sedang Diproses": "bg-yellow-100 text-yellow-700",
  "Selesai Ditangani": "bg-green-100 text-green-700",
  Ditolak: "bg-red-100 text-red-700",
};

export const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
