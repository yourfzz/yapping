# Yapping - Feature Documentation

## 🎨 UI Improvements

### Enhanced Chat Interface
- **Gradient Backgrounds**: Beautiful blue-to-purple gradients for modern look
- **Glassmorphism**: Semi-transparent headers and input areas with backdrop blur
- **Message Bubbles**: Improved message design with rounded corners and shadows
- **Avatar Rings**: Colorful avatar rings for better visual hierarchy
- **Smooth Animations**: Fade-in and slide-in animations for new messages

### Message Grouping
Messages from the same user are automatically grouped together:
- Avatar only shows for the first message in a group
- Cleaner, more readable conversation flow
- Similar to WhatsApp/Telegram style

### Auto-Scroll
- Automatically scrolls to the latest message when new messages arrive
- Smooth scrolling animation for better UX
- Maintains scroll position when reading older messages

## 🚪 Leave Room Feature

### How It Works
1. Click the "Leave Room" button in the top-right corner
2. User is immediately returned to the lobby
3. Room list is automatically refreshed
4. If room becomes empty, it will be automatically deleted

### Visual Design
- Red hover effect to indicate destructive action
- Icon + text on desktop, icon only on mobile (responsive)
- Smooth transition back to lobby

## 🗑️ Auto-Delete Empty Rooms

### Client-Side Deletion
When a user leaves a room, the system checks:
- Is there any message in the room?
- Are there any users still online?
- If both are NO, the room is automatically deleted

### Server-Side Cleanup (Optional)
The `supabase-schema.sql` includes a function `delete_empty_rooms()` that can be scheduled to run periodically:
- Deletes rooms with no messages
- Only deletes rooms older than 1 hour
- Can be scheduled as a cron job (commented out by default)

To enable auto-cleanup:
1. Open Supabase Dashboard > Database > Functions
2. Uncomment the cron.schedule section in the SQL
3. The function will run every hour automatically

## 💬 Enhanced Input Area

### Features
- **Character Counter**: Shows current/max characters (500 limit)
- **Loading State**: Spinner animation while sending message
- **Auto-Focus**: Input refocuses after sending for quick replies
- **Disabled State**: Prevents double-sending
- **Username Display**: Shows who you're chatting as

### Styling
- Gradient send button with hover effects
- Better contrast for readability
- Responsive padding and sizing

## 📱 Responsive Design

### Mobile (< 640px)
- Icon-only buttons to save space
- Stacked layout for better touch targets
- Full-width message bubbles (75% max)

### Tablet (640px - 1024px)
- Balanced layout with room for content
- Visible button text
- Optimized spacing

### Desktop (> 1024px)
- Max-width container (5xl) for readability
- Full feature visibility
- Comfortable spacing for mouse interaction

## 🎯 User Experience Improvements

### Visual Feedback
- Loading spinner when fetching messages
- Empty state with icon when no messages
- Hover effects on all interactive elements
- Disabled states for buttons

### Color Coding
- Your messages: Blue gradient
- Other messages: White/Dark theme adaptive
- Each user gets a unique avatar color based on their username
- Consistent color scheme throughout the app

### Typography
- Smaller, refined font sizes for cleaner look
- Better line-height for message readability
- Font weight variations for hierarchy

## 🔧 Technical Implementation

### React Hooks Used
- `useState`: Message state, loading states, input values
- `useEffect`: Auto-scroll, realtime subscriptions
- `useCallback`: Optimized function memoization
- `useRef`: Scroll target, input focus management

### Performance Optimizations
- Message grouping reduces DOM nodes
- Memoized callbacks prevent unnecessary re-renders
- Efficient presence tracking
- Indexed database queries

### Error Handling
- Graceful fallbacks for missing data
- Console error logging for debugging
- User-friendly empty states
- Supabase config validation

## 🚀 Future Enhancements

Potential features to add:
- [ ] Message reactions (emoji)
- [ ] Image/file sharing
- [ ] Typing indicators
- [ ] Message search
- [ ] User mentions
- [ ] Room password protection
- [ ] Message edit/delete
- [ ] Push notifications
- [ ] User blocking
- [ ] Admin moderation tools

## 📊 Database Schema

### Rooms Table
```sql
- id: UUID (primary key)
- name: TEXT (room name)
- created_at: TIMESTAMP (auto-generated)
```

### Messages Table
```sql
- id: UUID (primary key)
- room_id: UUID (foreign key to rooms)
- user_id: TEXT (anonymous user ID)
- username: TEXT (display name)
- message: TEXT (message content)
- created_at: TIMESTAMP (auto-generated)
```

### Indexes
- `messages_room_id_idx`: Fast room message queries
- `messages_created_at_idx`: Efficient time-based sorting

### Real-Time Configuration
- PostgreSQL changes tracked for INSERT events
- Presence channel for online user tracking
- Row Level Security (RLS) enabled with permissive policies
