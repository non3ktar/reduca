import React, { useState } from 'react';
import { Check, X, BookOpen, Smartphone, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "STARTER",
      desc: "A melhor opção para testar a funcionalidade da plataforma e entender o básico.",
      monthlyPrice: 29.90,
      annualPrice: 24.90,
      members: "Até 100",
      storage: "2 GB",
      features: [true, true, false, false, false, false, false],
      popular: false,
      buttonColor: "bg-slate-700 hover:bg-slate-600"
    },
    {
      name: "ESSENCIAL",
      desc: "A maneira mais simples de configurar uma rede social para sua sala de aula.",
      monthlyPrice: 89.90,
      annualPrice: 71.90,
      members: "Até 500",
      storage: "10 GB",
      features: [true, true, true, false, false, false, false],
      popular: false,
      buttonColor: "bg-slate-700 hover:bg-slate-600"
    },
    {
      name: "PERFORMANCE",
      desc: "Ferramentas que você precisa para personalizar sua rede com flexibilidade.",
      monthlyPrice: 199.90,
      annualPrice: 159.90,
      members: "Até 2.000",
      storage: "50 GB",
      features: [true, true, true, true, true, false, false],
      popular: true,
      buttonColor: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 border-none text-white"
    },
    {
      name: "ULTIMATE",
      desc: "Solução ideal com complementos premium, monetização e aplicativos nativos.",
      monthlyPrice: 399.90,
      annualPrice: 319.90,
      members: "Até 10.000",
      storage: "100 GB+",
      features: [true, true, true, true, true, true, true],
      popular: false,
      buttonColor: "bg-slate-700 hover:bg-slate-600"
    }
  ];

  const featureList = [
    "Subdomínio *.zonaeducacional.org",
    "Widgets Básicos (Feed, Calendário)",
    "Construtor de Arrastar & Soltar",
    "Domínio Próprio (www.escola.com)",
    "Widgets Premium (Audiobook, E-commerce)",
    "Ferramentas de Analytics e SEO",
    "Geração de App Nativo (APK e Desktop)"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-orange-500/30">
      
      {/* Navbar Minimalista */}
      <nav className="glass sticky top-0 z-50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/20">
              <BookOpen size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 tracking-tight">Reduca</h1>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Características</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors text-orange-500">Preços</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Plataforma</span>
          </div>
          <div>
             <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">Entrar</Link>
             <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors ml-2 shadow-lg shadow-orange-500/20">
               Criar uma rede
             </button>
          </div>
        </div>
      </nav>

      {/* Header Preços */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Crie sua própria rede social educacional.</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Você está quase terminando! Comece com <span className="text-orange-500 font-bold">14 dias totalmente gratuitos</span> em qualquer plano. Sem compromisso.
        </p>

        {/* Toggle Mensal/Anual */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="bg-slate-900 p-1 rounded-full inline-flex border border-slate-800 shadow-inner relative">
             <button 
                onClick={() => setIsAnnual(false)}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
                Mensal
             </button>
             <button 
                onClick={() => setIsAnnual(true)}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all ${isAnnual ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
                Anual
             </button>
             <div 
                className={`absolute top-1 bottom-1 w-[50%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300 ease-out shadow-md`}
                style={{ left: isAnnual ? '49%' : '1%' }}
             />
          </div>
          {isAnnual && <span className="text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full animate-pulse border border-green-500/20">Guarde 20% com uma assinatura anual!</span>}
        </div>
      </div>

      {/* Tabela Comparativa Estilo Ning */}
      <div className="max-w-7xl mx-auto px-4 pb-24 overflow-x-auto">
        <div className="min-w-[800px]">
          
          {/* Header dos Cards */}
          <div className="grid grid-cols-5 gap-0 border-b-4 border-slate-800">
             <div className="p-6"></div> {/* Coluna vazia para labels */}
             
             {plans.map((plan, i) => (
                <div key={i} className={`p-6 text-center border-t-4 border-l border-r border-slate-800/50 bg-slate-900/40 relative ${plan.popular ? 'border-t-orange-500 bg-slate-800/60 shadow-2xl scale-105 z-10' : 'border-t-transparent'}`}>
                  {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full shadow-lg">Popular</div>}
                  <h3 className="text-xl font-black text-white mb-4 tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 h-16">{plan.desc}</p>
                  <button className={`w-full py-2 rounded-full font-bold text-sm mb-6 border border-slate-600 transition-all ${plan.buttonColor}`}>
                    Teste sem custo
                  </button>
                  <div className="flex items-end justify-center gap-1 mb-2">
                     <span className="text-3xl font-black text-white">R${isAnnual ? plan.annualPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}</span>
                     <span className="text-sm font-bold text-slate-500 mb-1">/mês</span>
                  </div>
                  {isAnnual && <div className="text-[10px] text-slate-500 uppercase tracking-wide">Faturado Anualmente</div>}
                </div>
             ))}
          </div>

          {/* Dados e Limites */}
          <div className="grid grid-cols-5 border-b border-slate-800/50">
             <div className="p-4 flex items-center text-sm font-bold text-slate-300">Membros</div>
             {plans.map((plan, i) => <div key={i} className={`p-4 text-center text-sm text-slate-400 border-l border-slate-800/50 ${plan.popular ? 'bg-slate-800/20' : ''}`}>{plan.members}</div>)}
          </div>
          <div className="grid grid-cols-5 border-b border-slate-800/50 bg-slate-900/20">
             <div className="p-4 flex items-center text-sm font-bold text-slate-300">Armazenamento</div>
             {plans.map((plan, i) => <div key={i} className={`p-4 text-center text-sm text-slate-400 border-l border-slate-800/50 ${plan.popular ? 'bg-slate-800/20' : ''}`}>{plan.storage}</div>)}
          </div>

          {/* Seção Features */}
          <div className="grid grid-cols-5 bg-slate-900">
             <div className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Features Core</div>
             <div className="p-4 text-center text-xs font-black text-slate-500 uppercase tracking-widest border-l border-slate-800/50">Starter</div>
             <div className="p-4 text-center text-xs font-black text-slate-500 uppercase tracking-widest border-l border-slate-800/50">Essencial</div>
             <div className="p-4 text-center text-xs font-black text-slate-500 uppercase tracking-widest border-l border-slate-800/50">Performance</div>
             <div className="p-4 text-center text-xs font-black text-slate-500 uppercase tracking-widest border-l border-slate-800/50">Ultimate</div>
          </div>

          {featureList.map((feature, featureIndex) => (
             <div key={featureIndex} className={`grid grid-cols-5 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${featureIndex % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                <div className="p-4 flex items-center text-sm text-slate-300">{feature}</div>
                {plans.map((plan, planIndex) => (
                   <div key={planIndex} className={`p-4 flex items-center justify-center border-l border-slate-800/50 ${plan.popular ? 'bg-slate-800/20' : ''}`}>
                      {plan.features[featureIndex] ? (
                         <Check size={20} className="text-green-500" />
                      ) : (
                         <span className="text-slate-600 font-bold text-xl">-</span>
                      )}
                   </div>
                ))}
             </div>
          ))}

          {/* Bottom Action */}
          <div className="grid grid-cols-5 mt-8">
             <div></div>
             {plans.map((plan, i) => (
                <div key={i} className="p-4 text-center">
                  <button className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                    Assinar {plan.name}
                  </button>
                </div>
             ))}
          </div>

        </div>
      </div>
      
    </div>
  );
}
