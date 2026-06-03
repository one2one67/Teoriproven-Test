import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load .env explicitly if needed
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawUrl = (process.env.VITE_SUPABASE_URL || 'https://eyulnlvvtvnjbptlsusr.supabase.co').trim();
const supabaseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
const supabaseKey = (process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dWxubHZ2dHZuamJwdGxzdXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzkwNjcsImV4cCI6MjA5NTMxNTA2N30.Yg6R6Gr3bfxDfkEMAuwimyl9NgCnTvalcT01tvzz8Sw').trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const csvFilePath = path.join(__dirname, '../../teorigo_question_assets_starter_full.csv');
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

  Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      console.log(`Parsed ${results.data.length} rows from CSV`);
      
      const rows = results.data.map((row: any) => ({
        asset_code: row.asset_code,
        file_name: row.file_name,
        storage_path: row.storage_path,
        display_name_no: row.display_name_no,
        category: row.category,
        theme: row.theme,
        subtheme: row.subtheme,
        slug: row.slug,
        needs_review: row.needs_review?.toLowerCase() === 'true',
        alt_text_no: row.alt_text_no || null,
        alt_text_en: row.alt_text_en || null,
        alt_text_pl: row.alt_text_pl || null,
        alt_text_ar: row.alt_text_ar || null,
      }));

      // Insert or update in chunks
      const CHUNK_SIZE = 50;
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        const chunk = rows.slice(i, i + CHUNK_SIZE);
        const { data, error } = await supabase
          .from('question_assets')
          .upsert(chunk, { onConflict: 'asset_code' });

        if (error) {
          console.error(`Error upserting chunk ${i / CHUNK_SIZE}:`, error);
        } else {
          console.log(`Successfully upserted chunk ${i / CHUNK_SIZE}`);
        }
      }
      
      console.log('Import completed.');
    },
    error: (error: any) => {
      console.error('Error parsing CSV:', error);
    }
  });
}

run().catch(console.error);
