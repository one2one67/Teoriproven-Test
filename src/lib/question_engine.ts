import { QDATA } from '../data/questions';
import { CategoryId, Language } from '../data/q_base';

export type ReviewStatus = 'draft' | 'review' | 'approved' | 'ready_for_launch' | 'archived';

export interface QuestionReviewMeta {
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  source_verified?: boolean;
  language_verified?: boolean;
  visual_verified?: boolean;
}

export interface UniversalQuestion {
  gi: number;          // Global index / Original array index
  _no_t?: string;      // Fallback topic name for matching categories cleanly
  
  t: string;           // Topic string
  q: string;           // Question statement
  o: string[];         // Answer options
  c: number;           // Correct option index (0-based)
  e: string;           // Explanation text
  
  // Rich Context (Phase 5 Additions)
  difficulty?: 'easy' | 'medium' | 'hard';
  sourceTitle?: string;
  sourceUrl?: string;
  legalReference?: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;

  // Content Review Status (Phase 13 Additions)
  status?: ReviewStatus;
  reviewMeta?: QuestionReviewMeta;
}

export function getQuestionsForCategory(catId: CategoryId, lang: Language): UniversalQuestion[] {
  if (!QDATA[catId] || !QDATA[catId].q) return [];
  
  return QDATA[catId].q.map((qObj: any, index: number) => {
    // Distinguish between Old QDATA Localized format and New Rich Schema
    
    const localizedData = qObj[lang] || qObj['no'];
    
    if (localizedData && typeof localizedData.q === 'string') {
      // Old Schema (Mapped per language directly)
      const fallbackNo = qObj['no'] || {};
      return {
        gi: index,
        _no_t: fallbackNo.t,
        t: localizedData.t || fallbackNo.t || 'Unknown Topic',
        q: localizedData.q || '',
        o: localizedData.o || [],
        c: localizedData.c !== undefined ? localizedData.c : -1,
        e: localizedData.e || '',
        
        // Pick up any outer metadata if provided
        difficulty: qObj.difficulty || localizedData.difficulty,
        sourceTitle: qObj.sourceTitle || localizedData.sourceTitle,
        sourceUrl: qObj.sourceUrl || localizedData.sourceUrl,
        legalReference: qObj.legalReference || localizedData.legalReference,
        tags: qObj.tags || localizedData.tags,
        image: qObj.image || localizedData.image,
        imageAlt: qObj.imageAlt || localizedData.imageAlt,
        status: qObj.status || localizedData.status || 'draft',
        reviewMeta: qObj.reviewMeta || localizedData.reviewMeta
      };
    } else {
      // New Schema (If we want a flat schema like { t: '...', q: '...', ...})
      // Allows embedding full single-language mock data easily.
      return {
        gi: index,
        _no_t: qObj.topicId || qObj.t,
        t: qObj.t || '',
        q: qObj.q || '',
        o: qObj.o || [],
        c: qObj.c !== undefined ? qObj.c : -1,
        e: qObj.e || '',
        ...qObj
      } as UniversalQuestion;
    }
  });
}
