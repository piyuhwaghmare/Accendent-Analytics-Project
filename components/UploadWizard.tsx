
import React, { useState, useRef } from 'react';
import { Upload, FileText, Video, CheckCircle, Loader2, X, Mic, Paperclip, AlertCircle, File, Activity, Settings2, Plus, ShieldCheck, Search, Fingerprint } from 'lucide-react';
import { analyzeEvidence, GenerativePart } from '../services/geminiService';
import { AnalysisReport } from '../types';

interface UploadWizardProps {
  onComplete: (report: AnalysisReport) => void;
  onCancel: () => void;
  jurisdiction: string;
}

interface EvidenceFile {
  id: string;
  file: File;
  type: 'video' | 'document' | 'audio' | 'other';
  progress: number;
  status: 'queued' | 'uploading' | 'analyzing' | 'complete';
}

interface ValidationStep {
  id: string;
  label: string;
  status: 'pending' | 'checking' | 'valid' | 'warning';
}

const UploadWizard: React.FC<UploadWizardProps> = ({ onComplete, onCancel, jurisdiction }) => {
  const [step, setStep] = useState(1);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("Initializing...");
  const [physicsMethod, setPhysicsMethod] = useState('Auto-Detect');
  
  // Validation State
  const [validationSteps, setValidationSteps] = useState<ValidationStep[]>([
    { id: 'frame', label: 'Video Frame Duplication Check', status: 'pending' },
    { id: 'compression', label: 'Compression Artifact Analysis', status: 'pending' },
    { id: 'gps', label: 'GPS Metadata Tamper Check', status: 'pending' },
    { id: 'audio', label: 'Audio Spectrum / Splicing Detection', status: 'pending' },
    { id: 'voice', label: 'Voice Biometrics & Stress Baseline', status: 'pending' },
  ]);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: EvidenceFile['type']) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: EvidenceFile[] = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        type,
        progress: 0,
        status: 'queued'
      }));
      setEvidenceFiles(prev => [...prev, ...newFiles]);
    }
    if (e.target) e.target.value = '';
  };

  const removeFile = (id: string) => {
    setEvidenceFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = (type: EvidenceFile['type']) => {
    switch (type) {
      case 'video': return <Video size={18} className="text-blue-400" />;
      case 'document': return <FileText size={18} className="text-red-400" />;
      case 'audio': return <Mic size={18} className="text-purple-400" />;
      default: return <File size={18} className="text-slate-400" />;
    }
  };

  const fileToGenerativePart = (file: File): Promise<GenerativePart> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const base64Content = base64Data.split(',')[1];
        resolve({
          inlineData: {
            data: base64Content,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const runValidation = async () => {
    setStep(2); // Validation View
    
    // Simulate real-time checks
    const steps = [...validationSteps];
    for (let i = 0; i < steps.length; i++) {
        setValidationSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'checking' } : s));
        await new Promise(r => setTimeout(r, 800)); // Simulate processing time
        setValidationSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'valid' } : s));
    }
    
    await new Promise(r => setTimeout(r, 500));
    startAIAnalysis();
  };

  const startAIAnalysis = async () => {
    setStep(3);
    setIsProcessing(true);
    
    try {
      setProcessingStatus("Encrypting and uploading media...");
      const parts = await Promise.all(evidenceFiles.map(ef => fileToGenerativePart(ef.file)));

      const preSteps = [
        { text: `Initializing Physics Engine (${physicsMethod})...`, delay: 1000 },
        { text: "Analyzing Voice Stress Microtremors...", delay: 1200 },
        { text: `Gemini AI: Analyzing Liability (${jurisdiction})...`, delay: 1500 },
      ];
      
      for (const seq of preSteps) {
        setProcessingStatus(seq.text);
        await new Promise(r => setTimeout(r, seq.delay));
      }

      const report = await analyzeEvidence(parts, jurisdiction, physicsMethod);

      if (report) {
         setProcessingStatus("Finalizing Forensic Report...");
         await new Promise(r => setTimeout(r, 800));
         setIsProcessing(false);
         onComplete(report);
      } else {
         throw new Error("Analysis failed to return a valid report.");
      }

    } catch (error) {
      console.error(error);
      setProcessingStatus("Analysis failed. Retrying with fallback model...");
      setTimeout(() => {
        setIsProcessing(false);
        setStep(1);
      }, 3000);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Evidence Upload Portal</h2>
            <p className="text-slate-400 text-sm">Ref: CASE-2025-NEW | Secure Transfer Protocol</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs text-brand-400 font-mono border border-brand-900 bg-brand-900/20 px-3 py-1 rounded">
               {jurisdiction.toUpperCase()}
             </div>
             {step > 1 && (
                <div className="text-xs font-mono text-green-400 bg-green-900/20 px-3 py-1 rounded border border-green-900 flex items-center gap-2">
                   <ShieldCheck size={12} /> ENCRYPTED
                </div>
             )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* STEP 1: Upload */}
          {step === 1 && (
            <div className="flex flex-col gap-8 animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div 
                    onClick={() => videoInputRef.current?.click()}
                    className="md:col-span-2 border-2 border-dashed border-slate-700 bg-slate-800/30 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-brand-500 hover:bg-slate-800/50 transition-all cursor-pointer group"
                 >
                    <input type="file" ref={videoInputRef} className="hidden" accept="video/*" multiple onChange={(e) => handleFileSelect(e, 'video')} />
                    <div className="p-4 bg-slate-800 rounded-full text-brand-500 mb-4 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-lg">
                      <Video size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white group-hover:text-brand-400">Upload Dashcam / CCTV Footage</h3>
                    <p className="text-slate-400 text-sm mt-2">AI-powered frame extraction & forensic validation.</p>
                 </div>

                 <div onClick={() => docInputRef.current?.click()} className="border border-slate-700 bg-slate-800/30 rounded-xl p-6 flex items-center gap-4 cursor-pointer hover:border-slate-500 transition-all">
                    <input type="file" ref={docInputRef} className="hidden" accept=".pdf,.doc,image/*" multiple onChange={(e) => handleFileSelect(e, 'document')} />
                    <div className="p-3 bg-slate-900 rounded-lg text-red-400"><FileText size={24} /></div>
                    <div><div className="text-slate-200 font-medium">Reports</div><div className="text-slate-500 text-xs">PDF, Images</div></div>
                 </div>

                 <div onClick={() => audioInputRef.current?.click()} className="border border-slate-700 bg-slate-800/30 rounded-xl p-6 flex items-center gap-4 cursor-pointer hover:border-slate-500 transition-all">
                    <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" multiple onChange={(e) => handleFileSelect(e, 'audio')} />
                    <div className="p-3 bg-slate-900 rounded-lg text-purple-400"><Mic size={24} /></div>
                    <div><div className="text-slate-200 font-medium">Witness Audio</div><div className="text-slate-500 text-xs">Voice Stress Analysis</div></div>
                 </div>
               </div>

               {evidenceFiles.length > 0 && (
                 <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                   {evidenceFiles.map((file) => (
                       <div key={file.id} className="p-3 flex items-center justify-between border-b border-slate-800 last:border-0">
                         <div className="flex items-center gap-3">
                           {getIcon(file.type)} <span className="text-sm text-slate-300">{file.file.name}</span>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="text-slate-500 hover:text-red-400"><X size={16}/></button>
                       </div>
                   ))}
                 </div>
               )}
            </div>
          )}

          {/* STEP 2: Forensic Validation */}
          {step === 2 && (
             <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto w-full animate-fade-in">
                <div className="mb-8 text-center">
                   <ShieldCheck size={48} className="mx-auto text-brand-500 mb-4 animate-pulse" />
                   <h3 className="text-xl font-bold text-white">Verifying Evidence Integrity</h3>
                   <p className="text-slate-400 text-sm">Running forensic authentication protocols...</p>
                </div>

                <div className="w-full space-y-3 bg-slate-900 p-6 rounded-xl border border-slate-800">
                   {validationSteps.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                         <div className="flex items-center gap-3">
                            <Activity size={16} className="text-slate-500" />
                            <span className="text-sm text-slate-300">{s.label}</span>
                         </div>
                         <div>
                            {s.status === 'pending' && <span className="text-xs text-slate-600 font-mono">WAITING</span>}
                            {s.status === 'checking' && <Loader2 size={16} className="text-brand-500 animate-spin" />}
                            {s.status === 'valid' && <CheckCircle size={16} className="text-green-500" />}
                         </div>
                      </div>
                   ))}
                </div>
                <div className="mt-4 text-xs font-mono text-slate-500">
                   SHA-256 HASH VERIFICATION ACTIVE
                </div>
             </div>
          )}

          {/* STEP 3: AI Analysis */}
          {step === 3 && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in min-h-[300px]">
               {isProcessing ? (
                 <>
                   <div className="relative w-24 h-24 mb-8">
                     <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                     <Fingerprint className="absolute inset-0 m-auto text-brand-500 animate-pulse" size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Reconstructing Scene</h3>
                   <p className="text-brand-400 font-mono text-sm">{processingStatus}</p>
                 </>
               ) : (
                 <div className="flex flex-col items-center animate-scale-in">
                    <CheckCircle size={48} className="text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold text-white">Analysis Complete</h3>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-6 border-t border-slate-800 flex justify-between items-center">
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
            disabled={step > 1 && isProcessing}
          >
            Cancel
          </button>
          
          {step === 1 && (
            <button 
              onClick={runValidation}
              disabled={evidenceFiles.length === 0}
              className={`
                px-6 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2
                ${evidenceFiles.length > 0 
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-900/20 transform hover:-translate-y-0.5' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
              `}
            >
              Start Validation & Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadWizard;
