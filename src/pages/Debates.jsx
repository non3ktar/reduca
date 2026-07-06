import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, ArrowLeft, Send, ChevronRight, ChevronLeft, GitMerge, Search, User, Trash2, Edit2, X, Check, Link as LinkIcon, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Debates({ user }) {
  const [debates, setDebates] = useState([]);
  const [activeDebate, setActiveDebate] = useState(null);
  const [argumentsList, setArgumentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showNewDebate, setShowNewDebate] = useState(false);
  const [newDebateTitle, setNewDebateTitle] = useState('');
  const [newDebateThesis, setNewDebateThesis] = useState('');
  const [newDebateLink, setNewDebateLink] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  
  const [isAddingArg, setIsAddingArg] = useState(null);
  const [newArgContent, setNewArgContent] = useState('');

  const [nodeFocus, setNodeFocus] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const [isEditingDebate, setIsEditingDebate] = useState(false);
  const [editDebateTitle, setEditDebateTitle] = useState('');
  const [editDebateThesis, setEditDebateThesis] = useState('');

  const handleDeleteDebate = async (debateId) => {
    if (window.confirm("Tem certeza que deseja excluir este debate? Esta ação não pode ser desfeita e excluirá todos os argumentos dele.")) {
      await supabase.from('debates').delete().eq('id', debateId);
      setActiveDebate(null);
      setBreadcrumb([]);
      setNodeFocus(null);
      fetchDebates();
    }
  };

  const handleUpdateDebate = async () => {
    if (!editDebateTitle || !editDebateThesis) return;
    const { data } = await supabase.from('debates').update({ 
      title: editDebateTitle, 
      thesis: editDebateThesis 
    }).eq('id', activeDebate.id).select('*, author:author_id(name, avatar)').single();
    
    if (data) {
      setIsEditingDebate(false);
      setActiveDebate(data);
      fetchDebates();
    }
  };

  useEffect(() => {
    fetchDebates();
    const channel = supabase
      .channel('debates_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'debates' }, fetchDebates)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    if (activeDebate) {
      setNodeFocus(null);
      setBreadcrumb([]);
      fetchArguments(activeDebate.id);
      
      const argsChannel = supabase
        .channel('args_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'arguments', filter: `debate_id=eq.${activeDebate.id}` }, () => fetchArguments(activeDebate.id))
        .subscribe();
        
      return () => supabase.removeChannel(argsChannel);
    }
  }, [activeDebate]);

  const fetchDebates = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('debates')
      .select('*, author:author_id(name, avatar)')
      .order('created_at', { ascending: false });
    if (data) {
      setDebates(data);
      if (!activeDebate && data.length > 0) setActiveDebate(data[0]);
    }
    setLoading(false);
  };

  const fetchArguments = async (debateId) => {
    const { data } = await supabase
      .from('arguments')
      .select('*, author:author_id(name, avatar)')
      .eq('debate_id', debateId)
      .order('created_at', { ascending: true });
    if (data) setArgumentsList(data);
  };

  const handleCreateDebate = async (e) => {
    e.preventDefault();
    if (!newDebateTitle || !newDebateThesis || !user) return;
    const { data } = await supabase.from('debates').insert([{ 
      title: newDebateTitle, 
      thesis: newDebateThesis,
      link_url: newDebateLink || null,
      author_id: user.id
    }]).select().single();
    
    if (data) {
      setNewDebateTitle(''); setNewDebateThesis(''); setNewDebateLink(''); setShowNewDebate(false);
      setActiveDebate(data); fetchDebates();
    }
  };

  const handleAddArgument = async (e) => {
    e.preventDefault();
    if (!newArgContent || !activeDebate || !isAddingArg || !user) return;

    const { error } = await supabase
      .from('arguments')
      .insert([{ 
        debate_id: activeDebate.id, 
        content: newArgContent, 
        type: isAddingArg,
        parent_id: nodeFocus,
        author_id: user.id
      }]);
      
    if (!error) {
      setNewArgContent('');
      setIsAddingArg(null);
      fetchArguments(activeDebate.id);
    }
  };

  const handleFocusNode = (arg) => {
    setBreadcrumb([...breadcrumb, arg]);
    setNodeFocus(arg.id);
  };

  const handleGoBack = () => {
    if (breadcrumb.length > 0) {
      const newBreadcrumb = [...breadcrumb];
      newBreadcrumb.pop();
      setBreadcrumb(newBreadcrumb);
      if (newBreadcrumb.length > 0) {
        setNodeFocus(newBreadcrumb[newBreadcrumb.length - 1].id);
      } else {
        setNodeFocus(null);
      }
    }
  };

  const handleGoHome = () => {
    setBreadcrumb([]);
    setNodeFocus(null);
  };

  const currentLevelArgs = argumentsList.filter(a => (nodeFocus ? a.parent_id === nodeFocus : a.parent_id === null));
  const pros = currentLevelArgs.filter(a => a.type === 'pro');
  const cons = currentLevelArgs.filter(a => a.type === 'con');

  const getRepliesCount = (argId) => {
    return argumentsList.filter(a => a.parent_id === argId).length;
  };

  return (
    <div className="min-h-screen pb-20 pt-8 flex flex-col h-screen overflow-hidden text-[var(--text-color)]">
      
      <main className="max-w-6xl mx-auto px-4 w-full h-full flex flex-col">
        <div className="mb-4 shrink-0 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar ao Feed</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="text-orange-500" size={24} />
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                Debates Reduca
              </span>
            </h1>
            <button 
              onClick={() => setShowInfo(true)}
              className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition"
              title="Como funciona?"
            >
              <Info size={18} />
            </button>
          </div>
        </div>

        {/* Modal Info */}
        <AnimatePresence>
          {showInfo && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
                    <Info size={24} /> Como funciona o Debate?
                  </h2>
                  <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-3 text-slate-300 text-sm">
                  <p><strong>Árvore de Argumentos:</strong> O debate não é uma linha reta. Cada argumento pode ser rebatido individualmente.</p>
                  <p><strong>Entrar (Migalhas de Pão):</strong> Clique no argumento para "Entrar" nele. Aquele argumento vira a nova Tese Central e a discussão foca só nele.</p>
                  <p><strong>Prós e Contras:</strong> Adicione se você concorda ou discorda da Tese (ou Argumento) atual que está no topo.</p>
                </div>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="mt-6 w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium"
                >
                  Entendi!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Container Principal */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 h-[80vh] overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 glass-card flex flex-col overflow-hidden shrink-0 border border-slate-700/50">
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                Histórico
              </h2>
              <div className="flex gap-1">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition">
                  <Search size={16} />
                </button>
                <button 
                  onClick={() => setShowNewDebate(!showNewDebate)}
                  className="p-2 text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 rounded-md transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showNewDebate && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-slate-700/50 bg-slate-800/30"
                  onSubmit={handleCreateDebate}
                >
                  <div className="p-4 space-y-3">
                    <input 
                      type="text" 
                      placeholder="Título Curto (Ex: Uso de Celular)" 
                      value={newDebateTitle}
                      onChange={e => setNewDebateTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-500 transition"
                    />
                    <textarea 
                      placeholder="Tese Central do Debate" 
                      value={newDebateThesis}
                      onChange={e => setNewDebateThesis(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-500 transition resize-none h-20"
                    />
                    <input 
                      type="url" 
                      placeholder="Link de Referência (Opcional)" 
                      value={newDebateLink}
                      onChange={e => setNewDebateLink(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-500 transition"
                    />
                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-lg py-2 text-sm font-medium transition shadow-lg shadow-orange-500/20">
                      Iniciar Debate
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {loading ? (
                <div className="text-slate-500 text-center py-4 text-sm animate-pulse">Carregando...</div>
              ) : debates.length === 0 ? (
                <div className="text-slate-500 text-center py-4 text-sm">Nenhum debate criado.</div>
              ) : (
                debates.map(debate => (
                  <button
                    key={debate.id}
                    onClick={() => setActiveDebate(debate)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition flex justify-between items-center group",
                      activeDebate?.id === debate.id 
                        ? "bg-orange-500/10 border border-orange-500/30 shadow-inner" 
                        : "hover:bg-slate-800/60 border border-transparent"
                    )}
                  >
                    <div>
                      <h3 className={cn("font-medium text-sm truncate", activeDebate?.id === debate.id ? "text-orange-400" : "text-slate-300 group-hover:text-slate-200")}>
                        {debate.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        Por {debate.author?.name?.split(' ')[0] || 'Desconhecido'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Área Principal (Estilo Kialo + Glassmorphism) */}
          <div className="flex-1 flex flex-col glass-card border border-slate-700/50 rounded-2xl overflow-hidden relative">
            
            {/* Top Bar Navegação Árvore */}
            <div className="h-12 bg-slate-900/50 border-b border-slate-700/50 flex items-center px-4 shrink-0 shadow-sm z-10 justify-between">
               <div className="flex items-center gap-2 text-sm text-slate-400 overflow-hidden whitespace-nowrap">
                 {activeDebate && (
                   <button onClick={handleGoHome} className="hover:text-orange-400 font-medium transition flex items-center gap-1 shrink-0">
                      <MessageSquare size={14} />
                      Tese Central
                   </button>
                 )}
                 {breadcrumb.map((crumb, idx) => (
                   <React.Fragment key={crumb.id}>
                     <ChevronRight size={14} className="text-slate-600 shrink-0" />
                     <button 
                      onClick={() => {
                        const newBreadcrumb = breadcrumb.slice(0, idx + 1);
                        setBreadcrumb(newBreadcrumb);
                        setNodeFocus(crumb.id);
                      }}
                      className={cn("hover:text-orange-400 transition truncate max-w-[150px] md:max-w-[200px]", idx === breadcrumb.length - 1 ? "font-bold text-slate-200" : "font-medium")}
                      title={crumb.content}
                     >
                       {crumb.content}
                     </button>
                   </React.Fragment>
                 ))}
               </div>
               
               {nodeFocus && (
                 <button onClick={handleGoBack} className="text-orange-400 hover:text-orange-300 text-xs font-semibold flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 transition">
                   <ChevronLeft size={14} /> Voltar Nível
                 </button>
               )}
            </div>

            {activeDebate ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar relative p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                  
                  {/* Card da Hero (Tese ou Argumento Focado) */}
                  <div className="bg-slate-900/80 border-2 border-orange-500/50 rounded-2xl p-6 shadow-xl relative text-center backdrop-blur-md">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {nodeFocus ? (
                        <img 
                          src={argumentsList.find(a => a.id === nodeFocus)?.author?.avatar || 'https://placehold.co/100'} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full border border-slate-600"
                        />
                      ) : (
                        <img 
                          src={activeDebate.author?.avatar || 'https://placehold.co/100'} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full border border-slate-600"
                        />
                      )}
                      <span className="text-sm font-medium text-slate-400">
                        {nodeFocus 
                          ? argumentsList.find(a => a.id === nodeFocus)?.author?.name || 'Autor Desconhecido'
                          : activeDebate.author?.name || 'Autor Desconhecido'}
                      </span>
                    </div>
                    
                    {(!nodeFocus && activeDebate?.author_id === user?.id) && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        {isEditingDebate ? (
                          <>
                            <button onClick={handleUpdateDebate} className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition" title="Salvar">
                              <Check size={16} />
                            </button>
                            <button onClick={() => setIsEditingDebate(false)} className="p-2 bg-slate-700/50 text-slate-400 hover:bg-slate-700 rounded-lg transition" title="Cancelar">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => {
                              setEditDebateTitle(activeDebate.title);
                              setEditDebateThesis(activeDebate.thesis);
                              setIsEditingDebate(true);
                            }} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition" title="Editar Debate">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteDebate(activeDebate.id)} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg transition" title="Excluir Debate">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {isEditingDebate && !nodeFocus ? (
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          value={editDebateTitle}
                          onChange={e => setEditDebateTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 outline-none focus:border-orange-500 font-bold text-center"
                          placeholder="Título do Debate"
                        />
                        <textarea 
                          value={editDebateThesis}
                          onChange={e => setEditDebateThesis(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 outline-none focus:border-orange-500 text-center resize-none h-32 text-xl"
                          placeholder="Tese Central"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <h1 className="text-xl md:text-3xl text-slate-100 font-bold leading-relaxed">
                          {nodeFocus 
                            ? argumentsList.find(a => a.id === nodeFocus)?.content 
                            : activeDebate.thesis
                          }
                        </h1>
                        {!nodeFocus && activeDebate?.link_url && (
                          <a href={activeDebate.link_url} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 transition">
                            <LinkIcon size={14} /> Fonte / Referência
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação Principais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setIsAddingArg(isAddingArg === 'pro' ? null : 'pro')}
                      className={cn(
                        "bg-slate-900/50 border rounded-2xl p-4 flex items-center justify-between transition-all shadow-sm hover:shadow-lg backdrop-blur-sm",
                        isAddingArg === 'pro' ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-700/50 hover:border-emerald-500/50"
                      )}
                    >
                      <span className="text-emerald-500 font-bold text-lg">Prós</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <Plus size={24} />
                      </div>
                    </button>

                    <button 
                      onClick={() => setIsAddingArg(isAddingArg === 'con' ? null : 'con')}
                      className={cn(
                        "bg-slate-900/50 border rounded-2xl p-4 flex items-center justify-between transition-all shadow-sm hover:shadow-lg backdrop-blur-sm",
                        isAddingArg === 'con' ? "border-rose-500 ring-2 ring-rose-500/20" : "border-slate-700/50 hover:border-rose-500/50"
                      )}
                    >
                      <span className="text-rose-500 font-bold text-lg">Contras</span>
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                        <Plus size={24} />
                      </div>
                    </button>
                  </div>

                  {/* Formulário Input Flutuante */}
                  <AnimatePresence mode="wait">
                    {isAddingArg && (
                      <motion.form 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleAddArgument}
                        className="flex gap-2"
                      >
                        <input 
                          type="text" 
                          autoFocus
                          value={newArgContent}
                          onChange={e => setNewArgContent(e.target.value)}
                          placeholder={`Escreva seu argumento ${isAddingArg === 'pro' ? 'a favor (Pró)' : 'contra (Contra)'}...`}
                          className={cn(
                            "flex-1 bg-slate-900 border-2 rounded-xl px-4 py-3 text-slate-100 outline-none shadow-inner",
                            isAddingArg === 'pro' ? "border-emerald-500/50 focus:border-emerald-500" : "border-rose-500/50 focus:border-rose-500"
                          )}
                        />
                        <button 
                          type="submit" 
                          disabled={!newArgContent.trim()}
                          className={cn(
                            "px-6 rounded-xl text-white font-medium flex items-center justify-center shadow-lg disabled:opacity-50 transition border",
                            isAddingArg === 'pro' ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-400 shadow-emerald-500/20" : "bg-rose-600 hover:bg-rose-500 border-rose-400 shadow-rose-500/20"
                          )}
                        >
                          <Send size={20} />
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Colunas de Argumentos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Coluna PRÓS */}
                    <div className="space-y-4">
                      {pros.map(arg => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          key={arg.id} 
                          className="bg-slate-900/60 border-t-4 border-t-emerald-500 border border-slate-700/50 rounded-b-xl shadow-md hover:shadow-lg hover:border-slate-600 transition group cursor-pointer backdrop-blur-sm"
                          onClick={() => handleFocusNode(arg)}
                        >
                          <div className="p-5 pb-3">
                            <p className="text-slate-300 text-[15px] leading-relaxed">{arg.content}</p>
                          </div>
                          <div className="px-5 py-3 bg-slate-800/40 border-t border-slate-700/50 flex justify-between items-center text-xs transition">
                            <div className="flex items-center gap-2">
                               <img src={arg.author?.avatar || 'https://placehold.co/100'} className="w-5 h-5 rounded-full border border-slate-600" />
                               <span className="text-slate-400">{arg.author?.name?.split(' ')[0]}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-slate-500 group-hover:text-emerald-400 transition"><GitMerge size={14}/> {getRepliesCount(arg.id)} sub</span>
                              <span className="flex items-center gap-1 font-medium text-emerald-500 opacity-0 group-hover:opacity-100 transition">Entrar <ChevronRight size={14}/></span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {pros.length === 0 && <p className="text-center text-slate-600 text-sm py-4">Nenhum argumento a favor.</p>}
                    </div>

                    {/* Coluna CONTRAS */}
                    <div className="space-y-4">
                      {cons.map(arg => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          key={arg.id} 
                          className="bg-slate-900/60 border-t-4 border-t-rose-500 border border-slate-700/50 rounded-b-xl shadow-md hover:shadow-lg hover:border-slate-600 transition group cursor-pointer backdrop-blur-sm"
                          onClick={() => handleFocusNode(arg)}
                        >
                          <div className="p-5 pb-3">
                            <p className="text-slate-300 text-[15px] leading-relaxed">{arg.content}</p>
                          </div>
                          <div className="px-5 py-3 bg-slate-800/40 border-t border-slate-700/50 flex justify-between items-center text-xs transition">
                             <div className="flex items-center gap-2">
                               <img src={arg.author?.avatar || 'https://placehold.co/100'} className="w-5 h-5 rounded-full border border-slate-600" />
                               <span className="text-slate-400">{arg.author?.name?.split(' ')[0]}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-slate-500 group-hover:text-rose-400 transition"><GitMerge size={14}/> {getRepliesCount(arg.id)} sub</span>
                              <span className="flex items-center gap-1 font-medium text-rose-500 opacity-0 group-hover:opacity-100 transition">Entrar <ChevronRight size={14}/></span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {cons.length === 0 && <p className="text-center text-slate-600 text-sm py-4">Nenhum argumento contra.</p>}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
                <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                  <MessageSquare size={48} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">Selecione um Debate</h3>
                <p className="text-slate-500 text-center max-w-sm">Escolha uma discussão na lateral ou crie uma nova para mergulhar nos argumentos.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
