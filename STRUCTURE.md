# Struktur Project - Yapping

## 📁 Struktur Folder

```
yapping/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Homepage - Lobby & Room List
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React Components
│   ├── ChatRoom.tsx        # Chat room component dengan real-time messaging
│   └── ui/                 # shadcn/ui components
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── scroll-area.tsx
├── lib/                     # Utilities & Configuration
│   ├── supabase.ts         # Supabase client & TypeScript interfaces
│   └── utils.ts            # Utility functions (cn, etc.)
├── public/                  # Static assets
├── .env.local              # Environment variables (tidak di-commit)
├── .env.example            # Template environment variables
├── supabase-schema.sql     # Database schema SQL
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Dokumentasi utama
```

## 🔧 File Penting

### `app/page.tsx`
Homepage yang menampilkan:
- Form untuk set username
- Form untuk buat room baru
- List room yang tersedia
- Logic untuk join room
- Validasi Supabase configuration

### `components/ChatRoom.tsx`
Component chat room dengan fitur:
- Real-time messaging menggunakan Supabase Realtime
- Presence tracking untuk online users
- Avatar dengan warna unik per user
- Scroll area untuk messages
- Form untuk send message

### `lib/supabase.ts`
- Supabase client initialization
- TypeScript interfaces untuk Message, Room, dan User
- Type safety untuk seluruh aplikasi

### `supabase-schema.sql`
SQL script untuk membuat:
- Table `rooms` - Menyimpan chat rooms
- Table `messages` - Menyimpan messages
- Indexes untuk performa query
- Row Level Security policies
- Realtime configuration

## 🎨 Styling

- **Tailwind CSS** untuk utility-first styling
- **shadcn/ui** untuk pre-built components
- **Dark mode** support built-in
- **Responsive design** untuk mobile & desktop

## 🔄 State Management

State dikelola menggunakan React hooks:
- `useState` untuk local state
- `useEffect` untuk side effects (subscriptions, data loading)
- `localStorage` untuk persist user data (userId, username, color)

## 🌐 Real-time Features

### Supabase Realtime Channels
1. **Messages Channel**: Subscribe ke INSERT events di table messages
2. **Presence Channel**: Track online users di setiap room

### How it Works
```typescript
// Subscribe to new messages
supabase
  .channel(`room:${roomId}`)
  .on('postgres_changes', { event: 'INSERT', ... }, callback)
  .subscribe()

// Track presence
supabase
  .channel(`presence:${roomId}`)
  .on('presence', { event: 'sync' }, callback)
  .subscribe()
```

## 🔐 Security

- **Anonymous Authentication**: Tidak perlu email/password
- **Row Level Security (RLS)**: Semua users bisa read/write
- **No Personal Data**: Hanya username temporary yang disimpan
- **Client-side UUID**: User ID generated di browser

## 🚀 Development Workflow

1. Install dependencies: `npm install`
2. Setup Supabase project dan run SQL schema
3. Configure `.env.local` dengan credentials
4. Run dev server: `npm run dev`
5. Build untuk production: `npm run build`

## 📦 Dependencies

### Production
- `next` - React framework
- `react` & `react-dom` - UI library
- `@supabase/supabase-js` - Supabase client
- `@base-ui/react` - Base UI components
- `lucide-react` - Icons
- `tailwindcss` - CSS framework

### Development
- `typescript` - Type safety
- `eslint` - Code linting
- `@types/*` - TypeScript definitions

## 🎯 Features Roadmap

Fitur yang bisa ditambahkan:
- [ ] Typing indicators
- [ ] Message reactions (emoji)
- [ ] File/image upload
- [ ] Private messaging
- [ ] Room moderation
- [ ] Message editing & deletion
- [ ] Search messages
- [ ] User profiles & avatars
- [ ] Message notifications
- [ ] Export chat history

## 🐛 Troubleshooting

### Build Error: Invalid Supabase URL
- Pastikan `.env.local` sudah dibuat dan diisi dengan benar
- Restart development server setelah update env variables

### Real-time tidak berfungsi
- Check Supabase Realtime settings di dashboard
- Pastikan table messages sudah ditambahkan ke Realtime publication

### Messages tidak muncul
- Verify database schema sudah dijalankan
- Check browser console untuk errors
- Pastikan RLS policies sudah dibuat dengan benar
