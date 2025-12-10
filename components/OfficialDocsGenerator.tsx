
import React, { useState } from 'react';
import { AnalysisReport } from '../types';
import { QrCode, PenTool, Send, CheckCircle, Shield, FileCheck, Share2, Mail, Building, Printer, X } from 'lucide-react';

interface OfficialDocsGeneratorProps {
  report: AnalysisReport;
  onClose: () => void;
  caseId: string;
}

const OfficialDocsGenerator: React.FC<OfficialDocsGeneratorProps> = ({ report, onClose, caseId }) => {
  const [signed, setSigned] = useState(false);
  const [sentToDMV, setSentToDMV] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'verify'>('form');

  const doc = report.officialDocs;
  if (!doc) return <div className="text-white">No official documentation generated.</div>;

  const handleSign = () => {
    setSigned(true);
  };

  const handleSend = () => {
    setSentToDMV(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-brand-700 flex items-center justify-center">
                     <FileCheck size={18} className="text-white" />
                 </div>
                 <div>
                     <h2 className="font-bold text-white">Instant Official Documentation</h2>
                     <p className="text-xs text-slate-400 font-mono">
                        {doc.jurisdiction.toUpperCase()} | FORM {doc.formType}
                     </p>
                 </div>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
            <button 
                onClick={() => setActiveTab('form')}
                className={`flex-1 p-3 text-sm font-medium transition-colors ${activeTab === 'form' ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Digital Form ({doc.formType})
            </button>
            <button 
                onClick={() => setActiveTab('verify')}
                className={`flex-1 p-3 text-sm font-medium transition-colors ${activeTab === 'verify' ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Verification & Dispatch
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-8 text-slate-900 relative">
            {activeTab === 'form' ? (
                <div className="max-w-3xl mx-auto bg-white shadow-xl border border-slate-300 min-h-[800px] p-8 font-serif">
                    
                    {/* Fake Paper Form Header */}
                    <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
                        <div>
                            <h1 className="text-xl font-bold uppercase tracking-tight">Traffic Collision Report</h1>
                            <p className="text-xs font-sans text-slate-500 uppercase">{doc.jurisdiction} Department of Motor Vehicles</p>
                        </div>
                        <div className="text-right">
                             <div className="border border-black px-2 py-1 text-xs font-mono font-bold">{caseId}</div>
                             <div className="text-[10px] mt-1">REPORT NUMBER</div>
                        </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-sans mb-6 border border-black p-4">
                        <div className="col-span-2 flex justify-between mb-2 border-b border-slate-200 pb-2">
                             <span><span className="font-bold">DATE:</span> {doc.generatedDate}</span>
                             <span><span className="font-bold">TIME:</span> 14:30</span>
                             <span><span className="font-bold">LOC:</span> {report.executiveSummary.substring(0, 30)}...</span>
                        </div>
                        
                        <div className="border-r border-slate-200 pr-2">
                            <h3 className="font-bold bg-slate-200 px-1 mb-2">PARTY 1 (DEFENDANT)</h3>
                            <div className="grid grid-cols-[1fr_2fr] gap-1">
                                <span className="text-slate-500">Name:</span> <span>{doc.party1Data.name}</span>
                                <span className="text-slate-500">Lic #:</span> <span>{doc.party1Data.license}</span>
                                <span className="text-slate-500">VIN:</span> <span>{doc.party1Data.vin}</span>
                                <span className="text-slate-500">Ins:</span> <span>{doc.party1Data.insuranceCode}</span>
                            </div>
                        </div>

                        <div className="pl-2">
                            <h3 className="font-bold bg-slate-200 px-1 mb-2">PARTY 2 (PLAINTIFF)</h3>
                            <div className="grid grid-cols-[1fr_2fr] gap-1">
                                <span className="text-slate-500">Name:</span> <span>{doc.party2Data.name}</span>
                                <span className="text-slate-500">Lic #:</span> <span>{doc.party2Data.license}</span>
                                <span className="text-slate-500">VIN:</span> <span>{doc.party2Data.vin}</span>
                                <span className="text-slate-500">Ins:</span> <span>{doc.party2Data.insuranceCode}</span>
                            </div>
                        </div>
                    </div>

                    {/* Narrative Section */}
                    <div className="mb-6">
                         <h3 className="font-bold text-sm uppercase border-b border-black mb-2">Investigator Narrative</h3>
                         <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap p-4 bg-slate-50 border border-slate-200">
                             {doc.officerNarrative}
                         </p>
                    </div>

                    {/* Liability Code */}
                    <div className="mb-8">
                        <h3 className="font-bold text-sm uppercase border-b border-black mb-2">Primary Violation Code</h3>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-red-600 border border-red-600 px-2 py-0.5">{report.liability.codeCited}</span>
                            <span className="text-sm italic text-slate-600">Violation Confirmed via Video Analysis</span>
                        </div>
                    </div>

                    {/* Signature Block */}
                    <div className="mt-12 flex justify-between items-end border-t border-black pt-8">
                         <div className="flex-1 mr-8">
                             {!signed ? (
                                 <button 
                                    onClick={handleSign}
                                    className="w-full h-16 border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 rounded flex items-center justify-center text-blue-600 gap-2 font-bold transition-colors"
                                 >
                                    <PenTool size={16} /> CLICK TO E-SIGN
                                 </button>
                             ) : (
                                 <div className="w-full h-16 relative">
                                     <div className="absolute bottom-2 left-0 font-script text-2xl text-blue-900 transform -rotate-2">
                                         Authorized Investigator
                                     </div>
                                     <div className="text-[10px] text-slate-400 absolute bottom-[-20px]">
                                         Signed digitally via AccidentAnalytics
                                     </div>
                                 </div>
                             )}
                             <div className="border-t border-black mt-2 pt-1 text-xs font-bold uppercase">Investigator Signature</div>
                         </div>
                         <div className="w-32">
                             <div className="w-24 h-24 bg-black p-1">
                                 <QrCode className="text-white w-full h-full" />
                             </div>
                             <div className="text-[9px] text-center mt-1">SCAN FOR EVIDENCE</div>
                         </div>
                    </div>
                </div>
            ) : (
                /* Verification Tab */
                <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto space-y-8">
                    
                    {/* Blockchain Card */}
                    <div className="w-full bg-slate-900 text-slate-200 p-6 rounded-xl border border-slate-700 shadow-xl">
                        <div className="flex items-center gap-3 mb-4 text-green-400">
                             <Shield size={24} />
                             <h3 className="font-bold text-lg">Blockchain Immutable Record</h3>
                        </div>
                        <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs break-all text-slate-500 mb-4">
                            HASH: {doc.blockchainHash}
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Timestamp:</span>
                            <span>{new Date().toUTCString()}</span>
                        </div>
                    </div>

                    {/* QR Link */}
                    <div className="w-full bg-white text-slate-900 p-6 rounded-xl border border-slate-300 shadow-xl flex items-center gap-6">
                        <div className="w-24 h-24 bg-slate-900 p-2 rounded">
                            <QrCode className="text-white w-full h-full" />
                        </div>
                        <div>
                             <h3 className="font-bold text-lg mb-1">Full Forensic Evidence Package</h3>
                             <p className="text-sm text-slate-600 mb-3">Scan to access high-res video, physics telemetry, and diagrams.</p>
                             <div className="text-xs text-blue-600 underline cursor-pointer">{doc.qrCodeUrl}</div>
                        </div>
                    </div>

                    {/* Dispatch Actions */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                         <button 
                            onClick={handleSend}
                            disabled={sentToDMV}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                sentToDMV 
                                ? 'bg-green-100 border-green-300 text-green-700' 
                                : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                            }`}
                         >
                            {sentToDMV ? <CheckCircle size={24} /> : <Building size={24} />}
                            <span className="font-bold text-sm">
                                {sentToDMV ? 'FILED WITH DMV' : 'FILE TO DMV DATABASE'}
                            </span>
                         </button>

                         <button className="p-4 bg-slate-200 border border-slate-300 rounded-xl flex flex-col items-center gap-2 text-slate-600 hover:bg-slate-300 transition-colors">
                            <Printer size={24} />
                            <span className="font-bold text-sm">PRINT OFFICIAL COPY</span>
                         </button>
                    </div>

                    {/* Email */}
                    <div className="w-full flex gap-2">
                        <input type="email" placeholder="Email to Police Dept (e.g. records@lapd.online)" className="flex-1 p-3 rounded-lg border border-slate-300" />
                        <button className="bg-brand-600 text-white px-6 rounded-lg font-bold hover:bg-brand-500">
                            <Send size={18} />
                        </button>
                    </div>

                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default OfficialDocsGenerator;
