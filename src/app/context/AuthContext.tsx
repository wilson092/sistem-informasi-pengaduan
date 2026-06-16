import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  AdminResponse,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  NewComplaint,
  User,
} from "../types/complaint";

export type { AdminResponse, Complaint, ComplaintStatus, User };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  complaints: Complaint[];
  addComplaint: (complaint: NewComplaint) => void;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus) => void;
  addResponse: (complaintId: string, response: Omit<AdminResponse, "id" | "createdAt">) => void;
  getComplaintById: (id: string) => Complaint | undefined;
  getUserComplaints: () => Complaint[];
  getAllComplaints: () => Complaint[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const COMPLAINTS_STORAGE_VERSION = "cleanliness-complaints-v1";

const DEMO_ACCOUNTS = [
  {
    id: "user-001",
    email: "admin@mail.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
    phone: "+62812345678",
    address: "Kabupaten Tangerang, Banten",
  },
  {
    id: "user-002",
    email: "user@mail.com",
    password: "user123",
    name: "John Doe",
    role: "user" as const,
    phone: "+62821234567",
    address: "Kabupaten Tangerang, Banten",
  },
];

function normalizeComplaint(raw: any): Complaint {
  const responseSource = raw.adminResponse || raw.responses || [];
  const category = raw.category === "Lainnya" || raw.category === "Sampah Tidak Terangkut"
    ? "Kategori Lain"
    : raw.category;

  return {
    id: raw.id,
    userId: raw.userId,
    title: raw.title || "Pengaduan Kebersihan Lingkungan",
    category: (category || "Kategori Lain") as ComplaintCategory,
    customCategoryDescription:
      raw.customCategoryDescription ||
      (category === "Kategori Lain" ? raw.category || "" : ""),
    district: raw.district || raw.kecamatan || "",
    subDistrict: raw.subDistrict || raw.kelurahan || "",
    description: raw.description || "",
    photoUrl: raw.photoUrl || raw.imageUrl || "",
    status: raw.status || "Diterima",
    adminResponse: responseSource,
    createdAt: raw.createdAt || new Date().toISOString(),
    handledAt: raw.handledAt || (raw.status === "Selesai Ditangani" || raw.status === "Ditolak" ? raw.updatedAt : undefined),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedComplaints = localStorage.getItem("complaints");
    const savedVersion = localStorage.getItem("complaints_storage_version");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedVersion !== COMPLAINTS_STORAGE_VERSION) {
      setComplaints([]);
      localStorage.setItem("complaints", JSON.stringify([]));
      localStorage.setItem("complaints_storage_version", COMPLAINTS_STORAGE_VERSION);
    } else if (savedComplaints) {
      const normalized = JSON.parse(savedComplaints).map(normalizeComplaint);
      setComplaints(normalized);
      localStorage.setItem("complaints", JSON.stringify(normalized));
    } else {
      setComplaints([]);
      localStorage.setItem("complaints", JSON.stringify([]));
    }
  }, []);

  const persistComplaints = (nextComplaints: Complaint[]) => {
    setComplaints(nextComplaints);
    localStorage.setItem("complaints", JSON.stringify(nextComplaints));
  };

  const login = (email: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS.find((acc) => acc.email === email && acc.password === password);

    if (!account) return false;

    const userData: User = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      phone: account.phone,
      address: account.address,
    };
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const addComplaint = (complaint: NewComplaint) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: `pgd-${String(complaints.length + 1).padStart(3, "0")}`,
      adminResponse: [],
      createdAt: new Date().toISOString(),
      handledAt: undefined,
    };

    persistComplaints([...complaints, newComplaint]);
  };

  const updateComplaintStatus = (complaintId: string, status: ComplaintStatus) => {
    const now = new Date().toISOString();
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? {
            ...complaint,
            status,
            handledAt: status === "Selesai Ditangani" || status === "Ditolak" ? now : undefined,
          }
        : complaint
    );
    persistComplaints(updatedComplaints);
  };

  const addResponse = (complaintId: string, response: Omit<AdminResponse, "id" | "createdAt">) => {
    const now = new Date().toISOString();
    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id !== complaintId) return complaint;

      const newResponse: AdminResponse = {
        ...response,
        id: `resp-${Date.now()}`,
        createdAt: now,
      };

      return {
        ...complaint,
        adminResponse: [...complaint.adminResponse, newResponse],
        handledAt: complaint.handledAt || now,
      };
    });
    persistComplaints(updatedComplaints);
  };

  const getComplaintById = (id: string): Complaint | undefined => complaints.find((c) => c.id === id);
  const getUserComplaints = (): Complaint[] => (user ? complaints.filter((c) => c.userId === user.id) : []);
  const getAllComplaints = (): Complaint[] => complaints;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        complaints,
        addComplaint,
        updateComplaintStatus,
        addResponse,
        getComplaintById,
        getUserComplaints,
        getAllComplaints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
