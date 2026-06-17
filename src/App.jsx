import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import Apps from './pages/Apps';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Escambo from './pages/Escambo';
import Forum from './pages/Forum';
import ForumTopic from './pages/ForumTopic';
import ScrollToTop from './components/ScrollToTop';
import AutoUpdater from './components/AutoUpdater';
import { supabase } from './supabase';
import { usePushNotifications } from './hooks/usePushNotifications';
import { Capacitor } from '@capacitor/core';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('reduc_theme') || 'dark');

  usePushNotifications(session?.user);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('reduc_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-500 font-bold">Carregando Reduca...</div>;

  const routerBasename = "";

  return (
    <div className="min-h-screen transition-colors duration-300 relative text-[var(--text-primary)]">
      <Router basename={routerBasename}>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Protected Routes */}
          <Route path="/" element={session ? <Home user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/blog" element={session ? <Blog user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/marketplace" element={session ? <Marketplace user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/apps" element={session ? <Apps /> : <Navigate to="/login" />} />
          <Route path="/admin" element={session ? <Admin user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/groups" element={session ? <Groups user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/groups/:id" element={session ? <GroupDetail user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/escambo" element={session ? <Escambo user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/forum" element={session ? <Forum user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/forum/:id" element={session ? <ForumTopic user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={session ? <Profile currentUser={session.user} /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={session ? <Profile currentUser={session.user} /> : <Navigate to="/login" />} />
        </Routes>
        <AutoUpdater />
      </Router>
    </div>
  );
}
