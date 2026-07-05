import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { ArrowLeft, Scale, Plus, ExternalLink, Loader2, MessageCircle, Trash2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import AppDrawer from '../components/AppDrawer';
import Sidebar from '../components/Sidebar';

export default function KialoDebates({ user }) {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDebate, setSelectedDebate] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Modal de Criação
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    fetchDebates();
  }, []);

  const fetchDebates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kialo_debates')
        .select(`
          id, title, description, kialo_url, created_at, created_by,
          author:profiles(id, name, avatar)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDebates(data || []);
    } catch (error) {
      console.error("Erro ao buscar debates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDebate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    try {
      const { error } = await supabase
        .from('kialo_debates')
        .insert([{
          title: newTitle.trim(),
          description: newDesc.trim(),
          kialo_url: newUrl.trim(),
          created_by: user.id
        }]);

      if (error) throw error;

      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewUrl('');
      fetchDebates();
    } catch (error) {
      console.error("Erro ao criar debate:", error);
      alert("Erro ao criar o debate. Verifique se a URL está correta.");
    }
  };

  const handleDeleteDebate = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Deseja realmente excluir este debate?")) return;

    try {
      const { error } = await supabase
        .from('kialo_debates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDebates(debates.filter(d => d.id !== id));
      if (selectedDebate?.id === id) setSelectedDebate(null);
    } catch (error) {
      console.error("Erro ao excluir debate:", error);
    }
  };

  const extractKialoEmbedUrl = (url) => {
    // Se o usuário colar o código de iframe inteiro, extrai o src
    if (url.includes('<iframe')) {
      const match = url.match(/src="([^"]+)"/);
      if (match) return match[1];
    }
    // Se o usuário colar a URL normal da página, a gente adiciona parâmetros de embed (embora o Kialo lide bem com a URL direta às vezes, o ideal é ter a URL do iframe que eles fornecem)
    // Assumimos que o usuário colou a URL correta de embed ou do debate.
    return url;
  };

  return (
    <div className={`min-h-screen pb-20 md:pb-0 md:pt-16 flex flex-col ${selectedDebate ? 'h-screen' : ''}`}>
      {/* Navbar Desktop */}
      <nav className="fixed top-0 w-full glass z-50 hidden md:block border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-500 hover:opacity-80 transition">Reduca</Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-2">
              <ArrowLeft size={20} /> Voltar
            </Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700/50">
              <ThemeToggle />
              <div className="ml-2 pl-4 border-l border-slate-700/50 flex items-center">
                <AppDrawer />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Topbar Mobile */}
      <div className="md:hidden flex justify-between items-center glass-card p-4 mx-4 mt-4 mb-2 shrink-0">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition text-slate-300">
          <ArrowLeft size={20} /> Voltar
        </Link>
        <div className="flex gap-3 items-center">
          <ThemeToggle />
          <div className="pr-1"><AppDrawer /></div>
        </div>
      </div>

      <main className={`flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 ${selectedDebate ? 'overflow-hidden' : ''}`}>
        
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col ${selectedDebate ? 'glass-card overflow-hidden border border-slate-700/50 shadow-2xl relative' : 'space-y-6'}`}>
          
          {!selectedDebate ? (
            /* ================= LISTA DE DEBATES ================= */
            <>
              <div className="glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-200">
                    <Scale className="text-blue-500" /> Sala de Debates
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Explore e participe de discussões estruturadas na plataforma Kialo Edu.</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition flex items-center gap-2 w-full sm:w-auto justify-center">
                  <Plus size={20} /> Novo Debate
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                  <p className="text-slate-400 font-medium">Carregando debates...</p>
                </div>
              ) : debates.length === 0 ? (
                <div className="text-center text-slate-400 py-10 glass-card">
                  Nenhum debate criado ainda. Seja o primeiro a iniciar uma discussão!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {debates.map((debate) => (
                    <div 
                      key={debate.id} 
                      onClick={() => { setSelectedDebate(debate); setIframeLoading(true); }}
                      className="glass-card p-5 hover:scale-[1.01] hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2">{debate.title}</h3>
                          {debate.created_by === user.id && (
                            <button onClick={(e) => handleDeleteDebate(debate.id, e)} className="text-slate-500 hover:text-red-500 p-1 rounded transition opacity-0 group-hover:opacity-100">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mt-2 line-clamp-3">{debate.description}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-3">
                        <img src={debate.author?.avatar} alt={debate.author?.name} className="w-8 h-8 rounded-full border border-slate-600" />
                        <div className="text-xs">
                          <p className="text-slate-300 font-medium">{debate.author?.name}</p>
                          <p className="text-slate-500">{new Date(debate.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* ================= IFRAME VIEW ================= */
            <>
              {/* Cabecalho Interno do Debate */}
              <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedDebate(null)} className="p-2 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-slate-200 transition" title="Voltar para a lista">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                    <Scale size={24} />
                  </div>
                  <div className="min-w-0 pr-4">
                    <h1 className="font-bold text-slate-200 text-lg leading-tight truncate">{selectedDebate.title}</h1>
                    <p className="text-xs text-slate-400 truncate">Debate via Kialo Edu</p>
                  </div>
                </div>
                
                <a 
                  href={extractKialoEmbedUrl(selectedDebate.kialo_url)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-blue-500 p-2 glass rounded-full transition flex items-center gap-2 text-sm font-medium shrink-0"
                  title="Abrir em Nova Aba"
                >
                  <ExternalLink size={18} />
                  <span className="hidden sm:inline">Nova Aba</span>
                </a>
              </div>

              {/* Iframe Area */}
              <div className="relative flex-1 w-full bg-white overflow-hidden rounded-b-2xl">
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 rounded-b-2xl">
                     <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                     <p className="text-slate-400 font-medium animate-pulse">Conectando ao Kialo Edu...</p>
                  </div>
                )}
                
                <iframe
                  src={extractKialoEmbedUrl(selectedDebate.kialo_url)}
                  title={selectedDebate.title}
                  className="w-full h-full border-0 absolute inset-0 z-20"
                  onLoad={() => setIframeLoading(false)}
                  allowFullScreen
                />
              </div>
            </>
          )}

        </div>

        {/* Sidebar on Desktop */}
        <div className="hidden lg:block w-[320px] overflow-y-auto pr-2 pb-6 custom-scrollbar shrink-0">
          <Sidebar currentUser={user} />
        </div>
        
      </main>

      {/* Modal de Criação de Debate */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2"><Scale className="text-blue-500" /> Adicionar Debate</h2>
            <form onSubmit={handleCreateDebate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Título do Debate</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="glass-input w-full" placeholder="Ex: O uso de celulares na sala de aula" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descrição</label>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} className="glass-input w-full" rows={3} placeholder="Breve contexto sobre o tema..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">URL ou Embed Code do Kialo Edu</label>
                <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="glass-input w-full" placeholder="https://www.kialo-edu.com/p/..." required />
                <p className="text-xs text-slate-500 mt-1">Cole o link de compartilhamento ou o código HTML (Iframe) fornecido pelo Kialo Edu.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold">Cancelar</button>
                <button type="submit" disabled={!newTitle.trim() || !newUrl.trim()} className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition flex justify-center">
                  Salvar Debate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
