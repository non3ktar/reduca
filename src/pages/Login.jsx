import React, { useState } from 'react';
import { supabase } from '../supabase';
import { UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        if (data.user) {
          // Add profile to our profiles table
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: email,
            name: name || email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
          });
          
          alert("Conta criada com sucesso! 🎉\nVerifique a sua caixa de e-mail para confirmar o cadastro.");
          setIsLogin(true); // Switch to login tab
        }
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-black/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 md:p-12 w-full max-w-md relative z-10 border border-slate-700/50 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">Reduc</h1>
          <p className="text-slate-400">Entre na vibe da educação do futuro</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <input 
                  type="text" placeholder="Seu Nome" value={name} onChange={e => setName(e.target.value)}
                  className="glass-input w-full" required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <input 
            type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)}
            className="glass-input w-full" required
          />
          <input 
            type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)}
            className="glass-input w-full" required minLength="6"
          />

          <button disabled={loading} type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 mt-6">
            {loading ? 'Carregando...' : isLogin ? <><LogIn size={20}/> Entrar</> : <><UserPlus size={20}/> Criar Conta</>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
            {isLogin ? "Não tem conta? Crie uma agora." : "Já possui conta? Faça login."}
          </button>
        </div>
      </motion.div>

      {/* Footer Genérico */}
      <div className="absolute bottom-4 left-0 w-full text-center text-xs text-slate-500 z-10 flex justify-center gap-4">
        <a href="#" className="hover:text-slate-800 transition-colors">Termos de Uso</a>
        <span>&bull;</span>
        <a href="#" className="hover:text-slate-800 transition-colors">Política de Privacidade</a>
      </div>
    </div>
  );
}
