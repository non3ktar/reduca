import React from 'react';
import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WidgetKialo() {
  return (
    <div className="glass-card p-5 border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 relative overflow-hidden group mb-4">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 text-white shrink-0">
          <Scale size={24} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-50 mb-1">Sala de Debates</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Participe de discussões interativas guiadas na rede.
          </p>
          <Link 
            to="/debates"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-50 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors border border-slate-700/50"
          >
            Acessar Kialo
          </Link>
        </div>
      </div>
    </div>
  );
}
