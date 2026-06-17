import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabase';
import { ImagePlus, Send, SmilePlus, BarChart2, X, Plus, Trash2, Loader2, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as nsfwjs from 'nsfwjs';
import { generatePostFromTopic } from '../ai';

const COMMON_EMOJIS = ['👍','😂','❤️','😍','😊','🔥','💡','🚀','🙌','🤔','👏','🎉','💯','👀','📚','✏️'];

export default function CreatePost({ user, groupId = null }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  
  // Emoji State
  const [showEmojis, setShowEmojis] = useState(false);
  
  // Poll State
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // AI State
  const [showAI, setShowAI] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Bloqueio inicial se o arquivo for absurdamente grande (maior que 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem é muito pesada! Escolha uma de até 5MB.');
        return;
      }

      setIsCheckingImage(true);
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.crossOrigin = "anonymous";
      
      img.onload = async () => {
        try {
          const model = await nsfwjs.load();
          const predictions = await model.classify(img);
          
          const nsfwClasses = ['Porn', 'Hentai', 'Sexy'];
          const isNsfw = predictions.some(p => nsfwClasses.includes(p.className) && p.probability > 0.6);
          
          if (isNsfw) {
            alert('🚫 Imagem bloqueada pelo filtro de segurança da Reduca (Conteúdo impróprio detectado).');
            setImage(null);
          } else {
            // Compressão client-side inteligente
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200; 
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round(height * (MAX_WIDTH / width));
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round(width * (MAX_HEIGHT / height));
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Converte para JPEG com 70% de qualidade para ficar minúsculo
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); 
            setImage(compressedDataUrl);
          }
        } catch (error) {
          console.error('Erro na IA:', error);
          alert('Erro ao analisar a imagem. Tente enviar novamente.');
        } finally {
          setIsCheckingImage(false);
          URL.revokeObjectURL(img.src);
        }
      };
    }
  };

  const addEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    setShowEmojis(false);
  };

  const updatePollOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    try {
      const generatedText = await generatePostFromTopic(aiTopic);
      setContent(prev => prev + (prev ? '\n\n' : '') + generatedText);
      setShowAI(false);
      setAiTopic('');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validPollOptions = pollOptions.filter(opt => opt.trim() !== '');
    const hasValidPoll = showPoll && pollQuestion.trim() !== '' && validPollOptions.length >= 2;
    
    if (!content.trim() && !image && !hasValidPoll) return;

    let pollData = null;
    if (hasValidPoll) {
      pollData = {
        question: pollQuestion,
        options: validPollOptions.map((opt, idx) => ({ id: idx + 1, text: opt, votes: 0 })),
        voted_users: [] // to track who voted in this specific post
      };
    }

    await supabase.from('posts').insert({
      user_id: user.id,
      content,
      image,
      poll_data: pollData,
      group_id: groupId
    });

    setContent('');
    setImage(null);
    setShowPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  return (
    <div className="glass-card p-4 relative">
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          placeholder={`O que você quer compartilhar, ${user.name.split(' ')[0]}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent resize-none focus:outline-none text-slate-100 placeholder-slate-500 min-h-[80px] overflow-hidden"
        />
        
        {image && (
          <div className="relative mb-4">
            <img src={image} alt="Preview" className="rounded-xl max-h-64 object-cover w-full" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-slate-900/80 p-2 rounded-full hover:bg-red-500/80 transition text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <AnimatePresence>
          {showPoll && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-orange-400">Criar Enquete</h4>
                <button type="button" onClick={() => setShowPoll(false)} className="text-slate-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Qual é a pergunta da enquete?" 
                value={pollQuestion}
                onChange={e => setPollQuestion(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-orange-500"
              />
              <div className="space-y-2">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder={`Opção ${idx + 1}`} 
                      value={opt}
                      onChange={e => updatePollOption(idx, e.target.value)}
                      className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                    {pollOptions.length > 2 && (
                      <button type="button" onClick={() => removePollOption(idx)} className="text-slate-500 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {pollOptions.length < 5 && (
                <button type="button" onClick={addPollOption} className="mt-3 text-xs text-orange-400 font-medium flex items-center gap-1 hover:text-orange-300">
                  <Plus size={14} /> Adicionar Opção
                </button>
              )}
            </motion.div>
          )}

          {showAI && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 bg-indigo-900/20 p-4 rounded-xl border border-indigo-700/50 overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2"><Bot size={16} /> Assistente de Postagem IA</h4>
                <button type="button" onClick={() => setShowAI(false)} className="text-slate-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-3">Diga sobre o que você quer falar e a IA escreverá um rascunho para você.</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Ex: Dicas para a prova do ENEM..." 
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleGenerateAI())}
                  disabled={isGenerating}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
                <button 
                  type="button" 
                  onClick={handleGenerateAI} 
                  disabled={isGenerating || !aiTopic.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Gerar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 relative">
          <div className="flex items-center gap-2">
            <label className={`cursor-pointer text-orange-400 hover:text-orange-300 transition flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 ${isCheckingImage ? 'opacity-50 pointer-events-none' : ''}`}>
              {isCheckingImage ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
              <span className="text-sm font-medium hidden sm:inline">
                {isCheckingImage ? 'Analisando...' : 'Foto'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isCheckingImage} />
            </label>

            <button type="button" onClick={() => setShowPoll(!showPoll)} className={`text-orange-400 hover:text-orange-300 transition flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 ${showPoll ? 'bg-slate-800/50' : ''}`}>
              <BarChart2 size={20} />
              <span className="text-sm font-medium hidden sm:inline">Enquete</span>
            </button>

            <button type="button" onClick={() => setShowAI(!showAI)} className={`text-indigo-400 hover:text-indigo-300 transition flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 ${showAI ? 'bg-slate-800/50' : ''}`} title="Gerar com IA">
              <Sparkles size={20} />
              <span className="text-sm font-medium hidden sm:inline">IA</span>
            </button>

            <div className="relative">
              <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="text-orange-400 hover:text-orange-300 transition flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50">
                <SmilePlus size={20} />
                <span className="text-sm font-medium hidden sm:inline">Emoji</span>
              </button>
              
              <AnimatePresence>
                {showEmojis && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-0 mb-2 bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl w-64 z-50 grid grid-cols-4 gap-2">
                    {COMMON_EMOJIS.map((emoji, idx) => (
                      <button key={idx} type="button" onClick={() => addEmoji(emoji)} className="text-2xl hover:bg-slate-800 rounded-lg p-1 transition transform hover:scale-110">
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCheckingImage || (!content.trim() && !image && !showPoll) || (showPoll && (pollQuestion.trim() === '' || pollOptions.filter(o => o.trim() !== '').length < 2))}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full font-medium transition flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <span>Publicar</span>
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
