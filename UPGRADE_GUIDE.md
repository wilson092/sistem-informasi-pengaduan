# Panduan Penggunaan - Sistem Informasi Pengaduan

## 🚀 Cara Menjalankan Project

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build untuk production
pnpm build
```

Aplikasi akan berjalan di `http://localhost:5173` (atau port yang ditampilkan di terminal)

---

## 👤 Akun Demo

Aplikasi sudah dilengkapi dengan 2 akun demo untuk testing:

### 1. Admin
- **Email:** `admin@mail.com`
- **Password:** `admin123`
- **Akses:** Dashboard Admin dengan kontrol penuh

### 2. User
- **Email:** `user@mail.com`
- **Password:** `user123`
- **Akses:** Dashboard User untuk melaporkan pengaduan

---

## 📋 Fitur Utama

### Halaman Login
- Form login dengan validasi email dan password
- Petunjuk akun demo tersedia
- Pesan error jika kredensial salah
- Loading state saat login

### Dashboard Admin
**Akses dengan akun admin**

#### Statistik
- Total Pengaduan
- Total Pending
- Total Selesai
- Total Belum Direspon

#### Grafik
- Area Chart: Tren pengaduan bulanan
- Pie Chart: Distribusi kategori pengaduan

#### Tabel Pengaduan Semua User
- **Kolom:** ID, Nama User, Judul, Kategori, Status, Status Respon, Aksi
- **Fitur:**
  - Ubah status pengaduan (Pending → Diproses → Selesai)
  - Lihat detail pengaduan
  - **Tombol "Balas"** untuk merespon pengaduan

### Dashboard User
**Akses dengan akun user**

#### Statistik
- Total Pengaduan Saya
- Total Pending
- Total Diproses
- Total Selesai

#### Tabel Pengaduan Saya
- **Kolom:** ID, Judul, Kategori, Status, Tanggal, Status Respon, Aksi
- **Fitur:**
  - Lihat detail pengaduan
  - Melihat respon dari admin

#### Tombol "Buat Pengaduan Baru"
- Opens modal form untuk membuat pengaduan baru

### Halaman Pengaduan / Data Pengaduan

#### Untuk Admin
- Melihat **semua pengaduan** dari semua user
- Search dan filter berdasarkan status
- Kolom tambahan: nama user dan status respon

#### Untuk User
- Melihat **pengaduan mereka saja**
- Search dan filter
- Tombol "Buat Pengaduan" tersedia

### Detail Pengaduan

#### Informasi Pengaduan
- Judul lengkap
- Kategori
- Tanggal dibuat
- Deskripsi
- Foto/Gambar (jika ada)

#### Respon dan Balasan
- **Untuk User:** Baca respon dari admin (read-only)
- **Untuk Admin:** Tombol "Balas" untuk menambah respon baru

#### Sidebar
- Info Pelapor
- Status Saat Ini
- Status Respon Admin
- **Untuk Admin:** Tombol "Balas Pengaduan"

### Modal Buat Pengaduan
- **Judul** (required)
- **Kategori** (required): Infrastruktur, Pelayanan, Kebersihan, Keamanan, Lainnya
- **Deskripsi** (required)
- **URL Foto** (optional)

### Modal Balas Pengaduan
- **Untuk Admin Saja**
- Textarea untuk menulis respon
- Balasan langsung ditampilkan ke user
- Status pengaduan berubah menjadi "Sudah Direspon"

### Menu Navigasi
Berbeda sesuai role user:

#### Admin
- Dashboard
- Data Pengaduan
- Data User
- Analytics
- Settings

#### User
- Dashboard Saya
- Pengaduan Saya
- Settings

---

## 💾 Penyimpanan Data

- Semua data disimpan di **localStorage** browser
- Data **otomatis tersimpan** setiap kali ada perubahan
- Data **persisten** bahkan setelah menutup browser
- Data dapat dilihat di DevTools → Application → Local Storage

### Key yang Disimpan:
- `auth_user` - Data user yang login
- `complaints` - Semua pengaduan dan respon

---

## 🔄 Workflow Lengkap

### Dari Perspektif User:
1. **Login** dengan akun user
2. **Lihat Dashboard** dengan statistik pengaduan Anda
3. **Buat Pengaduan Baru** dengan isi judul, kategori, deskripsi
4. **Lihat Pengaduan Saya** di tabel
5. **Klik Detail** untuk melihat pengaduan lengkap
6. **Tunggu Respon** dari admin
7. **Lihat Respon Admin** di section "Respon dan Balasan"

### Dari Perspektif Admin:
1. **Login** dengan akun admin
2. **Lihat Dashboard** dengan statistik semua pengaduan
3. **Lihat Grafik Tren** dan kategori
4. **Lihat Tabel Semua Pengaduan** dari semua user
5. **Ubah Status** pengaduan langsung dari tabel atau detail
6. **Klik Balas** untuk memberi respon ke user
7. **Tulis Balasan** di modal
8. **Submit** respon (langsung tersimpan dan dilihat user)

---

## 🎨 Warna dan Style

- **Primary Color:** Blue (#2563EB)
- **Accent Colors:**
  - Green: Status Selesai/Sudah Direspon
  - Yellow: Status Pending
  - Orange: Status Diproses/Belum Direspon
  - Red: Error/Warning

---

## 🔐 Catatan Keamanan

- **Demo Only:** Sistem ini menggunakan demo data, bukan database real
- **Credentials:** Jangan gunakan password sama di production
- **localStorage:** Data tersimpan di browser, visible jika developer tools dibuka
- **Session:** Session hilang jika clear browser data atau logout

---

## 📝 Fitur yang Dapat Dikembangkan Ke Depan

1. ✅ Backend API Integration
2. ✅ Database (PostgreSQL, MongoDB, etc.)
3. ✅ Real Authentication & JWT
4. ✅ Image Upload (bukan URL)
5. ✅ Email Notifications
6. ✅ Real-time Chat/Comments
7. ✅ Export Report (PDF/Excel)
8. ✅ Map Integration
9. ✅ Mobile App
10. ✅ Advanced Analytics

---

## 🐛 Troubleshooting

### Data Tidak Tersimpan
- Check jika localStorage enabled di browser
- Cek di DevTools → Application → Local Storage

### Tidak Bisa Login
- Pastikan email dan password sesuai dengan akun demo
- Check console untuk error message

### Gambar Tidak Muncul
- Gunakan URL gambar yang valid dan accessible
- Format: `https://example.com/image.jpg`

### Style Tidak Muncul
- Pastikan Tailwind CSS sudah di-generate
- Run `pnpm build` untuk build

---

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository atau hubungi tim development.

---

**Version:** 1.0.0  
**Last Updated:** 2026-05-15  
**Framework:** React + Vite + Tailwind CSS
