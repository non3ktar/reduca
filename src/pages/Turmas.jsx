import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Link as LinkIcon, Mail, Hash, Users, 
  MoreHorizontal, Copy, Trash2, ShieldAlert, CheckCircle2,
  GraduationCap, Sparkles, LayoutDashboard, MonitorPlay
} from 'lucide-react';

export default function Turmas({ user }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [className, setClassName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState([
    { id: 1, name: user?.user_metadata?.name || 'Professor', email: user?.email, role: 'Admin da turma', avatar: user?.user_metadata?.avatar_url }
  ]);

  const handleContinue = () => {
    if (className.trim() !== '') {
      setStep(2);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://reduca.com/invite/t/${Math.random().toString(36).substring(7)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    setStep(3);
  };

  // Variações de animação para os painéis
  const panelVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
  };

  const renderStep1 = () => (
    <div className="flex h-screen bg-slate-50 dark:bg-[#1A1B23] text-slate-800 dark:text-white overflow-hidden">
      {/* Esquerda - Formulário */}
      <motion.div 
        className="w-full lg:w-5/12 flex flex-col p-8 sm:p-12 z-10"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-12 w-fit transition">
          <ChevronLeft size={20} className="mr-1" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold mb-4">Criar uma turma</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm leading-relaxed">
          Com as turmas, fica mais fácil compartilhar e atribuir aulas, atividades e designs aos seus alunos.
        </p>

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Escolha um nome para a turma</label>
          <input 
            type="text" 
            placeholder="Ex: História do 5º ano" 
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full bg-white dark:bg-[#1A1B23] border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition shadow-sm dark:shadow-none"
          />
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Pode ser o nome de uma matéria ou de uma turma sua.</p>
        </div>

        <button 
          onClick={handleContinue}
          disabled={!className.trim()}
          className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded-xl transition shadow-md disabled:shadow-none"
        >
          Continuar
        </button>
      </motion.div>

      {/* Direita - Ilustração (Gradient + Card) */}
      <div className="hidden lg:flex w-7/12 bg-gradient-to-br from-[#2DD4BF] to-[#0284C7] items-center justify-center relative p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 w-full max-w-lg"
        >
          {/* Decoração Flutuante */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-12 -left-12 text-6xl drop-shadow-xl z-20"
          >
            🍎
          </motion.div>
          
          {/* Card Principal */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Users size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ambiente de Ensino</h2>
              <p className="text-white/80">Organize seus alunos, acompanhe o progresso e crie experiências interativas incríveis em um só lugar.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex h-screen bg-slate-50 dark:bg-[#1A1B23] text-slate-800 dark:text-white overflow-hidden">
      {/* Esquerda - Formulário */}
      <motion.div 
        className="w-full lg:w-5/12 flex flex-col p-8 sm:p-12 z-10 border-r border-slate-200 dark:border-slate-800 overflow-y-auto"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button onClick={() => setStep(1)} className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-8 w-fit transition">
          <ChevronLeft size={20} className="mr-1" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Convide <span className="text-[#8B5CF6]">pessoas</span> para a sua turma</h1>
        </button>

        <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm leading-relaxed">
          Você pode convidar qualquer pessoa da sua escola. Se essa pessoa ainda não estiver no Reduca, o seu convite dará a ela acesso grátis.
        </p>

        {/* Via Link */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Convidar via link</label>
          <button 
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl transition shadow-md ${
              copied ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white'
            }`}
          >
            {copied ? <CheckCircle2 size={20} /> : <LinkIcon size={20} />}
            {copied ? 'Link copiado!' : 'Copiar link de convite'}
          </button>
          <div className="mt-4 bg-slate-100 dark:bg-[#232431] p-4 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#303348]">
            Qualquer pessoa que receber este link poderá acessar e entrar na turma. O link é válido por 30 dias. <button className="underline hover:text-slate-900 dark:hover:text-white font-semibold">Desativar o link.</button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">OU</span>
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
        </div>

        {/* Via Email */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Convidar por e-mail</label>
          <input 
            type="email" 
            placeholder="Adicione e-mails separados por vírgula" 
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full bg-white dark:bg-[#1A1B23] border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-[#8B5CF6] mb-3 transition shadow-sm dark:shadow-none"
          />
          <button 
            onClick={() => {
              if (inviteEmail.includes('@')) {
                setMembers([...members, { id: Date.now(), name: inviteEmail.split('@')[0], email: inviteEmail, role: 'Aluno' }]);
                setInviteEmail('');
                setStep(3);
              }
            }}
            disabled={!inviteEmail.includes('@')}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition shadow-md disabled:shadow-none mt-2"
          >
            Enviar convites e Continuar
          </button>
        </div>

        <button 
          onClick={handleFinish}
          className="mt-auto w-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-bold py-3 px-4 rounded-xl transition"
        >
          Pular por enquanto
        </button>

      </motion.div>

      {/* Direita - Benefícios */}
      <div className="hidden lg:flex w-7/12 bg-gradient-to-br from-[#0284C7] to-[#2DD4BF] items-center justify-center relative p-12 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl w-full relative z-10"
        >
          <div className="text-center mb-10">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="inline-block text-8xl drop-shadow-2xl mb-6"
            >
              🎓
            </motion.div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Ofereça aos seus alunos acesso a recursos premium de graça
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl flex gap-4 items-start border border-white/10 shadow-xl">
              <LayoutDashboard className="text-white shrink-0 mt-1" size={24} />
              <p className="text-white text-sm leading-relaxed">
                Atribua tarefas aos alunos no Reduca e acompanhe o progresso deles, tudo num só lugar.
              </p>
            </div>
            
            <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl flex gap-4 items-start border border-white/10 shadow-xl">
              <Sparkles className="text-white shrink-0 mt-1" size={24} />
              <p className="text-white text-sm leading-relaxed">
                Aumente a interação usando recursos de IA, como Atividades Mágicas, enquetes e jogos narrativos.
              </p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl flex gap-4 items-start border border-white/10 shadow-xl">
              <Users className="text-white shrink-0 mt-1" size={24} />
              <p className="text-white text-sm leading-relaxed">
                Professores e alunos podem ser organizados em turmas para simplificar a colaboração.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="min-h-screen bg-slate-100 dark:bg-[#111218] text-slate-800 dark:text-white p-4 sm:p-8 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 sm:mb-12">
          <button onClick={() => navigate('/')} className="hover:text-slate-900 dark:hover:text-white transition">Início</button>
          <span className="mx-2">›</span>
          <button onClick={() => setStep(1)} className="hover:text-slate-900 dark:hover:text-white transition">Turmas</button>
          <span className="mx-2">›</span>
          <span className="text-slate-800 dark:text-white">{className || 'Nova Turma'}</span>
        </div>

        {/* Título Central */}
        <div className="flex flex-col items-center justify-center mb-12 sm:mb-16">
          <div className="w-16 h-16 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-emerald-500/20">
            {members.length}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white text-center">{className || 'Nova Turma'}</h1>
        </div>

        {/* Header Tabela e Botão */}
        <div className="flex flex-col sm:flex-row justify-end items-center mb-4 gap-4">
          <button 
            onClick={() => setStep(2)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-2 px-6 rounded-xl shadow-md transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
             Adicionar pessoas
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white dark:bg-[#1A1B23] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-[#111218] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold w-12">
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Nome</th>
                  <th className="px-6 py-4 font-semibold">E-mail</th>
                  <th className="px-6 py-4 font-semibold">Função na turma</th>
                  <th className="px-6 py-4 font-semibold w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition group">
                    <td className="px-6 py-4">
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex-shrink-0 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"></div>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 object-cover border border-slate-200 dark:border-slate-600" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-500 dark:bg-orange-600 flex items-center justify-center font-bold text-white shadow-inner">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-slate-800 dark:text-slate-200">{member.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{member.email || '-'}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      <select className="bg-transparent border-none focus:ring-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded text-sm outline-none">
                        <option value="Admin da turma" className="bg-white dark:bg-[#1A1B23]">Admin da turma</option>
                        <option value="Aluno" className="bg-white dark:bg-[#1A1B23]">Aluno</option>
                        <option value="Professor adjunto" className="bg-white dark:bg-[#1A1B23]">Professor adjunto</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 relative group/menu">
                      <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <MoreHorizontal size={20} />
                      </button>
                      
                      {/* Dropdown Menu Invisível */}
                      <div className="absolute right-8 top-10 w-48 bg-white dark:bg-[#232431] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 hidden group-hover/menu:block hover:block">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(member.email);
                            alert("E-mail copiado!");
                          }}
                          className="w-full text-left px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2 rounded-t-xl text-sm"
                        >
                           <Copy size={16} /> Copiar e-mail
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Remover ${member.name} da turma?`)) {
                              setMembers(members.filter(m => m.id !== member.id));
                            }
                          }}
                          className="w-full text-left px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-300 transition flex items-center gap-2 rounded-b-xl text-sm border-t border-slate-100 dark:border-slate-700"
                        >
                           <Trash2 size={16} /> Remover da turma
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </motion.div>
    </AnimatePresence>
  );
}
