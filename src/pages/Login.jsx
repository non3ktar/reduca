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
    <div className="min-h-screen w-full relative flex overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="https://con3ktar.nekoweb.org/23087-333074572.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay for better contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0"></div>

      <div className="relative z-10 w-full flex flex-col md:flex-row min-h-screen">
        
        {/* Left Side: Branding */}
        <div className="flex-1 flex flex-col justify-center items-start p-8 md:p-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-7xl md:text-9xl font-serif font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
              Reduc
            </h1>
            <p className="text-xl md:text-3xl font-light tracking-wide max-w-lg text-white/90 drop-shadow-lg leading-relaxed">
              Onde a educação e o futuro se conectam.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Login Modal */}
        <div className="w-full md:w-[500px] flex flex-col justify-center p-8 md:p-12 bg-black/50 backdrop-blur-2xl border-l border-white/10 shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-sm mx-auto"
          >
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
              <p className="text-white/60">{isLogin ? 'Entre para continuar na plataforma' : 'Junte-se à nova geração do ensino'}</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <input 
                      type="text" placeholder="Como devemos te chamar?" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all" required={!isLogin}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <input 
                type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all" required
              />
              <input 
                type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all" required minLength="6"
              />

              <button disabled={loading} type="submit" className="w-full bg-white hover:bg-slate-200 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 mt-8">
                {loading ? 'Processando...' : isLogin ? <><LogIn size={20}/> Entrar agora</> : <><UserPlus size={20}/> Concluir cadastro</>}
              </button>
            </form>

            <div className="mt-8 text-center md:text-left">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-white/60 hover:text-white transition-colors">
                {isLogin ? "Primeira vez aqui? Crie uma conta grátis." : "Já tem uma conta? Faça login."}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-white/10 text-xs text-white/40 flex justify-center md:justify-start gap-4">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <span className="ml-auto">&copy; {new Date().getFullYear()} Reduc</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
