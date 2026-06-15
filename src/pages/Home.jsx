import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import Sidebar from '../components/Sidebar';
import { LogOut, Home as HomeIcon, Bell, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home({ user }) {
  const [userData, setUserData] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setUserData(data);
      } else {
        const fallbackProfile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
        };
        await supabase.from('profiles').insert(fallbackProfile);
        setUserData(fallbackProfile);
      }
    };
    
    loadProfile();
    
    const fetchPosts = () => {
      supabase.from('posts').select('*, author:profiles(id, name, avatar)').order('created_at', { ascending: false })
        .then(({ data }) => setPosts(data || []));
    };
    
    fetchPosts();

    const channel = supabase.channel('realtime-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
        fetchPosts();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      {/* Navbar Desktop */}
      <nav className="fixed top-0 w-full glass z-50 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-500 hover:opacity-80 transition">Reduc</Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-orange-500 hover:text-orange-400 transition-colors"><HomeIcon size={24} /></Link>
            
            <div className="relative">
              <button onClick={() => {setShowMsg(!showMsg); setShowNotif(false)}} className="text-slate-300 hover:text-white transition-colors relative"><MessageCircle size={24} /></button>
              {showMsg && <div className="absolute top-10 right-0 w-48 p-3 glass-card text-sm text-slate-300 text-center z-50">Nenhuma mensagem nova</div>}
            </div>

            <div className="relative">
              <button onClick={() => {setShowNotif(!showNotif); setShowMsg(false)}} className="text-slate-300 hover:text-white transition-colors"><Bell size={24} /></button>
              {showNotif && <div className="absolute top-10 right-0 w-48 p-3 glass-card text-sm text-slate-300 text-center z-50">Sem notificações no momento</div>}
            </div>

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
              <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition group">
                <span className="font-medium group-hover:text-orange-400">{userData.name}</span>
                <img src={userData.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-orange-500/50 group-hover:border-orange-500" />
              </Link>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 ml-2" title="Sair">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,600px)_320px] justify-center gap-8">
        <div className="space-y-6">
          <div className="md:hidden flex justify-between items-center mb-6 glass-card p-4">
             <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition">
                <img src={userData.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-orange-500" />
                <div>
                  <h2 className="font-bold">{userData.name}</h2>
                  <p className="text-xs text-slate-400">{userData.email}</p>
                </div>
             </Link>
             <button onClick={handleLogout} className="text-red-400 p-2 glass rounded-full" title="Sair">
                <LogOut size={20} />
             </button>
          </div>

          <CreatePost user={userData} />

          <div className="space-y-6">
            {posts?.map(post => (
              <Post key={post.id} post={post} currentUser={user} />
            ))}
            {posts?.length === 0 && (
              <div className="text-center text-slate-500 py-10 glass-card">
                Nenhuma publicação ainda. Seja o primeiro!
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar currentUser={user} />
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 w-full glass z-50 md:hidden pb-safe">
        <div className="flex items-center justify-around h-16 relative">
          <button onClick={() => window.scrollTo(0,0)} className="text-orange-500"><HomeIcon size={24} /></button>
          
          <button onClick={() => {setShowMsg(!showMsg); setShowNotif(false)}} className="text-slate-400 relative">
            <MessageCircle size={24} />
          </button>
          
          <button onClick={() => {setShowNotif(!showNotif); setShowMsg(false)}} className="text-slate-400 relative">
            <Bell size={24} />
          </button>

          {showMsg && <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 p-3 glass-card text-sm text-slate-300 text-center">Nenhuma mensagem nova</div>}
          {showNotif && <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 p-3 glass-card text-sm text-slate-300 text-center">Sem notificações no momento</div>}
        </div>
      </nav>
    </div>
  );
}
