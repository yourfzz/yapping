'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, type Room } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, LogIn, Users, AlertCircle } from 'lucide-react';
import ChatRoom from '@/components/ChatRoom';

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [userId, setUserId] = useState('');
  const [userColor, setUserColor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasSupabaseConfig, setHasSupabaseConfig] = useState(true);

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading rooms:', error);
    } else {
      setRooms(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasSupabaseConfig(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedUserColor = localStorage.getItem('userColor');

    if (storedUserId && storedUsername && storedUserColor) {
      setUserId(storedUserId);
      setUsername(storedUsername);
      setUserColor(storedUserColor);
    } else {
      const newUserId = `user_${Math.random().toString(36).substring(2, 15)}`;
      const newUserColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
      setUserId(newUserId);
      setUserColor(newUserColor);
      localStorage.setItem('userId', newUserId);
      localStorage.setItem('userColor', newUserColor);
    }

    loadRooms();
  }, [loadRooms]);


  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !username.trim()) return;

    const { data, error } = await supabase
      .from('rooms')
      .insert({ name: newRoomName.trim() })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
    } else if (data) {
      localStorage.setItem('username', username.trim());
      setSelectedRoom(data);
    }
  };

  const joinRoom = (room: Room) => {
    if (!username.trim()) {
      alert('Silakan masukkan username terlebih dahulu!');
      return;
    }
    localStorage.setItem('username', username.trim());
    setSelectedRoom(room);
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    loadRooms(); // Refresh room list
  };

  if (selectedRoom && userId && username) {
    return (
      <ChatRoom
        roomId={selectedRoom.id}
        roomName={selectedRoom.name}
        userId={userId}
        username={username}
        userColor={userColor}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  if (!hasSupabaseConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 flex items-center justify-center">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-6 h-6" />
              Konfigurasi Supabase Diperlukan
            </CardTitle>
            <CardDescription>
              Aplikasi memerlukan Supabase untuk berfungsi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Untuk menjalankan aplikasi ini, ikuti langkah-langkah berikut:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Buat project baru di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase</a></li>
              <li>Buka SQL Editor dan jalankan script dari file <code className="bg-slate-100 px-2 py-1 rounded">supabase-schema.sql</code></li>
              <li>Copy URL dan Anon Key dari Settings → API</li>
              <li>Buat file <code className="bg-slate-100 px-2 py-1 rounded">.env.local</code> di root project</li>
              <li>Tambahkan credentials Supabase ke file tersebut</li>
            </ol>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here</div>
            </div>
            <p className="text-sm text-slate-600">Setelah konfigurasi, restart development server.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Clean Header */}
      <div className="text-center mb-16 mt-8">
        <div className="inline-block mb-6">
          <div className="text-6xl mb-2">💬</div>
        </div>
        <h1 className="text-5xl font-bold mb-3 text-zinc-900 dark:text-white tracking-tight">
          yapping
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-light">
          chat bebas, no drama, just vibes ✨
        </p>
      </div>

      {/* Username Input - Prominent */}
      <div className="mb-8">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            siapa nama lo?
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ketik username lo..."
            maxLength={20}
            className="h-12 text-base bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-0 rounded-xl"
          />
        </div>
      </div>

      {/* Create Room Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">buat room baru</h2>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <form onSubmit={createRoom} className="space-y-4">
            <div>
              <Input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="nama room (e.g. random ngobrol)"
                maxLength={50}
                required
                className="h-12 text-base bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-0 rounded-xl"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl transition-colors" 
              disabled={!username.trim() || !newRoomName.trim()}
            >
              buat room
            </Button>
          </form>
        </div>
      </div>

      {/* Available Rooms */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">room aktif</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-zinc-500 text-sm">loading...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
            <div className="text-4xl mb-3">😴</div>
            <p className="text-zinc-500 mb-1">belum ada room nih</p>
            <p className="text-zinc-400 text-sm">bikin room pertama yuk!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-white truncate mb-1">
                      {room.name}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {new Date(room.created_at).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => joinRoom(room)}
                  className="w-full h-10 text-sm font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl transition-colors"
                  disabled={!username.trim()}
                >
                  join room
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


