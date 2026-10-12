# Quick Start Guide - Yapping

Panduan cepat untuk menjalankan Yapping di local machine Anda.

## ⚡ Quick Setup (5 Menit)

### Step 1: Setup Supabase (2 menit)

1. Buka [supabase.com](https://supabase.com) dan buat account (gratis)
2. Klik "New Project"
3. Isi detail project:
   - Name: `yapping` (atau nama lain)
   - Database Password: Generate strong password
   - Region: Pilih yang terdekat dengan lokasi Anda
4. Tunggu project selesai dibuat (~2 menit)

### Step 2: Setup Database (1 menit)

1. Di Supabase Dashboard, klik "SQL Editor" di sidebar kiri
2. Klik "New Query"
3. Copy seluruh isi file `supabase-schema.sql` dari project
4. Paste ke SQL Editor
5. Klik "Run" atau tekan `Ctrl+Enter`
6. Tunggu sampai muncul "Success. No rows returned"

### Step 3: Get API Credentials (30 detik)

1. Klik icon ⚙️ (Settings) di sidebar
2. Klik "API" di menu Settings
3. Copy dua values ini:
   - **Project URL** (contoh: `https://abcdefghijk.supabase.co`)
   - **anon public** key (string panjang yang dimulai dengan `eyJ...`)

### Step 4: Configure Project (1 menit)

1. Buka project `yapping` di code editor
2. Buat file baru `.env.local` di root folder
3. Paste kode ini dan ganti dengan credentials Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Save file

### Step 5: Run Application (30 detik)

```bash
# Install dependencies (pertama kali saja)
npm install

# Jalankan development server
npm run dev
```

5. Buka browser dan akses: `http://localhost:3000`

## ✅ Testing

### Test 1: Create Room
1. Masukkan username: `TestUser`
2. Masukkan nama room: `Test Room`
3. Klik "Buat Room"
4. Anda akan masuk ke chat room

### Test 2: Send Message
1. Ketik "Hello World!" di message box
2. Tekan Enter atau klik tombol Send
3. Message akan muncul di chat area

### Test 3: Multiple Users (Buka 2 Browser)
1. Buka browser lain atau incognito window
2. Akses `http://localhost:3000`
3. Set username berbeda: `TestUser2`
4. Join room yang sama
5. Kirim message dari browser pertama
6. Message akan muncul real-time di browser kedua!

## 🎉 Success!

Jika semua test berhasil, berarti aplikasi sudah berjalan dengan baik!

## 🔍 Verifikasi Database

Untuk memastikan data tersimpan dengan benar:

1. Buka Supabase Dashboard
2. Klik "Table Editor" di sidebar
3. Klik table `rooms` - Anda akan melihat room yang dibuat
4. Klik table `messages` - Anda akan melihat messages yang dikirim

## 🚨 Common Issues

### Issue: "Konfigurasi Supabase Diperlukan" muncul

**Solution:**
- Check apakah file `.env.local` ada di root folder
- Pastikan tidak ada typo di nama environment variables
- Restart development server dengan `Ctrl+C` lalu `npm run dev` lagi

### Issue: Messages tidak muncul real-time

**Solution:**
1. Buka Supabase Dashboard → Database → Replication
2. Pastikan table `messages` ada di list
3. Toggle ON untuk table tersebut
4. Refresh aplikasi

### Issue: Build error saat npm run build

**Solution:**
- Pastikan semua dependencies terinstall: `npm install`
- Check TypeScript errors: `npm run lint`
- Hapus folder `.next` dan build ulang

### Issue: Cannot find module errors

**Solution:**
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobile Testing

Untuk test di mobile device dalam local network:

1. Cari IP address komputer Anda:
   - Windows: `ipconfig` (cari IPv4 Address)
   - Mac/Linux: `ifconfig` (cari inet)

2. Di mobile browser, akses:
   ```
   http://[your-ip]:3000
   ```
   Contoh: `http://192.168.1.100:3000`

3. Pastikan mobile dan komputer dalam network WiFi yang sama

## 🚀 Next Steps

- Deploy ke production: Lihat README.md
- Customize UI: Edit components di folder `components/`
- Add features: Check STRUCTURE.md untuk architecture
- Contribute: Fork repo dan submit PR!

## 💬 Need Help?

- Check STRUCTURE.md untuk detail teknis
- Baca dokumentasi Supabase: [supabase.com/docs](https://supabase.com/docs)
- Baca dokumentasi Next.js: [nextjs.org/docs](https://nextjs.org/docs)

---

Happy Chatting! 🎊
