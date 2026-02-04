-- Create the daily_narratives table for AI summaries
CREATE TABLE IF NOT EXISTS daily_narratives (
    date DATE PRIMARY KEY,
    summary TEXT NOT NULL,
    advice TEXT,
    encouragement TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the daily_metrics table for structured data
CREATE TABLE IF NOT EXISTS daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE REFERENCES daily_narratives(date) ON DELETE CASCADE,
    total_screen_time INTEGER, -- minutes
    tasks_planned INTEGER,
    tasks_completed INTEGER,
    app_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the raw_sources table for full-text search materials
CREATE TABLE IF NOT EXISTS raw_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE REFERENCES daily_narratives(date) ON DELETE CASCADE,
    source_type TEXT, -- 'screenshot' or 'text'
    raw_content TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Simplified for MVP
ALTER TABLE daily_narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_sources ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all actions for simplicity in MVP (In production, restrict to authenticated users)
CREATE POLICY "Allow all access" ON daily_narratives FOR ALL USING (true);
CREATE POLICY "Allow all access" ON daily_metrics FOR ALL USING (true);
CREATE POLICY "Allow all access" ON raw_sources FOR ALL USING (true);
