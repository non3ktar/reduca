import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { availableWidgets } from './widgets/registry';
import WidgetCustom from './widgets/WidgetCustom';
import WidgetArtigos from './widgets/WidgetArtigos';
import WidgetCalendario from './widgets/WidgetCalendario';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Sidebar({ currentUser }) {
  const [activeWidgets, setActiveWidgets] = useState(['quem-seguir']);
  const [customWidgets, setCustomWidgets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    // Check if user is admin
    supabase.from('profiles').select('is_admin').eq('id', currentUser.id).single().then(({ data }) => {
      if (data && data.is_admin) setIsAdmin(true);
    });

    supabase.from('user_settings').select('active_widgets').eq('user_id', currentUser.id).single().then(({ data }) => {
      if (data && data.active_widgets) setActiveWidgets(data.active_widgets);
    });

    supabase.from('custom_widgets').select('*').eq('user_id', currentUser.id).then(({ data }) => {
      if (data) setCustomWidgets(data);
    });

  }, [currentUser]);

  return (
    <aside className="space-y-6 hidden md:block">
      <WidgetCalendario currentUser={currentUser} isAdmin={isAdmin} />
      <WidgetArtigos isAdmin={isAdmin} />
      <AnimatePresence>
        {activeWidgets.map(widgetId => {
          const WidgetDefinition = availableWidgets.find(w => w.id === widgetId);
          if (WidgetDefinition) {
            const WidgetComponent = WidgetDefinition.component;
            return <WidgetComponent key={widgetId} currentUser={currentUser} isAdmin={isAdmin} />;
          }
          
          const customWidget = customWidgets?.find(cw => cw.id === widgetId);
          if (customWidget) {
            return <WidgetCustom key={widgetId} widgetData={customWidget} />;
          }
          
          return null;
        })}
      </AnimatePresence>

      <div className="glass-card p-5 border border-slate-700/50">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Marketplace</h3>
        <p className="text-xs text-slate-400 mb-4">Adicione ou remova widgets do seu painel lateral.</p>
        {isAdmin && (
          <>
            <Link to="/marketplace" className="w-full bg-slate-800/80 hover:bg-slate-700 text-center text-slate-300 hover:text-white px-4 py-2 rounded-xl transition block border border-slate-600/50 shadow-lg mb-3">
              Gerenciar Widgets
            </Link>
            <Link to="/admin" className="w-full bg-red-900/20 hover:bg-red-900/40 text-center text-red-400 hover:text-red-300 px-4 py-2 rounded-xl transition block border border-red-900/50 shadow-lg">
              Área do Admin
            </Link>
          </>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-slate-500 space-y-2 pb-6">
        <div className="flex justify-center gap-4">
          <Link to="/terms" className="hover:text-slate-800 transition-colors">Termos de Uso</Link>
          <Link to="/privacy" className="hover:text-slate-800 transition-colors">Política de Privacidade</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Reduc</p>
      </div>
    </aside>
  );
}
