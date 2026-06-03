-- Create question_assets table
CREATE TABLE IF NOT EXISTS public.question_assets (
    id SERIAL PRIMARY KEY,
    asset_code TEXT UNIQUE NOT NULL,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    display_name_no TEXT,
    category TEXT,
    theme TEXT,
    subtheme TEXT,
    slug TEXT,
    needs_review BOOLEAN DEFAULT false,
    alt_text_no TEXT,
    alt_text_en TEXT,
    alt_text_pl TEXT,
    alt_text_ar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: The bucket should be created manually or via another script if it doesn't exist,
-- using the name 'question-images' as requested.

-- Enable RLS
ALTER TABLE public.question_assets ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Enable read access for all users"
    ON public.question_assets FOR SELECT
    USING (true);

-- Allow admins/authenticated users to insert/update/delete
CREATE POLICY "Enable update for all authenticated users"
    ON public.question_assets FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all authenticated users"
    ON public.question_assets FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable delete for all authenticated users"
    ON public.question_assets FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create indexes for search and filtering
CREATE INDEX IF NOT EXISTS idx_question_assets_category ON public.question_assets(category);
CREATE INDEX IF NOT EXISTS idx_question_assets_theme ON public.question_assets(theme);
CREATE INDEX IF NOT EXISTS idx_question_assets_subtheme ON public.question_assets(subtheme);
CREATE INDEX IF NOT EXISTS idx_question_assets_slug ON public.question_assets(slug);
CREATE INDEX IF NOT EXISTS idx_question_assets_asset_code ON public.question_assets(asset_code);
