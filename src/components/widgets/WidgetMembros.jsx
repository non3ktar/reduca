import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Users, BadgeCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function WidgetMembros() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });
        
      if (data) {
        setMembers(data);
      }
    };

    fetchMembers();

    // Subscribe to new members
    const channel = supabase.channel('realtime-profiles-widget')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-5 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
          <Users size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-200">Membros da Rede</h3>
          <p className="text-xs text-slate-400">{members.length} participantes</p>
        </div>
      </div>

      <div className="space-y-2">
        {members.map(member => (
          <Link 
            to={`/profile/${member.id}`} 
            key={member.id}
            className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-xl transition-colors group"
          >
            <div className="relative">
              <img 
                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email || member.id}`} 
                alt={member.name} 
                className="w-10 h-10 rounded-full border border-slate-700 group-hover:border-orange-500 transition-colors object-cover bg-slate-900" 
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-200 truncate flex items-center gap-1 group-hover:text-orange-400 transition-colors">
                {member.name}
                {member.is_verified && <BadgeCheck size={14} className="fill-blue-500 text-white flex-shrink-0" title="Verificado" />}
              </h4>
              <p className="text-xs text-slate-500 truncate">{member.role || 'Professor(a)'}</p>
            </div>
            <ChevronRight size={16} className="text-slate-600 group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </Link>
        ))}
        {members.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-4">Carregando membros...</p>
        )}
      </div>
    </motion.div>
  );
}
