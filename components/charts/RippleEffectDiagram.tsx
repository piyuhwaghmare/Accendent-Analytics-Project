
import React from 'react';
import { ArrowRight, Zap, Target } from 'lucide-react';
import { RippleSequenceItem } from '../../types';

interface RippleEffectDiagramProps {
  sequence: RippleSequenceItem[];
  origin: string;
}

const RippleEffectDiagram: React.FC<RippleEffectDiagramProps> = ({ sequence, origin }) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-6 relative overflow-hidden">
      <div className="absolute top-2 right-2 text-xs font-mono text-slate-500">FIG 2.0 - KINETIC PROPAGATION</div>
      
      <div className="flex flex-col items-center justify-center space-y-8 min-h-[250px]">
        
        {/* Origin Badge */}
        <div className="flex items-center gap-2 mb-4">
            <span className="text-xs uppercase tracking-widest text-forensic-red font-bold">Fault Origin</span>
            <div className="px-3 py-1 bg-red-900/30 border border-red-800 rounded text-red-400 font-mono text-sm">
                {origin}
            </div>
        </div>

        {/* Chain Reaction Flow */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
            {sequence.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {/* Node: Source */}
                    {index === 0 && (
                        <div className="relative group">
                             <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center z-10 relative shadow-xl">
                                <span className="text-xs font-bold text-slate-300 text-center px-1">{item.source}</span>
                             </div>
                             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 whitespace-nowrap">Initial Impact</div>
                        </div>
                    )}

                    {/* Arrow / Connection */}
                    <div className="flex flex-col items-center px-2">
                        <div className="text-[10px] font-mono text-forensic-orange mb-1">{item.forceEstimate}</div>
                        <div className="relative">
                            <div className="h-1 w-20 bg-gradient-to-r from-slate-600 to-slate-800 rounded"></div>
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-950 p-1 rounded-full border border-slate-700">
                                <Zap size={12} className="text-yellow-500 fill-current" />
                            </div>
                        </div>
                        <div className="text-[9px] text-slate-500 mt-1 max-w-[80px] text-center">{item.damageDescription}</div>
                    </div>

                    {/* Node: Target */}
                    <div className="relative group">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 relative shadow-xl border-2 ${
                            index === sequence.length - 1 ? 'bg-slate-800 border-slate-600' : 'bg-slate-800 border-slate-600'
                        }`}>
                            <span className="text-xs font-bold text-slate-300 text-center px-1">{item.target}</span>
                        </div>
                         {index === sequence.length - 1 && (
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 whitespace-nowrap">Resting Position</div>
                         )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Legend / Overlay */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-600"></div> Vehicle Node
        </div>
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Energy Transfer
        </div>
      </div>
    </div>
  );
};

export default RippleEffectDiagram;
