import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  phone?: string;
  address?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  status: "pending" | "diproses" | "selesai";
  responseStatus: "belum" | "sudah";
  responses: Response[];
  createdAt: string;
  updatedAt: string;
}

export interface Response {
  id: string;
  complaintId: string;
  adminId: string;
  adminName: string;
  message: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "responses" | "responseStatus">) => void;
  updateComplaintStatus: (complaintId: string, status: "pending" | "diproses" | "selesai") => void;
  addResponse: (complaintId: string, response: Omit<Response, "id" | "createdAt">) => void;
  getComplaintById: (id: string) => Complaint | undefined;
  getUserComplaints: () => Complaint[];
  getAllComplaints: () => Complaint[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts
const DEMO_ACCOUNTS = [
  {
    id: "user-001",
    email: "admin@mail.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
    phone: "+62812345678",
    address: "Jakarta, Indonesia",
  },
  {
    id: "user-002",
    email: "user@mail.com",
    password: "user123",
    name: "John Doe",
    role: "user" as const,
    phone: "+62821234567",
    address: "Bandung, Indonesia",
  },
];

// Demo complaints
const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "pgd-001",
    userId: "user-002",
    title: "Jalan Rusak di Jl. Sudirman",
    category: "Infrastruktur",
    description: "Jalan berlubang besar yang menggangu perjalanan kendaraan",
    status: "diproses",
    responseStatus: "belum",
    responses: [],
    createdAt: "2026-05-10T10:30:00",
    updatedAt: "2026-05-12T14:20:00",
  },
  {
    id: "pgd-002",
    userId: "user-002",
    title: "Lampu Jalan Mati",
    category: "Infrastruktur",
    description: "Beberapa lampu jalan di Jl. Ahmad Yani sudah mati selama 2 bulan",
    status: "pending",
    responseStatus: "sudah",
    responses: [
      {
        id: "resp-001",
        complaintId: "pgd-002",
        adminId: "user-001",
        adminName: "Admin User",
        message: "Terima kasih atas laporan Anda. Tim kami sudah mencatat masalah ini dan akan segera membeerbaiki lampu jalan yang rusak. Kami akan memberikan update lebih lanjut dalam 1 minggu.",
        createdAt: "2026-05-12T11:15:00",
      },
    ],
    createdAt: "2026-05-08T09:00:00",
    updatedAt: "2026-05-12T11:15:00",
  },
  {
    id: "pgd-003",
    userId: "user-002",
    title: "Pelayanan Lambat di Kantor Kelurahan",
    category: "Pelayanan",
    description: "Waktu pelayanan di kantor kelurahan sangat lama, menunggu lebih dari 2 jam",
    status: "selesai",
    responseStatus: "sudah",
    responses: [
      {
        id: "resp-002",
        complaintId: "pgd-003",
        adminId: "user-001",
        adminName: "Admin User",
        message: "Masalah ini sudah kami tangani. Kami telah memberikan pelatihan tambahan kepada staff dan menambah jam operasional. Pelayanan seharusnya lebih cepat sekarang.",
        createdAt: "2026-05-11T16:45:00",
      },
    ],
    createdAt: "2026-05-05T14:30:00",
    updatedAt: "2026-05-11T16:45:00",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedComplaints = localStorage.getItem("complaints");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints));
    } else {
      setComplaints(INITIAL_COMPLAINTS);
      localStorage.setItem("complaints", JSON.stringify(INITIAL_COMPLAINTS));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (account) {
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
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const addComplaint = (
    complaint: Omit<
      Complaint,
      "id" | "createdAt" | "updatedAt" | "responses" | "responseStatus"
    >
  ) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: `pgd-${String(complaints.length + 1).padStart(3, "0")}`,
      responses: [],
      responseStatus: "belum",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedComplaints = [...complaints, newComplaint];
    setComplaints(updatedComplaints);
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
  };

  const updateComplaintStatus = (
    complaintId: string,
    status: "pending" | "diproses" | "selesai"
  ) => {
    const updatedComplaints = complaints.map((c) =>
      c.id === complaintId ? { ...c, status, updatedAt: new Date().toISOString() } : c
    );
    setComplaints(updatedComplaints);
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
  };

  const addResponse = (
    complaintId: string,
    response: Omit<Response, "id" | "createdAt">
  ) => {
    const updatedComplaints = complaints.map((c) => {
      if (c.id === complaintId) {
        const newResponse: Response = {
          ...response,
          id: `resp-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        return {
          ...c,
          responses: [...c.responses, newResponse],
          responseStatus: "sudah",
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    setComplaints(updatedComplaints);
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
  };

  const getComplaintById = (id: string): Complaint | undefined => {
    return complaints.find((c) => c.id === id);
  };

  const getUserComplaints = (): Complaint[] => {
    if (!user) return [];
    return complaints.filter((c) => c.userId === user.id);
  };

  const getAllComplaints = (): Complaint[] => {
    return complaints;
  };

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
