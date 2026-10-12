'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, type Message } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Users, LogOut, Loader2 } from 'lucide-react';

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  userId: string;
  username: string;
  userColor: string;
  onLeaveRoom: () => void;
}

export default function ChatRoom({ roomId, roomName, userId, username, userColor, onLeaveRoom }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check and delete room if empty
  const checkAndDeleteEmptyRoom = useCallback(async () => {
    // Small delay to ensure presence is updated
    setTimeout(async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomId);

      // If no messages and no users online, delete the room
      if (count === 0 && onlineUsers === 0) {
        await supabase.from('rooms').delete().eq('id', roomId);
      }
    }, 2000);
  }, [roomId, onlineUsers]);

  const handleLeaveRoom = useCallback(async () => {
    await checkAndDeleteEmptyRoom();
    onLeaveRoom();
  }, [checkAndDeleteEmptyRoom, onLeaveRoom]);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  }, [roomId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMessages();

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    const presenceChannel = supabase.channel(`presence:${roomId}`, {
      config: { presence: { key: userId } },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setOnlineUsers(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: userId,
            username: username,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
      presenceChannel.unsubscribe();
    };
  }, [roomId, userId, username, loadMessages]);


  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const { error } = await supabase.from('messages').insert({
      room_id: roomId,
      user_id: userId,
      username: username,
      message: newMessage.trim(),
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      inputRef.current?.focus();
    }
    setIsSending(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-950">
      {/* Clean Minimalist Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💬</div>
              <div>
                <h1 className="font-semibold text-lg text-zinc-900 dark:text-white">
                  {roomName}
                </h1>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>{onlineUsers} online</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleLeaveRoom}
              variant="outline" 
              size="sm"
              className="text-xs font-medium border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              leave
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area - Clean & Minimalist */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-6 py-6">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-2" />
                <p className="text-zinc-500 text-sm">loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-zinc-500">belum ada chat nih</p>
                <p className="text-zinc-400 text-sm">mulai obrolan yuk!</p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((msg, index) => {
                  const isOwnMessage = msg.user_id === userId;
                  const showAvatar = index === 0 || messages[index - 1].user_id !== msg.user_id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {showAvatar ? (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                          style={{
                            backgroundColor: isOwnMessage
                              ? userColor
                              : `hsl(${msg.username.charCodeAt(0) * 10 % 360}, 65%, 50%)`,
                          }}
                        >
                          {msg.username.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className="w-8" />
                      )}
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%] gap-1`}>
                        {showAvatar && (
                          <div className="flex items-center gap-2 px-2">
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                              {isOwnMessage ? 'kamu' : msg.username}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl ${
                            isOwnMessage
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Input Area - Clean & Minimalist */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="tulis pesan..."
              className="flex-1 h-11 text-sm bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-0 rounded-xl"
              maxLength={500}
              disabled={isSending}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || isSending} 
              size="icon"
              className="h-11 w-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl transition-colors"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-zinc-400">
              as <span className="font-medium text-zinc-600 dark:text-zinc-300">{username}</span>
            </span>
            <span className={`font-medium ${newMessage.length > 450 ? 'text-orange-500' : 'text-zinc-400'}`}>
              {newMessage.length}/500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

