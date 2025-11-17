-- Add type column to items table
ALTER TABLE items
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'trade';

-- Add comment for documentation
COMMENT ON COLUMN items.type IS 'Type of item: trade or donation';
