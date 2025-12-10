
import React, { useState } from 'react';
import { AnalysisReport } from '../types';
import ImpactDiagram from './charts/ImpactDiagram';
import SpeedProfileChart from './charts/SpeedProfileChart';
import RippleEffectDiagram from './charts/RippleEffectDiagram';
import EnvironmentalRadar from './charts/EnvironmentalRadar';
import SettlementAgent from './SettlementAgent';
import OfficialDocsGenerator from './OfficialDocsGenerator';
import { 
  FileText, Download, FileJson, Table, Image, Fingerprint, 
  ScanFace, Eye, AlertOctagon, BrainCircuit, Mic, Activity, 
  Volume2, AlertTriangle, CloudRain, Sun, Wind, Thermometer, 
  Waves, Microscope, HeartPulse, Gauge, User, Calculator, 
  FileCheck, ArrowLeft, Zap, CheckCircle
} from 'lucide-react';
import { jsPDF } from "jspdf";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportViewerProps {
  report: AnalysisReport;
  onBack: () => void;
  caseId: string;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onBack, caseId }) => {
  const [showSettlementAgent, setShowSettlementAgent] = useState(false);
  const [showDocsGenerator, setShowDocsGenerator] = useState(false);
  const [tirePressure, setTirePressure] = useState(32); // Default PSI

  const getFilename = (ext: string) => {
    const safeId = caseId.replace(/[^a-zA-Z0-9-_]/g, '-');
    const date = new Date().toISOString().split('T')[0];
    return `ForensicReport_${safeId}_${date}.${ext}`;
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(report, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFilename('json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Section', 'Key', 'Value'],
      ['Executive Summary', 'Summary', `"${report.executiveSummary.replace(/"/g, '""')}"`],
      ['Liability', 'Defendant Fault', `${report.liability.defendantPercentage}%`],
      ['Liability', 'Rationale', `"${report.liability.rationale.replace(/"/g, '""')}"`],
    ];
    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFilename('csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportSVG = () => {
     alert("SVG Package queued for download. (Feature simulated)");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    let y = 20;

    // Helper to add text and manage pagination
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      
      const lines = doc.splitTextToSize(text, maxLineWidth);
      const lineHeight = fontSize * 0.5; // simple scaling for line height
      
      if (y + (lines.length * lineHeight) > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.text(lines, margin, y);
      y += (lines.length * lineHeight) + (fontSize * 0.3);
    };

    const addSection = (title: string) => {
       if (y > pageHeight - 40) {
           doc.addPage();
           y = margin;
       }
       y += 5;
       addText(title.toUpperCase(), 12, true);
       y += 2;
       doc.setLineWidth(0.5);
       doc.setDrawColor(100);
       doc.line(margin, y, pageWidth - margin, y);
       y += 5;
    };

    // Header
    doc.setTextColor(0, 50, 100);
    addText("ACCIDENT ANALYTICS - FORENSIC REPORT", 18, true);
    doc.setTextColor(0, 0, 0);
    addText(`Case Ref: ${caseId}`, 10);
    addText(`Date Generated: ${new Date().toLocaleDateString()}`, 10);
    addText(`Jurisdiction: ${report.officialDocs?.jurisdiction || "N/A"}`, 10);
    y += 5;

    // Executive Summary
    addSection("Executive Summary");
    addText(report.executiveSummary, 10);

    // Liability
    addSection("Liability Determination");
    addText(`Defendant Liability: ${report.liability.defendantPercentage}%`, 10, true);
    addText(`Plaintiff Liability: ${report.liability.plaintiffPercentage}%`, 10, true);
    y += 2;
    addText("Rationale:", 10, true);
    addText(report.liability.rationale, 10);
    y += 2;
    addText(`Statute Cited: ${report.liability.codeCited}`, 10, true);

    // Physics
    addSection("Physics Reconstruction");
    addText(`Vehicle A Speed: ${report.physics.vehicleA_speed} mph`, 10);
    addText(`Vehicle B Speed: ${report.physics.vehicleB_speed} mph`, 10);
    addText(`Impact Angle: ${report.physics.impactAngle} degrees`, 10);
    addText(`Methodology: ${report.physics.method} (Confidence: ${report.physics.confidence}%)`, 10);

    // Human Impact
    if (report.humanImpact) {
        addSection("Human Impact & Biomechanics");
        addText(`Delta-V: ${report.humanImpact.deltaV} mph`, 10);
        addText(`PDOF: ${report.humanImpact.principalDirection}`, 10);
        addText(`Seatbelt Status: ${report.humanImpact.seatbeltStatus}`, 10);
        addText(`Predicted AIS Score: ${report.humanImpact.aisScore}`, 10);
    }

    // Driver Behavior
    if (report.driverBehavior) {
        addSection("Driver Behavior Analysis");
        addText(`Risk Percentile: ${report.driverBehavior.riskPercentile}th`, 10);
        addText(`Detected Actions: ${report.driverBehavior.detectedActions.join(", ")}`, 10);
        addText(`Court Recommendation: ${report.driverBehavior.courtRecommendation}`, 10);
    }

    // Environmental
    if (report.environmental) {
        addSection("Environmental Conditions");
        addText(`Weather: ${report.environmental.weatherCondition}`, 10);
        addText(`Road Surface: ${report.environmental.roadSurfaceCondition}`, 10);
        addText(`Friction Coefficient: ${report.environmental.roadFrictionCoefficient}`, 10);
        addText(`Notes: ${report.environmental.notes}`, 10);
    }

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Generated by AccidentAnalytics v2.0 - Admissible Forensic Evidence`, margin, pageHeight - 10);
    }

    doc.save(getFilename('pdf'));
  };

  // Helper for weather icons
  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain')) return <CloudRain className="text-blue-400" size={32} />;
    if (c.includes('sun') || c.includes('clear')) return <Sun className="text-yellow-400" size={32} />;
    if (c.includes('snow')) return <Thermometer className="text-cyan-400" size={32} />;
    return <Wind className="text-slate-400" size={32} />;
  };

  // Horne's Formula Calculation
  const calculateHydroplaneThreshold = (psi: number) => {
      // Vp = 10.35 * sqrt(P) in mph
      return (10.35 * Math.sqrt(psi)).toFixed(1);
  };

  const calculatedThreshold = calculateHydroplaneThreshold(tirePressure);
  const isCalculatedRisk = report.physics.vehicleA_speed > parseFloat(calculatedThreshold);

  return (
    <div className="flex flex-col h-full bg-slate-950 animate-fade-in overflow-y-auto forensic-scroll relative">
      
      {showSettlementAgent && (
          <SettlementAgent report={report} onClose={() => setShowSettlementAgent(false)} caseRef={caseId} />
      )}

      {showDocsGenerator && (
          <OfficialDocsGenerator report={report} onClose={() => setShowDocsGenerator(false)} caseId={caseId} />
      )}

      {/* Responsive Header */}
      <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors p-1">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
          <div className="flex-1 md:flex-none">
            <h1 className="text-lg font-bold text-white font-serif truncate">FORENSIC REPORT</h1>
            <p className="text-xs text-brand-400 font-mono flex items-center gap-2">
              <span className="truncate max-w-[150px]">{caseId}</span> 
              <span className="bg-green-900/30 text-green-400 px-1.5 rounded text-[10px] border border-green-900">ADMISSIBLE</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
             onClick={() => setShowDocsGenerator(true)}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm font-medium transition-all shadow-lg shadow-blue-900/50"
          >
             <FileCheck size={16} /> <span className="inline">Docs</span>
          </button>

          <button 
             onClick={() => setShowSettlementAgent(true)}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-medium transition-all shadow-lg shadow-green-900/50"
          >
             <Calculator size={16} /> <span className="inline">Settle</span>
          </button>

          <div className="hidden lg:block h-8 w-px bg-slate-700 mx-1"></div>

          <div className="flex bg-slate-800 rounded border border-slate-700">
            <button onClick={handleExportJSON} className="p-2 text-slate-300 hover:text-white border-r border-slate-700 hover:bg-slate-700" title="JSON">
               <FileJson size={16} />
            </button>
            <button onClick={handleExportCSV} className="p-2 text-slate-300 hover:text-white border-r border-slate-700 hover:bg-slate-700" title="CSV">
               <Table size={16} />
            </button>
            <button onClick={handleExportSVG} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700" title="SVG">
               <Image size={16} />
            </button>
          </div>
          
          <button onClick={handleExportPDF} className="hidden sm:flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-sm transition-all">
            <Download size={16} /> <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
        
        {/* Executive Summary */}
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-900/50 rounded-lg border border-brand-800 text-brand-400 shrink-0 hidden sm:block">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-bold text-slate-100 mb-2 border-b border-slate-800 pb-2">EXECUTIVE SUMMARY</h2>
              <p className="text-slate-300 leading-relaxed font-serif text-sm md:text-base">
                {report.executiveSummary}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-950 p-4 rounded border border-slate-800">
               <span className="text-xs text-slate-500 uppercase font-mono">Integrity</span>
               <div className="text-xl md:text-2xl font-bold text-green-500 mt-1">{report.evidenceIntegrity.score}%</div>
               <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 truncate">
                  <Fingerprint size={10} /> {report.evidenceIntegrity.certificateId.substring(0,8)}...
               </div>
            </div>
            <div className="bg-slate-950 p-4 rounded border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-mono">Liability</span>
              <div className="text-xl md:text-2xl font-bold text-forensic-red mt-1">Def ({report.liability.defendantPercentage}%)</div>
              <div className="text-xs text-slate-400 mt-1 truncate">{report.liability.codeCited}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-mono">Speed (Veh A)</span>
              <div className="text-xl md:text-2xl font-bold text-forensic-blue mt-1">{report.physics.vehicleA_speed} mph</div>
              <div className="text-xs text-slate-400 mt-1">Conf: {report.physics.confidence}%</div>
            </div>
            <div className="bg-slate-950 p-4 rounded border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-mono">Est. Payout</span>
              <div className="text-xl md:text-2xl font-bold text-forensic-green mt-1">${(report.insurance.payoutEstimate/1000).toFixed(1)}k</div>
              <div className="text-xs text-slate-400 mt-1">{report.insurance.status}</div>
            </div>
          </div>
        </section>

        {/* VISUAL DYNAMICS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                 <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                    <Zap size={16}/> IMPACT DYNAMICS
                 </h3>
                 <ImpactDiagram 
                    angle={report.physics.impactAngle} 
                    speedA={report.physics.vehicleA_speed} 
                    speedB={report.physics.vehicleB_speed} 
                 />
              </div>
              <SpeedProfileChart />
           </div>

           <div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-full">
                  <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                     <Waves size={16}/> KINETIC PROPAGATION (RIPPLE EFFECT)
                  </h3>
                  {report.rippleEffect ? (
                     <RippleEffectDiagram 
                        sequence={report.rippleEffect.sequence} 
                        origin={report.rippleEffect.faultOrigin} 
                     />
                  ) : (
                     <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                        No multi-vehicle ripple effect detected.
                     </div>
                  )}
                  {report.rippleEffect && (
                      <div className="mt-4 space-y-2">
                         <h4 className="text-xs font-bold text-slate-500 uppercase">Subrogation Matrix</h4>
                         {report.rippleEffect.subrogationMatrix.map((sub, i) => (
                             <div key={i} className="flex justify-between text-xs bg-slate-950 p-2 rounded border border-slate-800">
                                <span className="text-slate-300">{sub.payer} &rarr; {sub.payee}</span>
                                <span className="font-mono text-green-400">${sub.amount.toLocaleString()}</span>
                             </div>
                         ))}
                      </div>
                  )}
              </div>
           </div>
        </section>

        {/* DRIVER BEHAVIOR AI */}
        {report.driverBehavior && (
            <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-slide-in">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-900/30 rounded text-orange-400"><ScanFace size={20} /></div>
                    <div>
                        <h3 className="text-lg font-bold text-white">DRIVER BEHAVIOR AI</h3>
                        <p className="text-xs text-slate-400">Facial Recognition & Kinematic Risk Profiling</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Gauge: Attention Score */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-center">
                         <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><Eye size={14}/> Attention Score</div>
                         <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                                <circle cx="48" cy="48" r="40" stroke={report.driverBehavior.attentionScore < 50 ? "#ef4444" : "#22c55e"} strokeWidth="8" fill="none" 
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - report.driverBehavior.attentionScore / 100)}`}
                                />
                            </svg>
                            <span className="text-2xl font-bold text-white">{report.driverBehavior.attentionScore}</span>
                         </div>
                         <div className="text-[10px] text-slate-500 mt-1">
                             {report.driverBehavior.identityMatch || 'Identity Unknown'}
                         </div>
                    </div>

                    {/* Gauge: Risk Percentile */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-center">
                         <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><AlertOctagon size={14}/> Risk Percentile</div>
                         <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden mt-4 relative">
                             <div 
                                className={`h-full ${report.driverBehavior.riskPercentile > 80 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                                style={{ width: `${report.driverBehavior.riskPercentile}%` }}
                             ></div>
                         </div>
                         <div className="mt-2 text-xl font-bold text-white">{report.driverBehavior.riskPercentile}th</div>
                         <div className="text-[10px] text-slate-500">Volatility Index: {report.driverBehavior.drivingVolatility}/100</div>
                    </div>

                    {/* Behavior Log */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 lg:col-span-2">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><BrainCircuit size={14}/> AI Observation Log</div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {report.driverBehavior.detectedActions.map((action, i) => (
                                <span key={i} className="px-3 py-1 bg-red-900/20 text-red-400 border border-red-900/50 rounded-full text-xs font-medium">
                                    {action}
                                </span>
                            ))}
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                             <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Court Recommendation</div>
                             <p className="text-sm text-slate-200 italic">"{report.driverBehavior.courtRecommendation}"</p>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* VOICE FORENSICS */}
        {report.audioForensics && (
            <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-slide-in">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-900/30 rounded text-purple-400"><Mic size={20} /></div>
                    <div>
                        <h3 className="text-lg font-bold text-white">VOICE FORENSICS & CREDIBILITY</h3>
                        <p className="text-xs text-slate-400">Audio Microtremor & Deception Analysis</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Stress Graph */}
                    <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2"><Activity size={14}/> STRESS TELEMETRY (0-100)</h4>
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400">Sampling Rate: 44.1kHz</span>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={report.audioForensics.stressLevels}>
                                    <defs>
                                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}s`} />
                                    <YAxis stroke="#64748b" fontSize={10} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                                        itemStyle={{ color: '#ef4444' }}
                                    />
                                    <Area type="monotone" dataKey="level" stroke="#ef4444" fillOpacity={1} fill="url(#colorStress)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Indicators */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2"><Volume2 size={14}/> ACOUSTIC PROFILE</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Sentiment</span>
                                    <span className="text-white font-medium">{report.audioForensics.speakerSentiment}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Voice Match</span>
                                    <span className={report.audioForensics.voiceSignatureMatch ? "text-green-500" : "text-red-500"}>
                                        {report.audioForensics.voiceSignatureMatch ? "Confirmed" : "Mismatch"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2"><AlertTriangle size={14}/> DECEPTION MARKERS</h4>
                            <div className="space-y-2 overflow-y-auto max-h-[100px] custom-scrollbar">
                                {report.audioForensics.deceptionIndicators.map((ind, i) => (
                                    <div key={i} className="text-xs bg-red-900/20 text-red-300 border border-red-900/30 px-2 py-1 rounded">
                                        {ind}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Transcript */}
                    <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2"><FileText size={14}/> FORENSIC TRANSCRIPT</h4>
                        <p className="font-mono text-sm text-slate-300 leading-relaxed bg-slate-900 p-3 rounded">
                            "{report.audioForensics.transcript}"
                        </p>
                        <div className="mt-2 text-xs text-slate-500 italic">
                            * Background Noise Analysis: {report.audioForensics.backgroundNoiseAnalysis}
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* ENVIRONMENTAL ANALYSIS */}
        {report.environmental && (
           <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-slide-in relative overflow-hidden">
              {/* Rain Effect Overlay */}
              {report.environmental.weatherCondition.toLowerCase().includes('rain') && (
                  <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
              )}
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2 bg-blue-900/30 rounded text-blue-400"><CloudRain size={20} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white">ENVIRONMENTAL FORENSICS</h3>
                    <p className="text-xs text-slate-400">Weather Impact, Road Friction & Visibility Analysis</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                 
                 {/* Card 1: Conditions & Risk Radar */}
                 <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-between col-span-1">
                    <div className="text-center mb-4">
                        {getWeatherIcon(report.environmental.weatherCondition)}
                        <h4 className="mt-2 font-bold text-white text-md">{report.environmental.weatherCondition}</h4>
                        <p className="text-xs text-slate-500">{report.environmental.lightCondition} • {report.environmental.roadSurfaceCondition}</p>
                    </div>
                    {/* Integrated Radar */}
                    <div className="w-full h-40">
                        <EnvironmentalRadar data={report.environmental} />
                    </div>
                 </div>

                 {/* Card 2: Friction */}
                 <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2"><Waves size={14}/> FRICTION COEFFICIENT (µ)</h4>
                    <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden mb-4 border border-slate-700">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 opacity-50"></div>
                        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]" style={{ left: `${report.environmental.roadFrictionCoefficient * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-2 font-mono uppercase">
                        <span>Ice (0.1)</span>
                        <span>Wet (0.4)</span>
                        <span>Dry (0.8)</span>
                    </div>
                    <div className="text-center">
                        <div className="font-mono font-bold text-3xl text-white">{report.environmental.roadFrictionCoefficient} µ</div>
                        <div className="text-xs text-slate-400 mt-1">Derived from visual tire mark analysis</div>
                    </div>
                 </div>

                 {/* Card 3: Visibility & Contribution */}
                 <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
                     <div>
                        <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2"><Eye size={14}/> VISIBILITY LIMIT</h4>
                        <div className="text-3xl font-bold text-white">{report.environmental.visibilityDistance} <span className="text-sm font-normal text-slate-500">ft</span></div>
                        <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                             <div className="bg-slate-400 h-full" style={{ width: `${Math.min(100, (report.environmental.visibilityDistance / 1000) * 100)}%` }}></div>
                        </div>
                     </div>
                     <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2"><AlertTriangle size={14}/> FACTOR WEIGHT</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-400">{report.environmental.weatherContributionPercentage}%</span>
                            <div className="text-xs text-slate-500 leading-tight">of accident severity attributed to environment</div>
                        </div>
                     </div>
                 </div>

                 {/* Card 4: Physics Verification Tool */}
                 <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 relative overflow-hidden flex flex-col">
                     <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2"><Microscope size={14}/> HYDROPLANING VERIFIER</h4>
                     
                     <div className="bg-slate-900 p-3 rounded border border-slate-800 mb-3 flex-1">
                         <div className="flex justify-between items-center mb-1">
                             <label className="text-[10px] text-slate-400 uppercase">Tire Pressure (PSI)</label>
                             <span className="text-xs font-mono text-brand-400">{tirePressure} PSI</span>
                         </div>
                         <input 
                            type="range" min="20" max="50" step="1" 
                            value={tirePressure} onChange={(e) => setTirePressure(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer mb-2"
                         />
                         <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                             <span className="text-[10px] text-slate-400">Horne's Limit (Vp)</span>
                             <span className="font-mono font-bold text-white">{calculatedThreshold} mph</span>
                         </div>
                     </div>

                     <div className="flex justify-between items-end mb-1">
                        <div className="text-xs text-slate-400">Actual Speed</div>
                        <div className={`font-mono font-bold text-lg ${isCalculatedRisk ? 'text-red-500' : 'text-green-500'}`}>
                            {report.physics.vehicleA_speed} mph
                        </div>
                     </div>
                     
                     {isCalculatedRisk ? (
                        <div className="bg-red-900/20 border border-red-900/50 p-2 rounded text-[10px] text-red-300 text-center animate-pulse">
                            WARNING: EXCEEDS CRITICAL SPEED (Vp)
                        </div>
                     ) : (
                        <div className="bg-green-900/20 border border-green-900/50 p-2 rounded text-[10px] text-green-300 text-center">
                            WITHIN SAFE LIMITS
                        </div>
                     )}
                     <div className="text-[9px] text-slate-600 mt-2 text-center font-mono">Formula: Vp = 10.35 * √P</div>
                 </div>

              </div>
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-sm text-slate-300 italic flex gap-3 items-start">
                  <div className="mt-1 min-w-[20px]"><FileText size={14} className="text-slate-500" /></div>
                  "{report.environmental.notes}"
              </div>
           </section>
        )}

        {/* HUMAN IMPACT MODELING */}
        {report.humanImpact && (
           <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-slide-in">
              <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-900/30 rounded text-pink-400"><HeartPulse size={20} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white">HUMAN IMPACT MODELING</h3>
                    <p className="text-xs text-slate-400">Biomechanics & Injury Probability Analysis</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 
                 {/* Card 1: Physics Inputs */}
                 <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                     <h4 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2"><Gauge size={14}/> IMPACT METRICS</h4>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                           <span className="text-sm text-slate-400">Delta-V</span>
                           <span className="text-white font-mono font-bold text-lg">{report.humanImpact.deltaV} mph</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                           <span className="text-sm text-slate-400">Direction (PDOF)</span>
                           <span className="text-white font-mono text-sm">{report.humanImpact.principalDirection}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                           <span className="text-sm text-slate-400">Seatbelt Usage</span>
                           <span className={`font-bold text-sm px-2 py-0.5 rounded ${
                               report.humanImpact.seatbeltStatus === 'Confirmed' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                           }`}>
                               {report.humanImpact.seatbeltStatus.toUpperCase()}
                           </span>
                        </div>
                     </div>
                 </div>

                 {/* Card 2: Injury Probability */}
                 <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                     <h4 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2"><User size={14}/> INJURY PROBABILITY (AIS {report.humanImpact.aisScore})</h4>
                     <div className="space-y-3">
                        <div>
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-300">Cervical (Whiplash)</span>
                              <span className="text-slate-400">{report.humanImpact.injuryProbability.whiplash}%</span>
                           </div>
                           <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-orange-500 h-full" style={{ width: `${report.humanImpact.injuryProbability.whiplash}%` }}></div>
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-300">Concussion (TBI)</span>
                              <span className="text-slate-400">{report.humanImpact.injuryProbability.concussion}%</span>
                           </div>
                           <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                               <div className="bg-red-500 h-full" style={{ width: `${report.humanImpact.injuryProbability.concussion}%` }}></div>
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-300">Skeletal Fracture</span>
                              <span className="text-slate-400">{report.humanImpact.injuryProbability.fracture}%</span>
                           </div>
                           <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                               <div className="bg-red-700 h-full" style={{ width: `${report.humanImpact.injuryProbability.fracture}%` }}></div>
                           </div>
                        </div>
                     </div>
                 </div>

                 {/* Card 3: Consistency Score */}
                 <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                     <h4 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2"><CheckCircle size={14}/> MEDICAL CONSISTENCY</h4>
                     <div className="text-center mb-4">
                         <div className="text-4xl font-bold text-white mb-1">{report.humanImpact.medicalConsistency.score}%</div>
                         <div className="text-xs text-green-400 border border-green-900 bg-green-900/20 rounded-full px-2 py-0.5 inline-block">HIGHLY CONSISTENT</div>
                     </div>
                     <p className="text-xs text-slate-400 italic leading-snug border-t border-slate-800 pt-3">
                         "{report.humanImpact.medicalConsistency.rationale}"
                     </p>
                 </div>
              </div>
           </section>
        )}

      </div>
    </div>
  );
};

export default ReportViewer;
