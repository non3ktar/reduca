import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Plus, ArrowLeft, Users, Copy, Trash2, CheckCircle2, MoreHorizontal, LayoutDashboard, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import AppDrawer from '../components/AppDrawer';
import Sidebar from '../components/Sidebar';

export default function Turmas({ user }) {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState([
    {
      id: 1,
      name: 'História do 5º ano',
      members: [
        { id: 1, name: user?.user_metadata?.name || 'Professor', email: user?.email, role: 'Admin da turma', avatar: user?.user_metadata?.avatar_url }
      ]
    }
  ]);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTurmaName, setNewTurmaName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateTurma = (e) => {
    e.preventDefault();
    if (!newTurmaName.trim()) return;
    
    const newTurma = {
      id: Date.now(),
      name: newTurmaName,
      members: [
        { id: Date.now() + 1, name: user?.user_metadata?.name || 'Professor', email: user?.email, role: 'Admin da turma', avatar: user?.user_metadata?.avatar_url }
      ]
    };
    
    setTurmas([newTurma, ...turmas]);
    setShowCreateModal(false);
    setNewTurmaName('');
    setSelectedTurma(newTurma); // Open it immediately
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://reduca.com/invite/t/${selectedTurma.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.includes('@')) return;

    const newMember = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: 'Aluno'
    };

    const updatedTurma = {
      ...selectedTurma,
      members: [...selectedTurma.members, newMember]
    };

    setSelectedTurma(updatedTurma);
    setTurmas(turmas.map(t => t.id === selectedTurma.id ? updatedTurma : t));
    setInviteEmail('');
  };

  const handleRemoveMember = (memberId) => {
    if (!window.confirm('Tem certeza que deseja remover este membro da turma?')) return;
    
    const updatedTurma = {
      ...selectedTurma,
      members: selectedTurma.members.filter(m => m.id !== memberId)
    };

    setSelectedTurma(updatedTurma);
    setTurmas(turmas.map(t => t.id === selectedTurma.id ? updatedTurma : t));
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      {/* Navbar Desktop */}
      <nav className="fixed top-0 w-full glass z-50 hidden md:block border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-500 hover:opacity-80 transition">Reduca</Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-500 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors"><ArrowLeft size={24} /></Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
              <ThemeToggle />
              <div className="ml-2 pl-4 border-l border-slate-200 dark:border-slate-700 flex items-center">
                <AppDrawer />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,600px)_320px] lg:grid-cols-[minmax(0,700px)_320px] justify-center gap-6">
        
        <div className="space-y-6">
          {/* Navbar Mobile inline */}
          <div className="md:hidden flex justify-between items-center mb-6 glass-card p-4">
             <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition text-slate-700 dark:text-slate-300">
                <ArrowLeft size={24} /> Voltar
             </Link>
             <div className="flex gap-2 items-center">
               <div className="pr-1"><AppDrawer /></div>
               <ThemeToggle />
             </div>
          </div>

          {!selectedTurma ? (
            /* =========================================================================
               LISTA DE TURMAS
               ========================================================================= */
            <>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-md dark:shadow-xl backdrop-blur-md">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <GraduationCap className="text-emerald-500" /> Minhas Turmas
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie seus alunos e atribua atividades.</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Nova Turma</span>
                </button>
              </div>

              {turmas.length === 0 ? (
                <div className="text-center text-slate-500 py-10 glass-card">
                  Você ainda não possui turmas. Crie uma para começar!
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {turmas.map(turma => (
                    <div 
                      key={turma.id} 
                      onClick={() => setSelectedTurma(turma)}
                      className="glass-card p-6 rounded-2xl hover:scale-[1.01] hover:border-emerald-500/50 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
                          {turma.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{turma.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <Users size={14} /> {turma.members.length} {turma.members.length === 1 ? 'membro' : 'membros'}
                          </p>
                        </div>
                      </div>
                      <div className="text-slate-400 group-hover:text-emerald-500 transition-colors">
                        Abrir &rarr;
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* =========================================================================
               DETALHES DA TURMA
               ========================================================================= */
            <>
              {/* Header da Turma */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-md dark:shadow-xl backdrop-blur-md">
                <button 
                  onClick={() => setSelectedTurma(null)}
                  className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-4 text-sm font-medium transition"
                >
                  <ArrowLeft size={16} className="mr-1" /> Voltar para Minhas Turmas
                </button>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-500/30">
                      {selectedTurma.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedTurma.name}</h1>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{selectedTurma.members.length} {selectedTurma.members.length === 1 ? 'membro' : 'membros'} na turma</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Área de Convite */}
              <div className="glass-card p-6 rounded-2xl space-y-6">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="text-emerald-500" /> Adicionar pessoas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Convidar via link</label>
                    <button 
                      onClick={handleCopyLink}
                      className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-xl transition ${
                        copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Link className="w-4 h-4" />}
                      {copied ? 'Link copiado!' : 'Copiar link'}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Convidar por E-mail</label>
                    <form onSubmit={handleInvite} className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="E-mail do aluno" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="glass-input w-full rounded-xl px-4 py-2 text-sm"
                      />
                      <button 
                        type="submit"
                        disabled={!inviteEmail.includes('@')}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-bold transition whitespace-nowrap"
                      >
                        Enviar
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Tabela de Membros */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                  <h3 className="font-bold text-slate-800 dark:text-white">Membros da Turma</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Nome</th>
                        <th className="px-6 py-3 font-semibold">E-mail</th>
                        <th className="px-6 py-3 font-semibold">Função</th>
                        <th className="px-6 py-3 font-semibold w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                      {selectedTurma.members.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition group">
                          <td className="px-6 py-3 flex items-center gap-3">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium text-slate-800 dark:text-slate-200">{member.name}</span>
                          </td>
                          <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{member.email || '-'}</td>
                          <td className="px-6 py-3 text-slate-700 dark:text-slate-300">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              member.role === 'Admin da turma' 
                                ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            {member.role !== 'Admin da turma' && (
                              <button 
                                onClick={() => handleRemoveMember(member.id)}
                                className="text-red-500 hover:text-red-600 p-1 rounded transition opacity-0 group-hover:opacity-100"
                                title="Remover aluno"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Sidebar */}
        <Sidebar currentUser={user} className="hidden lg:block lg:h-fit lg:sticky lg:bottom-4" />
      </main>

      {/* Modal Criar Turma */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700/50 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="text-emerald-500" /> Criar Nova Turma
            </h2>
            <form onSubmit={handleCreateTurma} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Nome da Turma</label>
                <input 
                  type="text" 
                  value={newTurmaName}
                  onChange={e => setNewTurmaName(e.target.value)}
                  className="glass-input w-full rounded-xl px-4 py-2.5"
                  placeholder="Ex: Geografia 8º C"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">Dê um nome para identificar rapidamente a sua turma e organizar seus alunos.</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={!newTurmaName.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition"
                >
                  Criar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
