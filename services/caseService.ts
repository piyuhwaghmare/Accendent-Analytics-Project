
import { supabase } from '../lib/supabaseClient';
import { CaseFile, AnalysisReport } from '../types';
import { MOCK_CASES } from '../constants';

// In-memory store for session fallback (prevents crash if DB is down)
let SESSION_CASES: CaseFile[] = [...MOCK_CASES];

const isSupabaseConfigured = () => {
  return process.env.SUPABASE_URL && process.env.SUPABASE_KEY;
};

export const fetchCases = async (): Promise<CaseFile[]> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, using session data.');
    return SESSION_CASES;
  }

  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return SESSION_CASES;

    return data.map((item: any) => ({
      id: item.id,
      referenceNumber: item.reference_number,
      status: item.status,
      dateCreated: new Date(item.created_at).toISOString().split('T')[0],
      description: item.description,
      location: item.location,
      thumbnailUrl: item.thumbnail_url || 'https://picsum.photos/400/225?grayscale',
      parties: {
        plaintiff: item.plaintiff,
        defendant: item.defendant
      },
      reportData: item.report_data 
    }));
  } catch (err) {
    console.warn('DB Fetch failed (using session fallback):', err);
    return SESSION_CASES;
  }
};

export const createCase = async (report: AnalysisReport, jurisdiction: string): Promise<string> => {
  const refNum = `CASE-2025-${Math.floor(1000 + Math.random() * 9000)}`;
  const description = `${report.executiveSummary.split('.')[0].substring(0, 50)}...`;
  const plaintiff = "Vehicle B (Plaintiff)";
  const defendant = "Vehicle A (Defendant)";
  const newId = `c-${Date.now()}`;

  // 1. Create the new case object
  const newCase: CaseFile = {
    id: newId,
    referenceNumber: refNum,
    status: 'Admissible',
    dateCreated: new Date().toISOString().split('T')[0],
    description: description,
    location: jurisdiction,
    thumbnailUrl: `https://picsum.photos/seed/${refNum}/400/225`,
    parties: { plaintiff, defendant },
  };

  // 2. Attach the report data (simulating DB structure)
  (newCase as any).reportData = report;

  // 3. Update session store immediately
  SESSION_CASES = [newCase, ...SESSION_CASES];

  // 4. Try persistent save if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('cases').insert([{
        reference_number: refNum,
        status: 'Admissible',
        description: description,
        location: jurisdiction,
        plaintiff: plaintiff,
        defendant: defendant,
        report_data: report,
        thumbnail_url: newCase.thumbnailUrl
      }]);
    } catch (err) {
      console.warn('Background DB save failed (session data preserved):', err);
    }
  }

  return newId;
};

export const getReportByCaseId = async (id: string): Promise<AnalysisReport | null> => {
    // Check session store first
    const sessionCase = SESSION_CASES.find(c => c.id === id);
    if (sessionCase && (sessionCase as any).reportData) {
        return (sessionCase as any).reportData;
    }

    if (!isSupabaseConfigured()) return null;

    try {
        const { data, error } = await supabase
            .from('cases')
            .select('report_data')
            .eq('id', id)
            .single();

        if (error || !data) throw error;
        return data.report_data as AnalysisReport;
    } catch (err) {
        console.warn('DB Report fetch failed:', err);
        return null;
    }
}
