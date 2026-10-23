import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dial' | 'compare' | 'logs' | 'timer' | 'guide';
  onSelectTab: (tab: 'dial' | 'compare' | 'logs' | 'timer' | 'guide') => void;
  onOpenNewLog: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onOpenNewLog }) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('dial')}
          className="text-xl font-extrabold tracking-tight text-stone-900 whitespace-nowrap shrink-0 text-left hover:opacity-85 transition-opacity"
        >
          Clik <span className="text-amber-800 font-medium text-sm ml-1">M40 & LEnodi</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('dial')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'dial' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            หมุนคลิกบด
          </button>
          <button
            onClick={() => onSelectTab('compare')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'compare' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            เทียบ 2 เครื่อง
          </button>
          <button
            onClick={() => onSelectTab('logs')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'logs' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            สมุดบันทึกชง
          </button>
          <button
            onClick={() => onSelectTab('timer')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'timer' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            ตัวจับเวลา
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'guide' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            ตารางอ้างอิง
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewLog}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>บันทึกชงใหม่</span>
          </button>
        </div>
      </div>
    </header>
  );
};
