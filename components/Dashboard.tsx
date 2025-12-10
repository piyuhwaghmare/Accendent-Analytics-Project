import React from 'react';
import { CaseFile } from '../types';
import { Plus, Search, FolderOpen, Clock, MoreVertical, Loader2, Database } from 'lucide-react';

interface DashboardProps {
  cases: CaseFile[];
  isLoading: boolean;
  onNewCase: () => void;
  onOpenCase: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cases, isLoading, onNewCase, onOpenCase }) => {
  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Case Dashboard</h2>
            <p className="text-slate-400 mt-1">Welcome back, Investigator. You have {cases.length} active cases.</p>
          </div>
          <button 
            onClick={onNewCase}
            className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-brand-900/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={20} /> New Reconstruction
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by Case ID, name, or location..." 
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>
          <select className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-600">
            <option>All Statuses</option>
            <option>Processing</option>
            <option>Admissible</option>
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Loader2 size={48} className="animate-spin mb-4 text-brand-500" />
                <p>Retrieving case files from secure database...</p>
            </div>
        ) : cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-slate-800 border-dashed rounded-xl bg-slate-900/50">
                <Database size={48} className="mb-4 opacity-50" />
                <p className="font-medium text-lg text-slate-400">No cases found</p>
                <p className="text-sm">Start a new reconstruction to generate data.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem) => (
                <div 
                key={caseItem.id}
                onClick={() => onOpenCase(caseItem.id)}
                className="group bg-slate-900 border border-slate-800 hover:border-brand-600 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/10"
                >
                <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60"></div>
                    <img 
                    src={caseItem.thumbnailUrl} 
                    alt="Crash scene" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute top-3 right-3 z-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                        caseItem.status === 'Admissible' ? 'bg-green-500/20 border-green-500/50 text-green-300' :
                        caseItem.status === 'Processing' ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' :
                        'bg-slate-500/20 border-slate-500/50 text-slate-300'
                    }`}>
                        {caseItem.status ? caseItem.status.toUpperCase() : 'UNKNOWN'}
                    </span>
                    </div>
                </div>
                
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-white group-hover:text-brand-400 transition-colors line-clamp-1">{caseItem.description}</h3>
                    <MoreVertical size={16} className="text-slate-500 hover:text-white" />
                    </div>
                    
                    <div className="text-sm text-slate-400 font-mono mb-4">{caseItem.referenceNumber}</div>
                    
                    <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <FolderOpen size={14} />
                        <span className="truncate max-w-[200px]">{caseItem.parties.plaintiff} v. {caseItem.parties.defendant}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock size={14} />
                        <span>Created {caseItem.dateCreated}</span>
                    </div>
                    </div>

                    <div className="flex items-center gap-2 text-brand-500 text-sm font-medium pt-4 border-t border-slate-800">
                    View Forensic Report <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;