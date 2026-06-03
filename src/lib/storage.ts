import { getSupabase } from './supabase';

const BUCKET_NAME = 'question-images';

/**
 * Returns the public URL for an asset in the question-images bucket.
 * @param storagePath The path of the file in the bucket (e.g., 'signs/direction/701.jpg')
 */
export function getAssetPublicUrl(storagePath: string): string {
  const supabase = getSupabase();
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  return data.publicUrl;
}
