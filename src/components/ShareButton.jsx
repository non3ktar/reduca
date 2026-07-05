import React, { useState } from 'react';
import { Share2, Link2, X, Check, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShareButton({ url, title, text, className = '' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallbacks if props are not provided
  const fullUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText = text || 'Confira isso no Reduca!';

  // Remove 404s on GitHub pages by redirecting deep links to the root with a query param
  let shareableUrl = fullUrl;
  try {
    const urlObj = new URL(fullUrl);
    if (urlObj.hostname.includes('reduca') && urlObj.pathname !== '/') {
      shareableUrl = `${urlObj.origin}/?r=${encodeURIComponent(urlObj.pathname)}`;
    }
  } catch (e) {
    // skip
  }

  const handleShare = async () => {
    // Detect mobile device to prioritize native Web Share API
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareableUrl,
        });
        return;
      } catch (error) {
        // If aborted by user, do nothing. If error, fallback to Modal.
        if (error.name !== 'AbortError') {
          setIsModalOpen(true);
        }
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };


  // Share Intents
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`*${shareTitle}*\n\n${shareText}\n\n🔗 ${shareableUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`
  };

  return (
    <>
      <button 
        onClick={handleShare}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 ${className}`}
        aria-label="Compartilhar"
      >
        <Share2 size={18} />
        <span>Compartilhar</span>
      </button>

      {/* Portal is not strictly necessary for this simple absolute overlay, but it's good practice. 
          Here we use a fixed overlay with high z-index. */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Compartilhar
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <a 
                  href={shareLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 mt-1">WhatsApp</span>
                </a>
                
                <a 
                  href={shareLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 mt-1">Facebook</span>
                </a>
                
                <a 
                  href={shareLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 dark:text-sky-400 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 mt-1">X</span>
                </a>
                
                <a 
                  href={shareLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 mt-1">LinkedIn</span>
                </a>
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300 font-medium select-all" title={fullUrl}>
                    {fullUrl}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-xl transition-all duration-300 ${
                      copied 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm'
                    }`}
                    title="Copiar link"
                  >
                    {copied ? <Check size={18} /> : <Link2 size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
