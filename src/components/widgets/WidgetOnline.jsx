import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Radio, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function WidgetOnline() {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const channel = supabase.channel('online-users');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = [];
        
        // Supabase presenceState returns an object with arrays of presences per key
        for (const id in state) {
          // Cada id tem um array de conexões (se a pessoa abrir em duas abas, terão duas presenças aqui)
          // Pegamos a primeira presença para exibir os dados
          if (state[id].length > 0) {
            users.push(state[id][0]);
          }
        }
        
        setOnlineUsers(users);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-5 relative"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg relative">
          <Radio size={20} className="animate-pulse" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
        </div>
        <div>
          <h3 className="font-bold text-slate-200">Online Agora</h3>
          <p className="text-xs text-slate-400">
            {onlineUsers.length} {onlineUsers.length === 1 ? 'membro' : 'membros'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {onlineUsers.map(member => (
          <Link 
            to={`/profile/${member.user_id}`} 
            key={member.user_id}
            className="relative group transition-transform hover:scale-110 hover:z-10"
          >
            <div className="relative">
              <img 
                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_id}`} 
                alt={member.name} 
                className="w-12 h-12 rounded-full border-2 border-emerald-500/50 group-hover:border-emerald-500 transition-all object-cover bg-slate-900 shadow-sm" 
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
            </div>
            
            {/* Tooltip Customizado */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-200 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 flex items-center gap-1 font-medium z-50">
              {member.name}
              {member.is_verified && <BadgeCheck size={12} className="fill-blue-500 text-white" />}
            </div>
          </Link>
        ))}
        {onlineUsers.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-4 w-full">Ninguém online no momento.</p>
        )}
      </div>
    </motion.div>
  );
}
