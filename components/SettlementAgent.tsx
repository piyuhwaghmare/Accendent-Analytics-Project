
import React, { useState } from 'react';
import { AnalysisReport, SettlementStrategy } from '../types';
import { Check, Mail, ChevronRight, FileText, Calculator, Send, AlertTriangle, ArrowRight, X } from 'lucide-react';

interface SettlementAgentProps {
  report: AnalysisReport;
  onClose: () => void;
  caseRef: string;
}

const SettlementAgent: React.FC<SettlementAgentProps> = ({ report, onClose, caseRef }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  
  const strategy = report.settlementStrategy;

  if (!strategy) {
      return (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
              <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 text-center">
                  <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
                  <h2 className="text-xl font-bold text-white mb-2">Settlement Data Unavailable</h2>
                  <p className="text-slate-400 mb-6">AI has not generated a settlement strategy for this case yet.</p>
                  <button onClick={onClose} className="bg-slate-700 text-white px-4 py-2 rounded">Close</button>
              </div>
          </div>
      );
  }

  const steps = [
    { id: 0, label: 'Policy Parser', icon: FileText },
    { id: 1, label: 'Settlement Calc', icon: Calculator },
    { id: 2, label: 'Demand Letter', icon: FileText },
    { id: 3, label: 'Email Action', icon: Mail },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1);
  };

  const handleSendEmail = () => {
      setEmailSent(true);
      setTimeout(() => {
         onClose();
      }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in">
      
      {/* Container */}
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-brand-600 flex items-center justify-center">
                     <Calculator size={18} className="text-white" />
                 </div>
                 <div>
                     <h2 className="font-bold text-white">Settlement Agent v1.0</h2>
                     <p className="text-xs text-slate-400 font-mono">AUTOMATED NEGOTIATION WORKFLOW</p>
                 </div>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        {/* Stepper */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
            {steps.map((step, idx) => (
                <div 
                    key={step.id} 
                    className={`flex-1 p-4 flex items-center justify-center gap-2 border-r border-slate-800 last:border-0 transition-colors
                    ${activeStep === step.id ? 'bg-slate-800 text-brand-400' : 'text-slate-500'}
                    ${activeStep > step.id ? 'text-green-500' : ''}
                    `}
                >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                         ${activeStep === step.id ? 'bg-brand-900 text-brand-400' : 
                           activeStep > step.id ? 'bg-green-900 text-green-400' : 'bg-slate-800'}
                    `}>
                        {activeStep > step.id ? <Check size={14} /> : idx + 1}
                    </div>
                    <span className="font-medium text-sm">{step.label}</span>
                </div>
            ))}
        </div>

        {/* Body */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-900">
            
            {/* STEP 1: POLICY PARSER */}
            {activeStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-in">
                     <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-2 bg-red-900/20 text-red-400 text-xs font-bold rounded-bl">DEFENDANT (AT-FAULT)</div>
                        <h3 className="text-lg font-bold text-white mb-4">Vehicle A Policy</h3>
                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Carrier</span>
                                <span className="text-slate-200">{strategy.policies.vehicleA.carrier}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Policy #</span>
                                <span className="text-slate-200">{strategy.policies.vehicleA.policyNumber}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">BI Limit</span>
                                <span className="text-slate-200">${strategy.policies.vehicleA.limitBodilyInjury.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">PD Limit</span>
                                <span className="text-slate-200">${strategy.policies.vehicleA.limitPropertyDamage.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className="text-green-400">{strategy.policies.vehicleA.status}</span>
                            </div>
                        </div>
                     </div>

                     <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-2 bg-blue-900/20 text-blue-400 text-xs font-bold rounded-bl">PLAINTIFF (VICTIM)</div>
                        <h3 className="text-lg font-bold text-white mb-4">Vehicle B Policy</h3>
                         <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Carrier</span>
                                <span className="text-slate-200">{strategy.policies.vehicleB.carrier}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Policy #</span>
                                <span className="text-slate-200">{strategy.policies.vehicleB.policyNumber}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Deductible</span>
                                <span className="text-red-400">-${strategy.policies.vehicleB.deductible}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className="text-green-400">{strategy.policies.vehicleB.status}</span>
                            </div>
                        </div>
                     </div>
                </div>
            )}

            {/* STEP 2: CALCULATOR */}
            {activeStep === 1 && (
                <div className="flex flex-col items-center justify-center h-full animate-slide-in">
                    <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 p-8 rounded-xl shadow-inner">
                        <div className="flex justify-between items-center mb-6 text-xl">
                            <span className="text-slate-400">Total Validated Damages</span>
                            <span className="text-white font-mono font-bold">${strategy.calculation.totalDamages.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-xl text-red-400">
                             <span className="flex items-center gap-2"> <ArrowRight size={20} className="rotate-45"/> Liability Adjustment ({report.liability.plaintiffPercentage}%)</span>
                             <span className="font-mono font-bold">-${strategy.calculation.liabilityAdjustment.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-px bg-slate-700 my-4"></div>
                        <div className="flex justify-between items-center text-3xl font-bold">
                            <span className="text-brand-400">Final Settlement Offer</span>
                            <span className="text-brand-400 font-mono">${strategy.calculation.finalOffer.toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="mt-8 text-slate-500 text-sm max-w-xl text-center">
                        * Calculation based on pure comparative negligence standards for {report.liability.codeCited}.
                        Deductibles are handled via inter-company subrogation.
                    </p>
                </div>
            )}

            {/* STEP 3: DEMAND LETTER */}
            {activeStep === 2 && (
                <div className="h-full flex flex-col animate-slide-in">
                    <div className="bg-white text-slate-900 p-8 rounded-lg shadow-lg font-serif leading-relaxed flex-1 overflow-y-auto">
                        <div className="text-right mb-8">
                            <p>{new Date().toLocaleDateString()}</p>
                            <p>{strategy.demandLetter.recipient}</p>
                        </div>
                        <p className="font-bold mb-4">RE: DEMAND FOR SETTLEMENT - {caseRef}</p>
                        <p className="whitespace-pre-wrap">{strategy.demandLetter.content}</p>
                        <br/>
                        <p>Sincerely,</p>
                        <p>AI Settlement Agent</p>
                    </div>
                </div>
            )}

            {/* STEP 4: EMAIL */}
            {activeStep === 3 && (
                 <div className="h-full flex flex-col items-center justify-center animate-slide-in">
                    {!emailSent ? (
                        <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
                            <div className="bg-slate-900 p-3 border-b border-slate-700 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="ml-4 text-xs text-slate-400">Draft: {strategy.emailDraft.subject}</span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex border-b border-slate-700 pb-2">
                                    <span className="w-16 text-slate-400 text-sm">To:</span>
                                    <span className="text-white text-sm">{strategy.emailDraft.to}</span>
                                </div>
                                <div className="flex border-b border-slate-700 pb-2">
                                    <span className="w-16 text-slate-400 text-sm">Subject:</span>
                                    <span className="text-white text-sm">{strategy.emailDraft.subject}</span>
                                </div>
                                <div className="pt-2 text-slate-300 text-sm whitespace-pre-wrap font-sans">
                                    {strategy.emailDraft.body}
                                </div>
                                <div className="pt-4 flex items-center gap-2">
                                    <div className="px-3 py-1 bg-slate-700 rounded text-xs text-slate-300 flex items-center gap-1">
                                        <FileText size={12}/> Forensic_Report.pdf
                                    </div>
                                    <div className="px-3 py-1 bg-slate-700 rounded text-xs text-slate-300 flex items-center gap-1">
                                        <FileText size={12}/> Demand_Letter.pdf
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-4 border-t border-slate-700 flex justify-end">
                                <button 
                                    onClick={handleSendEmail}
                                    className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded flex items-center gap-2 transition-all"
                                >
                                    <Send size={16} /> Send Demand Package
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center animate-scale-in">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                <Check size={40} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Demand Package Sent!</h2>
                            <p className="text-slate-400">Carrier notified. Tracking pixel activated.</p>
                        </div>
                    )}
                 </div>
            )}

        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-end">
            {activeStep < 3 && (
                <button 
                    onClick={handleNext}
                    className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                    Next Step <ChevronRight size={18} />
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default SettlementAgent;
