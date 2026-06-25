import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Plus, ArrowLeft, Users, Trash2, BookOpen, Video, FileText, MessageSquare, Send, Upload } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import AppDrawer from '../components/AppDrawer';
import Sidebar from '../components/Sidebar';

export default function Turmas({ user }) {
  const navigate = useNavigate();
  
  // Fake initial data
  const [turmas, setTurmas] = useState([
    {
      id: 1,
      name: 'História do 5º ano',
      members: [
        { id: 1, name: user?.user_metadata?.name || 'Professor', email: user?.email, role: 'Admin da turma', avatar: user?.user_metadata?.avatar_url }
      ],
      activities: [
        {
          id: 1,
          title: 'O Descobrimento do Brasil',
          description: 'Leia o texto e assista ao documentário para debatermos na próxima aula presencial.',
          videoLink: 'https://youtube.com/watch?v=exemplo',
          fileLink: 'https://docs.google.com/document/d/exemplo',
          comments: []
        }
      ]
    }
  ]);

  const [selectedTurma, setSelectedTurma] = useState(null);
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'activities'
  
  // Turma Creation
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTurmaName, setNewTurmaName] = useState('');
  
  // Members Adding
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');

  // Activity Creation
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actVideo, setActVideo] = useState('');
  const [actFile, setActFile] = useState('');

  // Comments
  const [commentText, setCommentText] = useState('');
  const [expandedActivity, setExpandedActivity] = useState(null);

  // ================= TURMAS LOGIC =================
  const handleCreateTurma = (e) => {
    e.preventDefault();
    if (!newTurmaName.trim()) return;
    const newTurma = {
      id: Date.now(),
      name: newTurmaName,
      members: [
        { id: Date.now() + 1, name: user?.user_metadata?.name || 'Professor', email: user?.email, role: 'Admin da turma', avatar: user?.user_metadata?.avatar_url }
      ],
      activities: []
    };
    setTurmas([newTurma, ...turmas]);
    setShowCreateModal(false);
    setNewTurmaName('');
    setSelectedTurma(newTurma);
    setActiveTab('members');
  };

  const handleDeleteTurma = (turmaId, e) => {
    e.stopPropagation();
    if (!window.confirm('Excluir turma apaga todos os membros e atividades. Confirmar?')) return;
    setTurmas(turmas.filter(t => t.id !== turmaId));
    if (selectedTurma && selectedTurma.id === turmaId) setSelectedTurma(null);
  };

  const updateSelectedTurma = (updatedTurma) => {
    setSelectedTurma(updatedTurma);
    setTurmas(turmas.map(t => t.id === updatedTurma.id ? updatedTurma : t));
  };

  // ================= MEMBERS LOGIC =================
  const handleAddManual = (e) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    const newMember = { id: Date.now(), name: manualName.trim(), email: manualEmail.trim() || '', role: 'Aluno' };
    updateSelectedTurma({ ...selectedTurma, members: [...selectedTurma.members, newMember] });
    setManualName('');
    setManualEmail('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n');
      const newMembers = [];
      rows.forEach((row, index) => {
        if (row.trim() === '') return;
        const columns = row.split(',');
        if (columns.length >= 1) {
          const name = columns[0].trim();
          const email = columns[1] ? columns[1].trim() : '';
          if (name && name.toLowerCase() !== 'nome' && name.toLowerCase() !== 'name') {
            newMembers.push({ id: Date.now() + index, name, email, role: 'Aluno' });
          }
        }
      });
      if (newMembers.length > 0) {
        updateSelectedTurma({ ...selectedTurma, members: [...selectedTurma.members, ...newMembers] });
        alert(`${newMembers.length} alunos importados com sucesso!`);
      } else {
        alert("Nenhum aluno encontrado no arquivo.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleRemoveMember = (memberId) => {
    if (!window.confirm('Remover aluno?')) return;
    updateSelectedTurma({ ...selectedTurma, members: selectedTurma.members.filter(m => m.id !== memberId) });
  };

  // ================= ACTIVITIES LOGIC =================
  const handleCreateActivity = (e) => {
    e.preventDefault();
    if (!actTitle.trim()) return;
    const newActivity = {
      id: Date.now(),
      title: actTitle,
      description: actDesc,
      videoLink: actVideo,
      fileLink: actFile,
      comments: []
    };
    updateSelectedTurma({ ...selectedTurma, activities: [newActivity, ...selectedTurma.activities] });
    setShowCreateActivityModal(false);
    setActTitle(''); setActDesc(''); setActVideo(''); setActFile('');
  };

  const handleDeleteActivity = (actId) => {
    if (!window.confirm('Excluir atividade?')) return;
    updateSelectedTurma({ ...selectedTurma, activities: selectedTurma.activities.filter(a => a.id !== actId) });
  };

  const handleAddComment = (actId, e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      user: user?.user_metadata?.name || 'Professor',
      text: commentText,
      date: new Date().toLocaleDateString()
    };
    
    const updatedActivities = selectedTurma.activities.map(act => {
      if (act.id === actId) {
        return { ...act, comments: [...act.comments, newComment] };
      }
      return act;
    });

    updateSelectedTurma({ ...selectedTurma, activities: updatedActivities });
    setCommentText('');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      <nav className="fixed top-0 w-full glass z-50 hidden md:block border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-500 hover:opacity-80 transition">Reduca</Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-400 hover:text-orange-400 transition-colors"><ArrowLeft size={24} /></Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700/50">
              <ThemeToggle />
              <div className="ml-2 pl-4 border-l border-slate-700/50 flex items-center">
                <AppDrawer />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,600px)_320px] lg:grid-cols-[minmax(0,700px)_320px] justify-center gap-6">
        <div className="space-y-6">
          <div className="md:hidden flex justify-between items-center mb-6 glass-card p-4">
             <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition text-slate-300">
                <ArrowLeft size={24} /> Voltar
             </Link>
             <div className="flex gap-2 items-center">
               <div className="pr-1"><AppDrawer /></div>
               <ThemeToggle />
             </div>
          </div>

          {!selectedTurma ? (
            /* ================= TURMAS LIST ================= */
            <>
              <div className="glass-card p-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-200">
                    <GraduationCap className="text-emerald-500" /> Minhas Turmas
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Gerencie seus alunos e sala de aula invertida.</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition flex items-center gap-2">
                  <Plus size={20} /> <span className="hidden sm:inline">Nova Turma</span>
                </button>
              </div>

              {turmas.length === 0 ? (
                <div className="text-center text-slate-400 py-10 glass-card">Você não possui turmas. Crie uma para começar!</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {turmas.map(turma => (
                    <div key={turma.id} onClick={() => setSelectedTurma(turma)} className="glass-card p-6 hover:scale-[1.01] hover:border-emerald-500/50 transition-all cursor-pointer group flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xl">
                          {turma.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-200 group-hover:text-emerald-500 transition-colors">{turma.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Users size={14} /> {turma.members.length} {turma.members.length === 1 ? 'membro' : 'membros'}</span>
                            <span className="flex items-center gap-1"><BookOpen size={14} /> {turma.activities?.length || 0} atividades</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={(e) => handleDeleteTurma(turma.id, e)} className="text-slate-500 hover:text-red-500 p-2 rounded transition">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* ================= SELECTED TURMA VIEW ================= */
            <>
              <div className="glass-card p-6">
                <button onClick={() => setSelectedTurma(null)} className="flex items-center text-slate-400 hover:text-slate-200 mb-4 text-sm font-medium transition">
                  <ArrowLeft size={16} className="mr-1" /> Voltar para Minhas Turmas
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {selectedTurma.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-200">{selectedTurma.name}</h1>
                    <div className="flex gap-4 text-slate-400 text-sm mt-1">
                      <span>{selectedTurma.members.length} membros</span>
                      <span>{selectedTurma.activities?.length || 0} atividades</span>
                    </div>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-6 mt-6 border-b border-slate-700/50">
                  <button onClick={() => setActiveTab('members')} className={`pb-3 font-bold transition-colors ${activeTab === 'members' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-300'}`}>
                    Alunos
                  </button>
                  <button onClick={() => setActiveTab('activities')} className={`pb-3 font-bold transition-colors ${activeTab === 'activities' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-300'}`}>
                    Sala de Aula Invertida
                  </button>
                </div>
              </div>

              {activeTab === 'members' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="glass-card p-6 space-y-6">
                    <h3 className="font-bold text-slate-200 flex items-center gap-2"><Users className="text-emerald-500" /> Adicionar Alunos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-300">Adicionar 1 a 1</label>
                        <form onSubmit={handleAddManual} className="space-y-3">
                          <input type="text" placeholder="Nome do aluno (Obrigatório)" value={manualName} onChange={(e) => setManualName(e.target.value)} className="glass-input w-full" required />
                          <input type="email" placeholder="E-mail do aluno (Opcional)" value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} className="glass-input w-full" />
                          <button type="submit" disabled={!manualName.trim()} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-bold shadow-md">Adicionar Aluno</button>
                        </form>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-300">Importar lista (CSV)</label>
                        <div className="bg-slate-800/50 border-2 border-dashed border-slate-600/50 rounded-2xl p-6 text-center flex flex-col items-center justify-center h-[140px]">
                          <Upload className="text-slate-400 mb-2" size={28} />
                          <p className="text-xs text-slate-400 mb-4 max-w-[200px]">Colunas: <span className="font-mono text-emerald-500">Nome, Email</span></p>
                          <label className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-xl font-bold transition cursor-pointer text-sm shadow-md">
                            Selecionar Arquivo
                            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
                      <h3 className="font-bold text-slate-200">Membros da Turma</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-800/50 text-slate-400">
                          <tr>
                            <th className="px-6 py-3 font-semibold">Nome</th>
                            <th className="px-6 py-3 font-semibold">E-mail</th>
                            <th className="px-6 py-3 font-semibold">Função</th>
                            <th className="px-6 py-3 font-semibold w-16"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {selectedTurma.members.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-800/30 transition group">
                              <td className="px-6 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-slate-200">{member.name}</span>
                              </td>
                              <td className="px-6 py-3 text-slate-400">{member.email || '-'}</td>
                              <td className="px-6 py-3 text-slate-300">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${member.role === 'Admin da turma' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                                  {member.role}
                                </span>
                              </td>
                              <td className="px-6 py-3">
                                {member.role !== 'Admin da turma' && (
                                  <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:text-red-600 p-1 rounded opacity-0 group-hover:opacity-100" title="Remover aluno"><Trash2 size={16} /></button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-200 text-xl">Tarefas e Atividades</h3>
                    <button onClick={() => setShowCreateActivityModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-md transition flex items-center gap-2">
                      <Plus size={18} /> Nova Atividade
                    </button>
                  </div>

                  {(!selectedTurma.activities || selectedTurma.activities.length === 0) ? (
                    <div className="text-center text-slate-400 py-10 glass-card">Nenhuma atividade postada ainda.</div>
                  ) : (
                    <div className="space-y-4">
                      {selectedTurma.activities.map(act => (
                        <div key={act.id} className="glass-card overflow-hidden">
                          <div 
                            className="p-5 flex justify-between items-start cursor-pointer hover:bg-slate-800/30 transition"
                            onClick={() => setExpandedActivity(expandedActivity === act.id ? null : act.id)}
                          >
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                                <BookOpen size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-200 text-lg">{act.title}</h4>
                                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{act.description}</p>
                              </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteActivity(act.id); }} className="text-slate-500 hover:text-red-500 p-2">
                              <Trash2 size={18} />
                            </button>
                          </div>

                          {expandedActivity === act.id && (
                            <div className="border-t border-slate-700/50 bg-slate-800/10 p-5 space-y-6 animate-in fade-in slide-in-from-top-4">
                              {/* Conteúdo da Atividade */}
                              <div className="space-y-4">
                                <p className="text-slate-300 whitespace-pre-wrap">{act.description}</p>
                                
                                <div className="flex flex-wrap gap-3">
                                  {act.videoLink && (
                                    <a href={act.videoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded-lg text-sm font-medium transition">
                                      <Video size={16} /> Assistir Vídeo
                                    </a>
                                  )}
                                  {act.fileLink && (
                                    <a href={act.fileLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-2 rounded-lg text-sm font-medium transition">
                                      <FileText size={16} /> Abrir Arquivo
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Comentários */}
                              <div className="pt-4 border-t border-slate-700/50 space-y-4">
                                <h5 className="font-bold text-slate-200 flex items-center gap-2">
                                  <MessageSquare size={16} className="text-emerald-500" /> Comentários da Turma ({act.comments.length})
                                </h5>
                                
                                <div className="space-y-3">
                                  {act.comments.map(c => (
                                    <div key={c.id} className="bg-slate-800/50 p-3 rounded-xl flex gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0">
                                        {c.user.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="flex items-baseline gap-2">
                                          <span className="font-bold text-slate-200 text-sm">{c.user}</span>
                                          <span className="text-xs text-slate-500">{c.date}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm mt-1">{c.text}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <form onSubmit={(e) => handleAddComment(act.id, e)} className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Adicionar um comentário para a turma..." 
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="glass-input w-full text-sm py-2"
                                  />
                                  <button type="submit" disabled={!commentText.trim()} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white p-2 rounded-xl transition">
                                    <Send size={18} />
                                  </button>
                                </form>
                              </div>

                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
        <Sidebar currentUser={user} className="hidden lg:block lg:h-fit lg:sticky lg:bottom-4" />
      </main>

      {/* Modais */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2"><GraduationCap className="text-emerald-500" /> Criar Nova Turma</h2>
            <form onSubmit={handleCreateTurma} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nome da Turma</label>
                <input type="text" value={newTurmaName} onChange={e => setNewTurmaName(e.target.value)} className="glass-input w-full" placeholder="Ex: Geografia 8º C" required />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold">Cancelar</button>
                <button type="submit" disabled={!newTurmaName.trim()} className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition">Criar Turma</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card max-w-md w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2"><BookOpen className="text-emerald-500" /> Nova Atividade</h2>
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Título</label>
                <input type="text" value={actTitle} onChange={e => setActTitle(e.target.value)} className="glass-input w-full text-sm" placeholder="Ex: Redação sobre Meio Ambiente" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Instruções / Texto</label>
                <textarea value={actDesc} onChange={e => setActDesc(e.target.value)} className="glass-input w-full text-sm" rows={4} placeholder="Descreva o que o aluno deve fazer..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Link de Vídeo (Opcional)</label>
                <input type="url" value={actVideo} onChange={e => setActVideo(e.target.value)} className="glass-input w-full text-sm" placeholder="https://youtube.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Arquivo PDF/Word (Opcional)</label>
                <input type="url" value={actFile} onChange={e => setActFile(e.target.value)} className="glass-input w-full text-sm" placeholder="Link do Google Drive, OneDrive, etc." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateActivityModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold">Cancelar</button>
                <button type="submit" disabled={!actTitle.trim()} className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition">Postar Atividade</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
