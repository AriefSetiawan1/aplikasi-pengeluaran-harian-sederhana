# Aplikasi Pencatat Pengeluaran Harian

Proyek "Aplikasi Pencatat Pengeluaran Harian" telah diimplementasikan.

## Persyaratan yang Diselesaikan

1. **Aplikasi Web dengan 3+ Endpoint**: Aplikasi ini memiliki backend API berbasis REST dengan endpoint untuk mendapatkan, menambah, dan menghapus pengeluaran, serta antarmuka web (frontend) untuk berinteraksi dengannya.
2. **Framework Web**: Menggunakan **Express.js** pada Node.js.
3. **Layanan Add-on (Database)**: Mengintegrasikan **SQLite** sebagai database untuk menyimpan data pengeluaran secara persisten.
4. **Health Check**: Terdapat endpoint `GET /health` yang digunakan frontend untuk menampilkan indikator status (lampu hijau) bahwa API sedang berjalan.
5. **Environment Variables**: Konfigurasi seperti port dan lokasi database menggunakan file `.env` (dengan `.env.example` sebagai template) melalui library `dotenv`.

## Struktur Endpoint

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/health` | Memeriksa status server (Health Check) |
| `GET` | `/api/expenses` | Mengambil seluruh daftar pengeluaran terbaru |
| `POST` | `/api/expenses` | Menambah data pengeluaran baru |
| `DELETE` | `/api/expenses/:id` | Menghapus pengeluaran berdasarkan ID |

## Cara Menjalankan Aplikasi Secara Lokal

```bash
npm install
node server.js
```
Aplikasi akan dapat diakses di `http://localhost:3000`.
