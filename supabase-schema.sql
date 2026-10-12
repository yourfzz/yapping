-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS messages_room_id_idx ON messages(room_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms (allow all operations for anonymous users)
CREATE POLICY "Allow all operations on rooms" ON rooms
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for messages (allow all operations for anonymous users)
CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Function to auto-delete empty rooms (optional - can be run as cron job)
-- This function deletes rooms that have no messages and were created more than 1 hour ago
CREATE OR REPLACE FUNCTION delete_empty_rooms()
RETURNS void AS $$
BEGIN
  DELETE FROM rooms
  WHERE id NOT IN (
    SELECT DISTINCT room_id FROM messages
  )
  AND created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run every hour
-- Uncomment the following lines if you want automatic cleanup
-- SELECT cron.schedule(
--   'delete-empty-rooms',
--   '0 * * * *', -- Run every hour
--   'SELECT delete_empty_rooms();'
-- );

