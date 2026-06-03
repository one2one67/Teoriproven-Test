import { getSupabase } from './supabase';
import { getAssetPublicUrl } from './storage';

export interface QuestionAsset {
  id: number;
  asset_code: string;
  file_name: string;
  storage_path: string;
  display_name_no: string | null;
  category: string | null;
  theme: string | null;
  subtheme: string | null;
  slug: string | null;
  needs_review: boolean;
  alt_text_no: string | null;
  alt_text_en: string | null;
  alt_text_pl: string | null;
  alt_text_ar: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetFilter {
  category?: string;
  theme?: string;
  subtheme?: string;
  slug?: string;
  search_query?: string;
}

/**
 * Search and filter assets from the Supabase question_assets table.
 */
export async function getAssets(filter?: AssetFilter): Promise<QuestionAsset[]> {
  const supabase = getSupabase();
  let query = supabase.from('question_assets').select('*');

  if (filter) {
    if (filter.category) {
      query = query.eq('category', filter.category);
    }
    if (filter.theme) {
      query = query.eq('theme', filter.theme);
    }
    if (filter.subtheme) {
      query = query.eq('subtheme', filter.subtheme);
    }
    if (filter.slug) {
      query = query.eq('slug', filter.slug);
    }
    if (filter.search_query) {
      // Partial match on display_name or asset_code using ilike
      query = query.or(`display_name_no.ilike.%${filter.search_query}%,asset_code.ilike.%${filter.search_query}%`);
    }
  }

  // Order by display name
  query = query.order('display_name_no', { ascending: true });

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching assets:', error);
    return [];
  }

  return data as QuestionAsset[];
}

/**
 * Fast lookup to get a single asset by its exact code.
 */
export async function getAssetByCode(assetCode: string): Promise<QuestionAsset | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('question_assets')
    .select('*')
    .eq('asset_code', assetCode)
    .single();
    
  if (error) {
    console.error(`Error fetching asset ${assetCode}:`, error);
    return null;
  }
  
  return data as QuestionAsset;
}

/**
 * Returns a fully resolved URL ready to be used in an <img> tag securely
 */
export function getImageUrlForAsset(asset: QuestionAsset): string {
  return getAssetPublicUrl(asset.storage_path);
}
