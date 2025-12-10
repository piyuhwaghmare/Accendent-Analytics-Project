
import React, { useState } from 'react';
import { LayoutDashboard, FileText, Settings, LogOut, Shield, Globe, MapPin, Camera, Menu, X } from 'lucide-react';
import { AppView } from '../types';
import { UserSession } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  jurisdiction: string;
  onJurisdictionChange: (value: string) => void;
  onLogout: () => void;
  user: UserSession | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, jurisdiction, onJurisdictionChange, onLogout, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3 text-brand-500">
            <Shield size={28} className="fill-current" />
            <div className="font-bold text-white text-lg tracking-tight leading-none">
              Accident<br/>Analytics
            </div>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 pt-2 pb-0 md:hidden">
            <div className="text-[10px] text-slate-500 font-mono tracking-widest">v2.0 FORENSIC SUITE</div>
        </div>

        <div className="p-4">
          <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
             <MapPin size={10} /> Legal Jurisdiction
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500" size={14} />
            <select
              value={jurisdiction}
              onChange={(e) => onJurisdictionChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 hover:border-brand-600 text-slate-200 text-sm rounded-lg pl-9 pr-8 py-2.5 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none appearance-none transition-colors cursor-pointer"
            >
              <option value="California">California (USA)</option>
              <option value="New York">New York (USA)</option>
              <option value="Texas">Texas (USA)</option>
              <option value="Florida">Florida (USA)</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="European Union">European Union</option>
              <option value="International">International / General</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 px-1 leading-tight">
            Analysis and liability citations will be based on the selected region's vehicle codes.
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto">
          <div className="h-px bg-slate-800 mx-2 mb-4"></div>
          
          <button 
            onClick={() => handleNav(AppView.DASHBOARD)} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeView === AppView.DASHBOARD 
                ? 'bg-brand-900/50 text-brand-400 border border-brand-800' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          
          <button 
            onClick={() => handleNav(AppView.AR_MODE)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeView === AppView.AR_MODE
                ? 'bg-brand-900/50 text-brand-400 border border-brand-800' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Camera size={18} />
            AR Field Kit
            <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50">LIVE</span>
          </button>

          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-slate-400 hover:bg-slate-800 hover:text-white`}
          >
            <FileText size={18} />
            My Reports
          </button>

          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-slate-400 hover:bg-slate-800 hover:text-white`}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white tracking-wider shrink-0">
               {user ? getInitials(user.name) : 'UNK'}
            </div>
            <div className="text-sm overflow-hidden">
              <div className="text-white truncate font-medium">{user ? user.name : 'Unknown User'}</div>
              <div className="text-slate-500 text-[10px] uppercase font-mono truncate">
                 {user?.agencyId ? user.agencyId : 'ID: PENDING'}
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2 text-brand-500">
                <Shield size={20} className="fill-current" />
                <span className="font-bold text-white">AccidentAnalytics</span>
            </div>
            <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-slate-300 hover:text-white p-1"
            >
                <Menu size={24} />
            </button>
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default Layout;
