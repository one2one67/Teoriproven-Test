import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

// Use tsx to execute this: npx tsx src/scripts/match_assets.ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import all questions from the data files
// We dynamically import so that TSX transpiles it on the fly
import { QDATA } from '../data/questions';

async function run() {
  const csvFilePath = path.join(__dirname, '../../teorigo_question_assets_starter_full.csv');
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

  // Parse assets
  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
  const assets = parsed.data as any[];
  
  const matches = [];

  for (const [categoryId, catData] of Object.entries(QDATA)) {
    const questions = catData.q as any[];
    questions.forEach((q) => {
      // Look for clues in imageAlt, image path, or question text
      const searchTarget = `
        ${q.imageAlt || ''}
        ${q.image || ''}
        ${q.no?.q || ''}
        ${q.no?.e || ''}
      `.toLowerCase();

      // Simple scoring mechanism 
      let bestMatch = null;
      let highestScore = 0;

      for (const asset of assets) {
        if (!asset.display_name_no) continue;
        const assetName = asset.display_name_no.toLowerCase();
        
        let score = 0;
        
        if (q.imageAlt && q.imageAlt.toLowerCase().includes(assetName)) score += 50;
        if (q.no?.q && q.no.q.toLowerCase().includes(assetName)) score += 30;
        if (q.no?.e && q.no.e.toLowerCase().includes(assetName)) score += 20;

        // E.g. /images/signs/yield.svg vs Vikeplikt 
        if (assetName === 'vikeplikt' && searchTarget.includes('yield')) score += 40;
        if (assetName === 'forkjørsveg' && searchTarget.includes('priority_road')) score += 40;

        if (score > highestScore) {
          highestScore = score;
          bestMatch = asset;
        }
      }

      if (bestMatch && highestScore >= 30) {
        matches.push({
          categoryId,
          qTextSnippet: q.no?.q.substring(0, 50),
          currentImage: q.image || null,
          currentAlt: q.imageAlt || null,
          proposedAssetCode: bestMatch.asset_code,
          proposedAssetPath: bestMatch.storage_path,
          proposedAssetName: bestMatch.display_name_no,
          confidence: highestScore >= 50 ? 'high' : 'medium',
          score: highestScore
        });
      } else if (q.image) {
        matches.push({
          categoryId,
          qTextSnippet: q.no?.q?.substring(0, 50) || 'Missing question text',
          currentImage: q.image,
          currentAlt: q.imageAlt || null,
          proposedAssetCode: null,
          confidence: 'none',
          score: 0,
          notes: 'Has image but no clear asset match'
        });
      }
    });
  }

  const outPath = path.join(__dirname, 'asset_matches.json');
  fs.writeFileSync(outPath, JSON.stringify(matches, null, 2));

  console.log(`Generated matches for ${matches.length} questions.`);
  console.log(`Review the mapping in: src/scripts/asset_matches.json`);
}

run().catch(console.error);
