# Deployment Guide - Yapping

Panduan deploy Yapping ke production menggunakan Vercel.

## 🚀 Deploy ke Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push ke GitHub (5 menit)

1. **Initialize Git** (jika belum):
```bash
git init
git add .
git commit -m "Initial commit: Yapping anonymous chat platform"
```

2. **Create GitHub Repository**:
   - Buka [github.com](https://github.com) dan login
   - Klik tombol "+" → "New repository"
   - Nama repository: `yapping`
   - Pilih "Public" atau "Private"
   - Jangan centang "Initialize with README" (sudah ada)
   - Klik "Create repository"

3. **Push code ke GitHub**:
```bash
git remote add origin https://github.com/yourusername/yapping.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy di Vercel (3 menit)

1. **Login ke Vercel**:
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub account
   - Klik "Add New" → "Project"

2. **Import Repository**:
   - Pilih repository `yapping` dari list
   - Klik "Import"

3. **Configure Project**:
   - Framework Preset: Next.js (otomatis terdeteksi)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables**:
   - Klik "Environment Variables"
   - Tambahkan 2 variables:
   
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project.supabase.co
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   
   - Copy dari file `.env.local` atau Supabase dashboard

5. **Deploy**:
   - Klik "Deploy"
   - Tunggu ~2-3 menit untuk build selesai
   - Aplikasi akan live di: `https://yapping-xxx.vercel.app`

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## ⚙️ Post-Deployment Configuration

### 1. Update Supabase Settings (IMPORTANT!)

1. Buka Supabase Dashboard → Settings → API
2. Tambahkan production URL ke "Site URL": `https://yapping-xxx.vercel.app`
3. Save changes

### 2. Test Production Deployment

1. Buka URL production
2. Test create room dan send messages
3. Test dengan multiple browsers/devices

## 🔄 Continuous Deployment

Setiap push ke GitHub akan otomatis deploy:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

## 🌍 Production Checklist

- [ ] Test semua fitur di production
- [ ] Setup custom domain (jika ada)
- [ ] Test di berbagai devices & browsers
- [ ] Monitor Supabase usage

## 📊 Monitoring

### Vercel Analytics
- Dashboard → Project Settings → Analytics
- Monitor page views, visitors, geographic data

### Supabase Monitoring
- Dashboard → Database → Usage
- Monitor database size, requests, connections

## 🔧 Troubleshooting

### Build Failed
- Check build logs di Vercel
- Fix TypeScript errors locally
- Verify environment variables

### Real-time Not Working
- Add production URL ke Supabase allowed origins
- Redeploy aplikasi

## 💰 Cost Estimation

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments

**Supabase Free Tier:**
- 500 MB database
- 2 GB bandwidth
- Realtime connections

**Upgrade when needed:**
- Supabase Pro: $25/month for more resources

## 🎉 You're Live!

Aplikasi sekarang live dan dapat diakses public! Share URL dengan teman-teman.

---

Happy Deploying! 🚀

