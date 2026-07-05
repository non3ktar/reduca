import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import AppDrawer from '../components/AppDrawer';
import Sidebar from '../components/Sidebar';

export default function KolibriView({ user }) {
  const [loading, setLoading] = useState(true);

  // URL Temporária (Demo Pública do Kolibri). 
  // No futuro, trocaremos para a URL do VPS
  const kolibriUrl = "https://kolibri-demo.learningequality.org/";

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 flex flex-col h-screen">
      {/* Navbar Desktop */}
      <nav className="fixed top-0 w-full glass z-50 hidden md:block border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-500 hover:opacity-80 transition">Reduca</Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-2">
              <ArrowLeft size={20} /> Voltar
            </Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700/50">
              <ThemeToggle />
              <div className="ml-2 pl-4 border-l border-slate-700/50 flex items-center">
                <AppDrawer />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Topbar Mobile */}
      <div className="md:hidden flex justify-between items-center glass-card p-4 mx-4 mt-4 mb-2 shrink-0">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition text-slate-300">
          <ArrowLeft size={20} /> Voltar
        </Link>
        <div className="flex gap-3 items-center">
          <ThemeToggle />
          <div className="pr-1"><AppDrawer /></div>
        </div>
      </div>

      {/* Main Content - Full Height Iframe */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 overflow-hidden">
        
        {/* Kolibri Container */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden border border-slate-700/50 shadow-2xl relative">
          
          {/* Cabecalho Interno */}
          <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                <BookOpen size={24} />
              </div>
              <div>
                <h1 className="font-bold text-slate-200 text-lg leading-tight">Acervo Educacional</h1>
                <p className="text-xs text-slate-400">Plataforma Kolibri Integrada</p>
              </div>
            </div>
            
            <a 
              href={kolibriUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-orange-500 p-2 glass rounded-full transition flex items-center gap-2 text-sm font-medium"
              title="Abrir em Nova Aba"
            >
              <ExternalLink size={18} />
              <span className="hidden sm:inline">Nova Aba</span>
            </a>
          </div>

          {/* Iframe Area */}
          <div className="relative flex-1 w-full bg-white overflow-hidden rounded-b-2xl">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 rounded-b-2xl">
                 <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                 <p className="text-slate-400 font-medium animate-pulse">Conectando ao Kolibri...</p>
              </div>
            )}
            
            <iframe
              src={kolibriUrl}
              title="Plataforma Kolibri"
              className="w-full h-full border-0 absolute inset-0 z-20"
              onLoad={() => setLoading(false)}
              allowFullScreen
            />
          </div>
        </div>

        {/* Optional Sidebar on Desktop */}
        <div className="hidden lg:block w-[320px] overflow-y-auto pr-2 pb-6 custom-scrollbar shrink-0">
          <Sidebar currentUser={user} />
        </div>
        
      </main>
    </div>
  );
}
