import React, { useState } from 'react';
import { BookOpen, Users, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(1);

  // Tiers de usuários baseados no HumHub (adaptado para a realidade do Brasil)
  const tiers = [
    { users: 50, pricePerUser: 1.00 },
    { users: 100, pricePerUser: 0.90 },
    { users: 200, pricePerUser: 0.80 },
    { users: 500, pricePerUser: 0.60 },
    { users: 1000, pricePerUser: 0.50 },
    { users: 5000, pricePerUser: 0.30 },
    { users: 10000, pricePerUser: 0.20 }
  ];

  const currentTier = tiers[sliderIndex];
  const monthlyTotal = currentTier.users * currentTier.pricePerUser;
  const finalMonthlyTotal = isAnnual ? monthlyTotal * 0.8 : monthlyTotal; // 20% desconto anual

  const features = [
    "Acesso completo ao Marketplace de Widgets",
    "Armazenamento ilimitado em Nuvem",
    "Domínio Personalizado (*.zonaeducacional.org ou próprio)",
    "Construtor de Arrastar e Soltar",
    "Sem anúncios ou rastreamento de dados",
    "Suporte prioritário 24/7"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-teal-500/30 font-sans">
      
      {/* Navbar Minimalista */}
      <nav className="glass sticky top-0 z-50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/20">
              <BookOpen size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500 tracking-tight">Reduca</h1>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-bold text-slate-400">
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Plataforma</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors text-teal-400">Preços</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Módulos</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Recursos</span>
          </div>
          <div>
             <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">Entrar</Link>
             <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-lg transition-colors ml-2 shadow-lg shadow-teal-500/20">
               Criar Rede (Demo)
             </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-16 pb-24">
        
        {/* Header Text */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Preço simples e transparente.</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Todas as ferramentas desbloqueadas desde o primeiro dia. O valor cresce apenas quando a sua comunidade cresce.
          </p>
        </div>

        {/* HumHub Style Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          
          <div className="p-8 md:p-12 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-8">Quantos usuários sua rede terá?</h2>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white tracking-tighter">{currentTier.users}</span>
                  <span className="text-xl font-bold text-slate-400">usuários</span>
                </div>
                <div className="text-teal-400 font-bold mt-2">
                  = R$ {currentTier.pricePerUser.toFixed(2).replace('.', ',')} / usuário / mês
                </div>
              </div>
              <div className="text-slate-500 font-medium">
                Até {currentTier.users} contas de usuários ativas
              </div>
            </div>

            {/* O Slider Real */}
            <div className="relative pt-6 pb-8">
              <input 
                type="range" 
                min="0" 
                max={tiers.length - 1} 
                step="1"
                value={sliderIndex}
                onChange={(e) => setSliderIndex(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500 relative z-10"
              />
              
              {/* Marcas do Slider */}
              <div className="flex justify-between text-xs font-bold text-slate-500 mt-4 px-1">
                {tiers.map((t, i) => (
                  <span key={i} className={`cursor-pointer transition-colors hover:text-teal-400 ${sliderIndex === i ? 'text-teal-400 scale-110' : ''}`} onClick={() => setSliderIndex(i)}>
                    {t.users >= 1000 ? `${t.users/1000}k` : t.users}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Seção Inferior: Estimativa e Toggle */}
          <div className="bg-slate-800/30 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Estimativa Atual</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">R$ {finalMonthlyTotal.toFixed(2).replace('.', ',')}</span>
                  <span className="text-slate-400 font-medium">/ mês</span>
                </div>
              </div>
              
              {/* Toggle Mensal/Anual */}
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Mensal</span>
                <button 
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="w-12 h-6 rounded-full bg-slate-700 relative transition-colors duration-300"
                >
                  <div className={`w-4 h-4 bg-teal-500 rounded-full absolute top-1 transition-all duration-300 ${isAnnual ? 'left-7' : 'left-1'}`}></div>
                </button>
                <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
                  Anual <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full uppercase tracking-wider">20% Off</span>
                </span>
              </div>
            </div>

            <button className="w-full md:w-auto bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 group">
              Próximo Passo
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>

        {/* O que está incluso */}
        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Todos os planos incluem:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-teal-500/20">
                  <Check size={16} className="text-teal-500" />
                </div>
                <span className="text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
