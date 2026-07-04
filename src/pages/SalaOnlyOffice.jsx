import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SalaOnlyOffice() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sergioaraujo.onlyoffice.com/static/scripts/sdk/2.2.0/api.js?src=https%3A%2F%2Fsergioaraujo.onlyoffice.com&mode=public-room&width=100%25&height=100%25&frameId=ds-frame&showHeader=true&showTitle=true&showMenu=false&showFilter=true&disableActionButton=false&infoPanelVisible=false&init=true&filter%5Bcount%5D=100&filter%5Bpage%5D=1&filter%5Bsortorder%5D=descending&filter%5Bsortby%5D=DateAndTime&filter%5Bsearch%5D=&filter%5BwithSubfolders%5D=false&id=3870504&requestToken=WThHSGRXN3VsQmt6R2lJQ2ZFZFltUnF1OStvOGNTK2Uwa2ZQVlQvaXo3WT0_ImQyZDJmMjE5LWIzNjAtNDg4NC05NzgyLTM1NGU0N2RkOWI1YiI&rootPath=%2Frooms%2Fshare";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpa o script ao desmontar o componente, se necessário
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0 pt-6 px-4 max-w-7xl mx-auto flex flex-col h-screen">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link to="/" className="text-slate-400 hover:text-orange-500 p-2 glass rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-orange-500">Sala Compartilhada - OnlyOffice</h1>
      </div>
      <div className="glass-card p-2 rounded-2xl flex-1 w-full relative overflow-hidden mb-6">
        <div id="ds-frame" className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
          Carregando ambiente do OnlyOffice...
        </div>
      </div>
    </div>
  );
}
