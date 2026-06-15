import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ShieldAlert, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin({ user }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalWidgets, setGlobalWidgets] = useState([]);

  useEffect(() => {
    // Check if user is admin
    supabase.from('profiles').select('is_admin').eq('id', user.id).single().then(({ data }) => {
      if (data && data.is_admin) {
        setIsAdmin(true);
        fetchGlobalWidgets();
      }
      setLoading(false);
    });
  }, [user.id]);

  const fetchGlobalWidgets = async () => {
    // For now we just fetch custom_widgets that belong to the admin
    const { data } = await supabase.from('custom_widgets').select('*').eq('user_id', user.id);
    if (data) setGlobalWidgets(data);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-500">Verificando credenciais...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-black mb-2">Acesso Negado</h1>
        <p className="text-slate-400 mb-6">Você não tem permissão de Superusuário para acessar esta área.</p>
        <button onClick={() => navigate('/')} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-bold">Voltar ao Início</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 md:px-12 max-w-4xl mx-auto relative">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-700/50 pb-6">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-black glass p-2 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-red-500 flex items-center gap-2">
            <ShieldAlert size={28} /> Painel Administrativo
          </h1>
          <p className="text-slate-400">Gerenciamento global da plataforma Reduc</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-red-500/30 shadow-lg shadow-red-500/10">
          <h2 className="text-xl font-bold text-black mb-2">Moderação em Breve</h2>
          <p className="text-slate-400 text-sm">Aqui você poderá apagar posts de qualquer usuário e banir contas que quebrarem as regras.</p>
        </div>

        <div className="glass-card p-6 border-orange-500/30">
          <h2 className="text-xl font-bold text-black mb-4">Seus Widgets Globais</h2>
          <p className="text-slate-400 text-sm mb-4">Os widgets criados por você no Marketplace servem como base para a plataforma.</p>
          <div className="space-y-3 mb-6">
            {globalWidgets.map(w => (
              <div key={w.id} className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-black/10">
                <span className="text-sm font-bold text-black">{w.title}</span>
                <span className="text-xs px-2 py-1 bg-red-500/20 text-red-600 font-bold rounded-md">Global</span>
              </div>
            ))}
            {globalWidgets.length === 0 && <p className="text-xs text-slate-500">Nenhum widget criado ainda na Nuvem.</p>}
          </div>
          <button onClick={() => navigate('/marketplace')} className="w-full bg-black hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition shadow-lg">
            Ir para o Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}
