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

// Local SVGs mapped cleanly to real Supabase image storage paths
const LOCAL_SVG_MAP: Record<string, string> = {
  'warning_curve_right': 'signs/warning/100_1 Skarp sving til høyre.jpg',
  'no_entry': 'signs/prohibition/302_0.jpg',
  'no_overtaking': 'signs/prohibition/334_0.jpg',
  'mandatory_right': 'signs/mandatory/402_1.jpg',
  'priority_road': 'signs/priority/206_0.jpg',
  'priority_oncoming': 'signs/priority/214_0.jpg',
  'pedestrian_crossing': 'signs/warning/140_0.jpg',
  'no_stopping': 'signs/prohibition/370_0.jpg',
  'yield': 'signs/priority/202_0.jpg',
  'speed_50': 'signs/prohibition/362_50.jpg',
  'intersection': 'signs/warning/124_0.jpg',
  'unregulated_intersection': 'signs/warning/124_0.jpg',
  'roundabout_situation': 'signs/warning/126_0.jpg',
  'lane_positioning': 'signs/information/530_01.jpg',
  'fog_lights': 'signs/warning/132_0.jpg'
};

import assetMatchesRaw from '../scripts/asset_matches.json';

interface AssetMatch {
  categoryId: string;
  qTextSnippet: string;
  currentImage: string | null;
  proposedAssetCode: string | null;
  proposedAssetPath: string | null;
  proposedAssetName: string | null;
  confidence: string;
  score: number;
}

const assetMatches = assetMatchesRaw as AssetMatch[];
const textMatchMap = new Map<string, string>();

assetMatches.forEach((m) => {
  if (m.proposedAssetPath && (m.confidence === 'high' || m.confidence === 'medium')) {
    // Index by category & lowercase start of the question text
    const key = `${m.categoryId}:${m.qTextSnippet.trim().toLowerCase().substring(0, 30)}`;
    textMatchMap.set(key, m.proposedAssetPath);
  }
});

/**
 * Resolves any image (local, placeholder, or missing)
 */
export function resolveQuestionImage(categoryId: string, questionText: string, currentImage: string | null): string | null {
  if (currentImage && !currentImage.includes('placehold.co')) {
    // Keep existing valid remote URLs or local SVGs
    return currentImage;
  }

  // Look up via question text matching
  const cleanQ = questionText.trim().toLowerCase().substring(0, 30);
  const key = `${categoryId}:${cleanQ}`;
  
  const matchedPath = textMatchMap.get(key);
  if (matchedPath) {
    // Manually encode to avoid 400 Bad Request
    const encodedPath = matchedPath.split('/').map(part => encodeURIComponent(part)).join('/');
    return getAssetPublicUrl(encodedPath);
  }

  return currentImage || null;
}
