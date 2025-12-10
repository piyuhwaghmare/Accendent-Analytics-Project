
import React, { useState, useEffect } from 'react';
import { AppView, AnalysisReport, CaseFile } from './types';
import { MOCK_REPORT } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UploadWizard from './components/UploadWizard';
import ReportViewer from './components/ReportViewer';
import ForensicChatbot from './components/ForensicChatbot';
import ARSceneViewer from './components/ARSceneViewer';
import { Shield, Loader2, Lock, UserPlus, ArrowRight, CheckCircle } from 'lucide-react';
import { fetchCases, createCase, getReportByCaseId } from './services/caseService';
import { login, signup, logout, getSession, UserSession } from './services/authService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);
  const [jurisdiction, setJurisdiction] = useState<string>("California");
  
  // Auth State
  const [user, setUser] = useState<UserSession | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Data State
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(false);

  // Check session on mount
  useEffect(() => {
    const sessionUser = getSession();
    if (sessionUser) {
      setUser(sessionUser);
      setView(AppView.DASHBOARD);
    }
  }, []);

  // Load cases when entering dashboard
  useEffect(() => {
    if (view === AppView.DASHBOARD) {
      loadCases();
    }
  }, [view]);

  const loadCases = async () => {
    setIsLoadingCases(true);
    const data = await fetchCases();
    setCases(data);
    setIsLoadingCases(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const loggedInUser = await login(email, password);
      setUser(loggedInUser);
      setView(AppView.DASHBOARD);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('fullName') as string;
    const agencyId = formData.get('agencyId') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        setAuthLoading(false);
        return;
    }

    try {
      const newUser = await signup(email, password, name, agencyId);
      setUser(newUser);
      setView(AppView.DASHBOARD);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setView(AppView.LOGIN);
    setCases([]); // Clear sensitive data
  };

  const handleOpenCase = async (id: string) => {
    setSelectedCaseId(id);
    
    // Check if we have the report data loaded in the case list (optimization)
    const existingCase = cases.find(c => c.id === id);
    if (existingCase && (existingCase as any).reportData) {
        setCurrentReport((existingCase as any).reportData);
    } else {
        // Fetch from DB if strictly separated
        const report = await getReportByCaseId(id);
        if (report) {
            setCurrentReport(report);
        } else {
            // Fallback for demo purposes if DB fetch fails
            setCurrentReport(MOCK_REPORT);
        }
    }
    setView(AppView.REPORT);
  };

  const handleAnalysisComplete = async (report: AnalysisReport) => {
    // Save to Database
    const newId = await createCase(report, jurisdiction);
    
    setCurrentReport(report);
    setSelectedCaseId(newId || 'TEMP-ID');
    setView(AppView.REPORT);
    
    // Background refresh of cases list so it's ready when they go back
    loadCases(); 
  };

  // Render Login View separately
  if (view === AppView.LOGIN) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-900/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-4 rounded-xl shadow-inner border border-slate-700 relative">
               <Shield size={48} className="text-brand-500 fill-brand-500/10" />
               <div className="absolute -bottom-1 -right-1 bg-green-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded">v3.0</div>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-center text-white mb-1">AccidentAnalytics</h1>
          <p className="text-slate-400 text-center mb-8 text-sm uppercase tracking-widest font-mono">Enterprise Forensic Suite</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            
            <button type="button" className="w-full bg-white text-slate-900 font-medium py-3 rounded-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.01]">
               <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.489 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
               Sign in with Google
            </button>

            <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-xs text-slate-500 font-mono">OR USE ID</span>
                <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <div>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-sm"
                placeholder="Agency Email"
              />
            </div>
            <div>
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-sm"
                placeholder="Secure Token"
              />
            </div>
            
            {authError && (
              <div className="text-red-400 text-xs text-center bg-red-900/20 p-2 rounded border border-red-900/50 animate-shake">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={authLoading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-brand-900/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} 
              {authLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
             <button onClick={() => setView(AppView.SIGNUP)} className="text-sm text-brand-400 hover:text-brand-300 font-medium">
               New Agency Registration &rarr;
             </button>
          </div>
          
          <div className="mt-6 text-center text-xs text-slate-600 leading-relaxed">
            Restricted System. Compliant with Daubert Standards & ISO 27001.<br/>
            Unauthorized access is a federal offense.
          </div>
        </div>
      </div>
    );
  }

  // Render Signup View separately
  if (view === AppView.SIGNUP) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px]"></div>
           <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in">
          <button onClick={() => setView(AppView.LOGIN)} className="mb-6 text-slate-500 hover:text-white text-sm flex items-center gap-1">
             &larr; Back to Login
          </button>
          
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Agency Registration</h1>
          <p className="text-slate-400 mb-6 text-sm">Create a new secure forensic workspace.</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Full Name</label>
                   <input name="fullName" required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm" placeholder="John Doe" />
                </div>
                <div>
                   <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Agency ID</label>
                   <input name="agencyId" required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm" placeholder="NYPD-001" />
                </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Official Email</label>
              <input name="email" required type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm" placeholder="agent@bureau.gov" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Password</label>
                   <input name="password" required type="password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm" placeholder="••••••••" />
                </div>
                <div>
                   <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Confirm</label>
                   <input name="confirmPassword" required type="password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm" placeholder="••••••••" />
                </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
                <input required type="checkbox" className="mt-1 bg-slate-900 border-slate-700" id="terms" />
                <label htmlFor="terms" className="text-xs text-slate-400">
                    I acknowledge that all data processed is subject to chain-of-custody auditing and federal perjury laws.
                </label>
            </div>
            
            {authError && (
              <div className="text-red-400 text-xs text-center bg-red-900/20 p-2 rounded border border-red-900/50 animate-shake">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={authLoading}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-green-900/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {authLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} 
              {authLoading ? 'Creating Profile...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeView={view} 
      onNavigate={setView}
      jurisdiction={jurisdiction}
      onJurisdictionChange={setJurisdiction}
      onLogout={handleLogout}
      user={user}
    >
      {view === AppView.DASHBOARD && (
        <Dashboard 
          cases={cases}
          isLoading={isLoadingCases}
          onNewCase={() => {
            setCurrentReport(null); // Reset for new case
            setView(AppView.UPLOAD);
          }} 
          onOpenCase={handleOpenCase}
        />
      )}
      
      {view === AppView.UPLOAD && (
        <UploadWizard 
          onComplete={handleAnalysisComplete} 
          onCancel={() => setView(AppView.DASHBOARD)}
          jurisdiction={jurisdiction}
        />
      )}

      {view === AppView.REPORT && (
        <ReportViewer 
          report={currentReport || MOCK_REPORT} 
          onBack={() => setView(AppView.DASHBOARD)} 
          caseId={selectedCaseId || 'CASE-UNKNOWN'}
        />
      )}

      {view === AppView.AR_MODE && (
        <ARSceneViewer onClose={() => setView(AppView.DASHBOARD)} />
      )}

      <ForensicChatbot />
    </Layout>
  );
};

export default App;
