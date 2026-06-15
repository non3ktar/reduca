import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import Post from '../components/Post';
import { ArrowLeft, Edit3, MapPin, Briefcase, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const targetId = id || currentUser?.id;
  const isOwnProfile = targetId === currentUser?.id;

  const [profileUser, setProfileUser] = useState(undefined);
  const [userPosts, setUserPosts] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  useEffect(() => {
    if (!targetId) return;

    supabase.from('profiles').select('*').eq('id', targetId).single().then(({ data }) => {
      setProfileUser(data || null);
    });

    supabase.from('posts').select('*, author:profiles(id, name, avatar)').eq('user_id', targetId).order('created_at', { ascending: false }).then(({ data }) => {
      setUserPosts(data || []);
    });
  }, [targetId]);

  const handleEditClick = () => {
    if (profileUser) {
      setEditName(profileUser.name);
      setEditAvatar(profileUser.avatar);
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editAvatar.trim()) return;
    await supabase.from('profiles').update({
      name: editName,
      avatar: editAvatar
    }).eq('id', targetId);
    setProfileUser(prev => ({ ...prev, name: editName, avatar: editAvatar }));
    setIsEditing(false);
  };

  if (profileUser === undefined) return <div className="min-h-screen flex items-center justify-center text-slate-400">Carregando perfil...</div>;
  if (profileUser === null) return <div className="min-h-screen flex items-center justify-center text-slate-400">Usuário não encontrado.</div>;

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 md:px-12 max-w-2xl mx-auto relative">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-black mb-6 transition glass px-4 py-2 rounded-full w-fit">
        <ArrowLeft size={18} /> Voltar
      </button>

      {/* Header Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden mb-8 border border-slate-700/50">
        <div className="h-48 bg-gradient-to-r from-orange-600 to-purple-600 relative">
          {isOwnProfile && (
            <button 
              onClick={handleEditClick}
              className="absolute top-4 right-4 bg-slate-900/40 hover:bg-slate-900/80 p-2.5 rounded-full text-white transition backdrop-blur-md shadow-lg" 
              title="Editar Perfil"
            >
              <Edit3 size={18} />
            </button>
          )}
        </div>
        <div className="px-6 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-4">
            <img 
              src={profileUser.avatar} 
              alt={profileUser.name} 
              className="w-32 h-32 rounded-full border-4 border-slate-900 object-cover bg-slate-800 shadow-xl" 
            />
            {!isOwnProfile && (
              <button className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-orange-500/20 transition">
                Seguir
              </button>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-slate-100">{profileUser.name}</h1>
          <p className="text-slate-400 mb-6 font-medium">@{profileUser.email.split('@')[0]}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 bg-slate-900/30 p-4 rounded-xl border border-slate-700/50 w-fit">
            <span className="flex items-center gap-2"><Briefcase size={16} className="text-orange-500"/> Professor(a)</span>
            <span className="flex items-center gap-2"><MapPin size={16} className="text-orange-500"/> Brasil</span>
            <span className="flex items-center gap-2"><Calendar size={16} className="text-orange-500"/> Desde 2026</span>
          </div>
        </div>
      </motion.div>

      {/* User Posts */}
      <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-orange-500 rounded-full block"></span> Publicações
      </h2>
      <div className="space-y-6">
        {userPosts?.map(post => (
          <Post key={post.id} post={post} currentUser={currentUser} />
        ))}
        {userPosts?.length === 0 && (
          <div className="text-center text-slate-500 py-12 glass-card">
            Nenhuma publicação feita por {isOwnProfile ? 'você' : profileUser.name.split(' ')[0]} ainda.
          </div>
        )}
      </div>

      {/* Modal Edit Profile */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-card w-full max-w-md p-6 relative z-10">
              <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-bold text-orange-500 mb-6">Editar Perfil</h2>
              
              <div className="flex justify-center mb-6">
                <img src={editAvatar || 'https://placehold.co/150'} alt="Preview" className="w-24 h-24 rounded-full border-2 border-orange-500 object-cover" />
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wide">Nome de Exibição</label>
                  <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wide">URL da Foto de Perfil</label>
                  <input type="url" required value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="glass-input w-full" />
                </div>
                
                <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/30 mt-4">
                  Salvar Alterações
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
