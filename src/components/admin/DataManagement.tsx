import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Download, Upload, AlertCircle, FileText, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getSupabase } from '../../lib/supabase';
import { QDATA } from '../../data/questions';

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState<'export'|'import'>('export');

  // Export States
  const [exportTarget, setExportTarget] = useState<'questions'|'codes'>('questions');
  
  // Import States
  const [importTarget, setImportTarget] = useState<'questions'|'codes'>('questions');
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [validationErrors, setValidationErrors] = useState<{row: number, msg: string}[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    if (exportTarget === 'questions') {
      // Flatten all categories
      const allRows: any[] = [];
      Object.entries(QDATA).forEach(([catId, catInfo]) => {
        catInfo.q.forEach((qObj: any, index: number) => {
          
          // Helper to extract nested lang data
          const getLangContent = (lang: string, field: string) => {
            if (qObj[lang] && typeof qObj[lang].q === 'string') return qObj[lang][field];
            return '';
          };

          const row = {
            id: qObj.id || `${catId}_${index}`,
            category: catId,
            group: qObj.group || '',
            topic: qObj.topicId || qObj.no?.t || qObj.t || '',
            question_no: getLangContent('no', 'q') || qObj.q || '',
            question_en: getLangContent('en', 'q') || '',
            question_ar: getLangContent('ar', 'q') || '',
            question_pl: getLangContent('pl', 'q') || '',
            
            // Extract options intelligently
            option_a_no: qObj.no?.o?.[0] || qObj.o?.[0] || '',
            option_b_no: qObj.no?.o?.[1] || qObj.o?.[1] || '',
            option_c_no: qObj.no?.o?.[2] || qObj.o?.[2] || '',
            option_d_no: qObj.no?.o?.[3] || qObj.o?.[3] || '',
            
            option_a_en: qObj.en?.o?.[0] || '',
            option_b_en: qObj.en?.o?.[1] || '',
            option_c_en: qObj.en?.o?.[2] || '',
            option_d_en: qObj.en?.o?.[3] || '',
            
            correct_answer: qObj.no?.c !== undefined ? qObj.no?.c : (qObj.c !== undefined ? qObj.c : -1),
            
            explanation_no: getLangContent('no', 'e') || qObj.e || '',
            explanation_en: getLangContent('en', 'e') || '',
            
            sourceTitle: qObj.sourceTitle || qObj.no?.sourceTitle || '',
            sourceUrl: qObj.sourceUrl || qObj.no?.sourceUrl || '',
            legalReference: qObj.legalReference || qObj.no?.legalReference || '',
            difficulty: qObj.difficulty || qObj.no?.difficulty || '',
            tags: (qObj.tags || []).join(','),
            image: qObj.image || '',
            imageAlt: qObj.imageAlt || ''
          };
          allRows.push(row);
        });
      });

      const csv = Papa.unparse(allRows);
      downloadFile(csv, `teorigo_questions_export_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv');
    } else if (exportTarget === 'codes') {
      const supabase = getSupabase();
      // Only admins can do this, so it will fetch everything bypassing limits usually
      const { data, error } = await supabase.from('access_codes').select('*').order('created_at', { ascending: false });
      if (error) {
        alert('Could not export codes: ' + error.message);
        return;
      }
      
      const mapped = (data || []).map(c => ({
        code: c.code,
        status: c.status || (c.is_used ? 'used' : 'active'),
        created_at: c.created_at,
        created_by: c.created_by,
        expires_at: c.expires_at || '',
        max_uses: c.max_uses || 1,
        used_count: c.used_count || 0,
        assigned_modules: JSON.stringify(c.assigned_modules || []),
        internal_label: c.internal_note || '',
        redeemed_at: c.redeemed_at || '',
        redeemed_by: c.redeemed_by || ''
      }));

      const csv = Papa.unparse(mapped);
      downloadFile(csv, `teorigo_codes_export_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv');
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob(["\ufeff" + content], { type: `${mimeType};charset=utf-8` }); // BOM for Excel
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        validateParsedData(results.data, importTarget);
      },
      error: (err) => {
        alert('Failed to parse CSV: ' + err.message);
      }
    });
  };

  const validateParsedData = (data: any[], target: 'questions'|'codes') => {
    const errs: {row: number, msg: string}[] = [];
    
    if (target === 'questions') {
      data.forEach((row, i) => {
        const rowNum = i + 1;
        if (!row.category) errs.push({row: rowNum, msg: 'Missing category'});
        if (!row.question_no) errs.push({row: rowNum, msg: 'Missing norwegian question text (question_no)'});
        if (row.correct_answer === undefined || row.correct_answer === '') errs.push({row: rowNum, msg: 'Missing correct_answer index'});
        if (!row.option_a_no || !row.option_b_no) errs.push({row: rowNum, msg: 'At least two options (option_a_no, option_b_no) are required'});
      });
    } else if (target === 'codes') {
      // Validate codes
      const codes = new Set();
      data.forEach((row, i) => {
        const rowNum = i + 1;
        if (!row.code) errs.push({row: rowNum, msg: 'Missing code'});
        if (row.code && codes.has(row.code)) errs.push({row: rowNum, msg: `Duplicate code in CSV: ${row.code}`});
        codes.add(row.code);
        if (row.status && !['active','used','partially_used','revoked','draft','expired'].includes(row.status.toLowerCase())) {
          errs.push({row: rowNum, msg: `Invalid status: ${row.status}`});
        }
      });
    }
    
    setValidationErrors(errs);
  };

  const confirmImport = async () => {
    if (!parsedData || parsedData.length === 0) return;
    if (validationErrors.length > 0) {
      alert('Please fix validation errors before importing.');
      return;
    }

    setImportLoading(true);
    
    try {
      if (importTarget === 'codes') {
        const supabase = getSupabase();
        
        // Prepare rows
        const rowsToInsert = parsedData.map(r => ({
          code: String(r.code).trim().toUpperCase(),
          status: r.status ? String(r.status).toLowerCase() : 'active',
          is_used: String(r.status).toLowerCase() === 'used',
          max_uses: parseInt(r.max_uses) || 1,
          used_count: parseInt(r.used_count) || 0,
          internal_note: r.internal_label || r.internal_note || null,
          plan_days: parseInt(r.plan_days) || 0,
          created_by: 'csv_import'
        }));

        // Basic batch insert
        const { error } = await supabase.from('access_codes').insert(rowsToInsert);
        if (error) throw error;
        
        alert(`Successfully imported ${rowsToInsert.length} codes.`);
        setParsedData(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        // Questions import - currently we don't have a DB table for this, so we alert and output JSON to console
        // For production, this should write to a questions table or emit a JSON file to be merged.
        console.log("Staged Questions Data:", parsedData);
        alert(`Staging complete for ${parsedData.length} questions.\nIn this version, questions are bundled in the source code. Output dumped to console. Download as JSON draft is available.`);
        downloadFile(JSON.stringify(parsedData, null, 2), `questions_draft_${Date.now()}.json`, 'application/json');
        setParsedData(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (e: any) {
      alert('Import failed: ' + e.message);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* TABS */}
      <div className="flex bg-brand-dark-2 p-1.5 rounded-xl self-start w-fit">
        <button
          onClick={() => setActiveTab('export')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold transition-all",
            activeTab === 'export' ? "bg-brand-dark text-white shadow" : "text-slate-400 hover:text-white"
          )}
        >
          Eksport
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold transition-all",
            activeTab === 'import' ? "bg-brand-dark text-white shadow" : "text-slate-400 hover:text-white"
          )}
        >
          Import
        </button>
      </div>

      <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6 sm:p-8">
        
        {activeTab === 'export' && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Eksporter Data (CSV)</h2>
              <p className="text-sm text-slate-400">
                Last ned Teorigo-data som strukturerte CSV-filer for revisjon, oversettelser eller backup.
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                Datakilde
              </label>
              <select
                value={exportTarget}
                onChange={(e: any) => setExportTarget(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-sm text-white font-medium outline-none focus:border-brand-blue"
              >
                <option value="questions">📚 Spørsmålsbank (Alle kategorier)</option>
                <option value="codes">🔑 Tilgangskoder (Hele historikken)</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="px-6 py-3 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue hover:bg-brand-blue/20 hover:text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Generer og last ned CSV
            </button>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-2">Importer og valider Data (CSV)</h2>
              <p className="text-sm text-slate-400">
                Laste opp bulk-data for migrering. Filene blir først validert i nettleseren før de aktiveres, for å forhindre korrupt data.
              </p>
            </div>

            {!parsedData ? (
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    Datatype
                  </label>
                  <select
                    value={importTarget}
                    onChange={(e: any) => setImportTarget(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-sm text-white font-medium outline-none focus:border-brand-blue"
                  >
                    <option value="questions">📚 Spørsmålsbank</option>
                    <option value="codes">🔑 Tilgangskoder</option>
                  </select>
                </div>

                <div className="border border-dashed border-brand-border bg-brand-dark/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                  <Upload className="w-8 h-8 text-slate-500 mb-4" />
                  <p className="text-white font-bold mb-1">Velg en CSV-fil fra din datamaskin</p>
                  <p className="text-xs text-slate-500 mb-6">Maks filstørrelse: 10MB. Sørg for at kolonnenavnene stemmer med malen.</p>
                  
                  <input
                    type="file"
                    accept=".csv"
                    onChange={parseFile}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-brand-border text-white hover:bg-slate-700 rounded-xl text-sm font-bold transition-all"
                  >
                    Bla gjennom filer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-brand-dark p-6 rounded-xl border border-brand-border">
                  <div>
                    <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-brand-blue" />
                      Staging / Gjennomgang
                    </h3>
                    <p className="text-sm text-slate-400">
                      Fant <strong className="text-white">{parsedData.length}</strong> rader i filen.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setParsedData(null);
                      setValidationErrors([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Avbryt og prøv på nytt
                  </button>
                </div>

                {validationErrors.length > 0 ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                    <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Valideringsfeil funnet ({validationErrors.length})
                    </h4>
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {validationErrors.map((err, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm bg-brand-dark p-3 rounded-lg">
                          <span className="flex-shrink-0 text-red-500 font-mono bg-red-500/10 px-2 py-0.5 rounded">Rad {err.row}</span>
                          <span className="text-slate-300">{err.msg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-emerald-400 font-bold mb-1">Klar for import</h4>
                      <p className="text-sm text-emerald-400/80 mb-4">
                        Ingen kritiske feil ble funnet i radene.
                      </p>
                      <button
                        onClick={confirmImport}
                        disabled={importLoading}
                        className="px-6 py-2.5 bg-brand-blue text-white hover:bg-brand-blue-lt disabled:opacity-50 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
                      >
                        {importLoading ? 'Importerer...' : 'Utfør Import til Produksjon'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Data Preview */}
                <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-dark-2">
                  <div className="overflow-x-auto custom-scrollbar border-t border-brand-border">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-brand-border bg-brand-dark text-slate-400">
                          {Object.keys(parsedData[0] || {}).slice(0, 8).map(key => (
                            <th key={key} className="p-3 font-semibold">{key}</th>
                          ))}
                          {Object.keys(parsedData[0] || {}).length > 8 && (
                            <th className="p-3 font-semibold italic">... (+ flere kolonner)</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border">
                        {parsedData.slice(0, 5).map((row, i) => (
                          <tr key={i} className="hover:bg-white/[0.02]">
                            {Object.values(row).slice(0, 8).map((val: any, j) => (
                              <td key={j} className="p-3 text-slate-300 max-w-[200px] truncate" title={val}>
                                {val}
                              </td>
                            ))}
                            {Object.keys(row).length > 8 && <td className="p-3 text-slate-500 italic">...</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedData.length > 5 && (
                    <div className="p-3 text-center text-xs text-slate-500 border-t border-brand-border bg-brand-dark/50">
                      Viser 5 av {parsedData.length} rader
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
