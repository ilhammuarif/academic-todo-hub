# AcademiFlow — Hub Manajemen & Perencana Akademik Mahasiswa

Selamat datang di **AcademiFlow**, sebuah aplikasi perencana akademik komprehensif, aman, dan dirancang khusus untuk memandu perjalanan studi Anda dari **Semester 4 hingga Skripsi & Wisuda** (proyeksi jangka panjang).

## 🚀 Fitur Visioner & Unggulan
1. **Fase Perkuliahan Multi-Semester**: Kelola studi Anda secara dinamis dari Semester 4 sampai 8, serta pasca-kelulusan.
2. **Peta Jalan Skripsi Terintegrasi**: Roadmap kronologis bimbingan skripsi lengkap dengan sub-checklist yang bisa ditracking secara bertahap.
3. **Simulasi Proyeksi IPK (Target GPA Matrix)**: Hitung IPK masa depan berdasarkan bobot SKS dan target nilai mata kuliah Anda sebelum transkrip/KHS rilis.
4. **Timer Fokus Pomodoro Terikat Tugas**: Sesi belajar terarah dengan alarm suara (menggunakan *Web Audio Synth Offline*) yang terhubung langsung dengan tugas pilihan Anda.
5. **Analisis Statistik & Waktu Belajar**: Grafik persentase distribusi beban tugas perkuliahan serta total durasi jam belajar.
6. **Portabilitas & Keamanan Jangka Panjang (Backup/Restore JSON)**: Data bersifat *offline-first* disimpan aman di browser lokal Anda. Ekspor seluruh database ke berkas `.json` dan impor kapan saja agar data tidak akan hilang sampai Anda lulus!

---

## 🛠️ Cara Menjalankan Aplikasi
Anda tidak memerlukan kompilasi rumit (`node_modules`). Cukup jalankan local server bawaan yang ringan:

### Opsi 1: Menggunakan Python (Sangat Mudah)
Jalankan perintah berikut di PowerShell/Command Prompt pada direktori proyek:
```powershell
python -m http.server 8080
```
Lalu buka browser Anda di: `http://localhost:8080`

### Opsi 2: Menggunakan Node.js (npx)
```powershell
npx browser-sync start --server --files "*.html, *.css, *.js"
```
Lalu buka browser Anda di: `http://localhost:3000`

---

## 🧪 Langkah Pengujian Fitur (Test Steps)
Untuk memverifikasi bahwa seluruh fitur berjalan dengan lancar, ikuti tes berikut:

1. **Uji Tambah Tugas Baru**:
   - Klik tombol **Tambah Tugas** di kanan atas.
   - Isi judul tugas, pilih mata kuliah relavan (misal: *Sistem Basis Data Lanjut*), tentukan tanggal tenggat, dan simpan.
   - Verifikasi tugas baru muncul di daftar **Tugas & Todo** dan jumlah tugas aktif bertambah di dashboard.

2. **Uji Simulasi IPK**:
   - Masuk ke tab **Target IPK & Matkul**.
   - Ubah Nilai Riil salah satu mata kuliah yang sedang berjalan dari *Belum Rilis* menjadi *A*.
   - Verifikasi **IPK Proyeksi** di sebelah kiri langsung terhitung ulang secara dinamis.

3. **Uji Timer Pomodoro**:
   - Masuk ke tab **Pomodoro Fokus**.
   - Pilih tugas yang telah dibuat sebelumnya pada opsi *Hubungkan Fokus ke Tugas Aktif*.
   - Klik tombol **Mulai** dan dengarkan bunyi detak/alert saat waktu berjalan atau klik *Lewati* untuk melihat penyimpanan log sesi belajar otomatis di bawahnya.

4. **Uji Ekspor Cadangan (Backup)**:
   - Masuk ke tab **Pengaturan & Backup**.
   - Klik **Ekspor Semua Data (.json)**.
   - Periksa file `AcademiFlow_Backup_*.json` terunduh sempurna di folder Download komputer Anda.
