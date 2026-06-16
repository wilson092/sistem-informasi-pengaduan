export type ComplaintStatus =
  | "Diterima"
  | "Sedang Diproses"
  | "Selesai Ditangani"
  | "Ditolak";

export type ComplaintCategory =
  | "Sampah Liar"
  | "Drainase Tersumbat"
  | "Fasilitas Kebersihan Rusak"
  | "Pencemaran Lingkungan"
  | "Kategori Lain";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  phone?: string;
  address?: string;
}

export interface AdminResponse {
  id: string;
  complaintId: string;
  adminId: string;
  adminName: string;
  message: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  category: ComplaintCategory;
  customCategoryDescription: string;
  district: string;
  subDistrict: string;
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  adminResponse: AdminResponse[];
  createdAt: string;
  handledAt?: string;
}

export type NewComplaint = Omit<
  Complaint,
  "id" | "createdAt" | "adminResponse" | "handledAt"
>;
