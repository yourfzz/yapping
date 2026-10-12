# Yapping - Platform Anonymous Chat

Platform chat anonymous real-time menggunakan Next.js, shadcn/ui, dan Supabase.

## 🚀 Fitur

- ✅ Chat real-time menggunakan Supabase Realtime
- ✅ Anonymous chat tanpa registrasi
- ✅ Buat room chat baru
- ✅ Join room yang sudah ada
- ✅ Tracking user online dengan Presence
- ✅ **Leave room dengan satu klik**
- ✅ **Auto-delete room kosong**
- ✅ **Improved UI dengan gradients & animations**
- ✅ **Message grouping untuk UX lebih baik**
- ✅ **Auto-scroll ke pesan terbaru**
- ✅ **Character counter (500 karakter max)**
- ✅ UI modern dengan shadcn/ui
- ✅ Dark mode support
- ✅ Responsive design

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Supabase** - Backend dan real-time database
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Lucide Icons** - Modern icons

## 📋 Setup Instructions

### 1. Clone dan Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Buka SQL Editor dan jalankan script dari file `supabase-schema.sql`
3. Copy URL dan Anon Key dari Settings > API

### 3. Configure Environment Variables

Edit file `.env.local` dan isi dengan credentials Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📊 Database Schema

### Table: rooms
- `id` (UUID) - Primary key
- `name` (TEXT) - Nama room
- `created_at` (TIMESTAMP) - Waktu dibuat

### Table: messages
- `id` (UUID) - Primary key
- `room_id` (UUID) - Foreign key ke rooms
- `user_id` (TEXT) - Anonymous user ID
- `username` (TEXT) - Username
- `message` (TEXT) - Isi pesan
- `created_at` (TIMESTAMP) - Waktu dikirim

## 🎯 Cara Penggunaan

1. **Set Username**: Masukkan username yang ingin digunakan
2. **Buat Room Baru**: Isi nama room dan klik "Buat Room"
3. **Atau Join Room**: Pilih room yang tersedia dan klik "Join"
4. **Mulai Chat**: Ketik pesan dan tekan Enter atau klik tombol Send

## 🔐 Keamanan

- Semua data disimpan di Supabase dengan Row Level Security (RLS)
- Anonymous user ID di-generate secara random
- Tidak ada data pribadi yang tersimpan

## 📝 Catatan

- User ID dan warna avatar tersimpan di localStorage
- Username bisa diubah setiap saat
- Messages akan tersimpan di database

## 🚀 Deployment

Deploy ke Vercel dengan mudah:

```bash
npm run build
```

Atau klik tombol di bawah:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/yapping)

Jangan lupa tambahkan environment variables di Vercel dashboard.

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

