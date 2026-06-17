import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Check, Home as HomeIcon, BookOpen, MessageCircle, Bell, BadgeCheck } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import AppDrawer from '../components/AppDrawer';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';

export default function GroupDetail({ user }) {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setUserData(data);
    };
    loadProfile();
    fetchGroupData();
    fetchPosts();

    const channel = supabase.channel(`group-posts-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `group_id=eq.${id}` }, payload => {
        fetchPosts();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [id]);

  const fetchGroupData = async () => {
    const { data: groupData } = await supabase.from('groups').select('*').eq('id', id).single();
    if (groupData) setGroup(groupData);

    const { data: memberData } = await supabase.from('group_members').select('*').eq('group_id', id).eq('user_id', user.id).single();
    setIsMember(!!memberData);
    
    const { count } = await supabase.from('group_members').select('*', { count: 'exact', head: true }).eq('group_id', id);
    setMemberCount(count || 0);

    setLoading(false);
  };

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts')
      .select('*, author:profiles(id, name, avatar, is_verified)')
      .eq('group_id', id)
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handleJoinLeave = async () => {
    if (isMember) {
      await supabase.from('group_members').delete().eq('group_id', id).eq('user_id', user.id);
      setIsMember(false);
      setMemberCount(prev => Math.max(0, prev - 1));
    } else {
      await supabase.from('group_members').insert([{ group_id: id, user_id: user.id }]);
      setIsMember(true);
      setMemberCount(prev => prev + 1);
    }
  };

  if (loading || !userData) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-500 font-bold">Carregando grupo...</div>;
  if (!group) return <div className="text-center py-20 text-slate-400">Grupo não encontrado.</div>;

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      <nav className="fixed top-0 w-full glass z-50 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-500 hover:opacity-80 transition">Reduca</Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-orange-400 transition-colors" title="Feed">
              <HomeIcon size={24} />
            </Link>
            <Link to="/blog" className="text-slate-300 hover:text-orange-400 transition-colors" title="Brisa Literária">
              <BookOpen size={24} />
            </Link>
            <Link to="/forum" className="text-slate-300 hover:text-orange-400 transition-colors" title="Fórum">
              <MessageCircle size={24} />
            </Link>
            <Link to="/groups" className="text-orange-500 transition-colors" title="Grupos">
              <Users size={24} />
            </Link>
            <button className="text-slate-300 hover:text-orange-400 transition-colors" title="Notificações">
              <Bell size={24} />
            </button>
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
              <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition group">
                <span className="font-medium group-hover:text-orange-400 flex items-center gap-1 text-[var(--text-primary)]">
                  {userData?.name}
                  {userData?.is_verified && <BadgeCheck size={14} className="fill-blue-500 text-white" title="Verificado" />}
                </span>
                {userData?.avatar && (
                  <img src={userData.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-orange-500/50 group-hover:border-orange-500" />
                )}
              </Link>
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
             <Link to="/groups" className="flex items-center gap-3 hover:opacity-80 transition text-slate-300">
                <ArrowLeft size={24} /> Voltar
             </Link>
             <div className="flex gap-2 items-center">
               <div className="pr-1"><AppDrawer /></div>
               <ThemeToggle />
             </div>
          </div>

          {/* Cabeçalho do Grupo */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
            <div className="h-48 md:h-64 relative bg-slate-800">
              {group.cover_image && (
                <img src={group.cover_image} alt={group.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-end justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-md">{group.name}</h1>
                  <p className="text-slate-300 text-sm mt-2 max-w-lg">{group.description}</p>
                </div>
                <button 
                  onClick={handleJoinLeave}
                  className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all ${
                    isMember 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white border border-orange-400'
                  }`}
                >
                  {isMember ? <><Check size={18} /> Membro</> : <><UserPlus size={18} /> Participar</>}
                </button>
              </div>
            </div>
          </div>

          {isMember ? (
            <div className="space-y-6">
              {/* O CreatePost precisa suportar um group_id. Vamos passar via prop ou o CreatePost pega?
                  Se o CreatePost não tem suporte para groupId no supabase.insert, podemos fazer o bypass
                  modificando o CreatePost ou criando a lógica aqui. Por agora passamos a prop groupId. */}
              <CreatePost user={userData} groupId={group.id} />
              
              <div className="space-y-6">
                {posts?.map(post => (
                  <Post key={post.id} post={post} currentUser={userData} />
                ))}
                {posts?.length === 0 && (
                  <div className="text-center text-slate-500 py-10 glass-card">
                    Nenhuma publicação neste grupo ainda. Seja o primeiro a postar!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-10 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-700">
              <Users size={48} className="text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-300">Participe para ver as publicações</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto">Você precisa ser membro deste grupo para interagir e visualizar as discussões.</p>
            </div>
          )}

        </div>

        <aside className="hidden lg:block space-y-6">
          <div className="glass-card p-6 border border-slate-700/50">
            <h3 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <Users className="text-orange-500" size={20} /> Sobre o Grupo
            </h3>
            <p className="text-sm text-slate-500 mb-4">{group.description || 'Nenhuma descrição fornecida.'}</p>
            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Membros</span>
                <span className="font-bold text-[var(--text-primary)] bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50">
                  {memberCount}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
               <button onClick={() => {
                 navigator.clipboard.writeText(window.location.href);
                 alert('Link copiado! Envie para seus colegas participarem.');
               }} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl transition">
                 Convidar Pessoas
               </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
