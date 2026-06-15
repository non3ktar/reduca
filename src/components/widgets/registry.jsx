import WidgetQuemSeguir from './WidgetQuemSeguir';
import WidgetTrending from './WidgetTrending';
import WidgetAniversarios from './WidgetAniversarios';
import WidgetDuvidas from './WidgetDuvidas';
import WidgetRanking from './WidgetRanking';
import WidgetConquistas from './WidgetConquistas';
import WidgetMetas from './WidgetMetas';
import WidgetAtalhos from './WidgetAtalhos';
import WidgetEnquetes from './WidgetEnquetes';
import WidgetChat from './WidgetChat';

export const availableWidgets = [
  { id: 'chat', name: 'Chat Global', description: 'Sala de bate-papo em tempo real com todos da plataforma.', component: WidgetChat },
  { id: 'quem-seguir', name: 'Sugestões de Amizade', description: 'Usuários sugeridos para seguir baseados na sua rede.', component: WidgetQuemSeguir },
  { id: 'trending', name: 'Tópicos em Alta', description: 'As disciplinas e hashtags mais discutidas no momento.', component: WidgetTrending },
  { id: 'aniversarios', name: 'Aniversariantes', description: 'Veja quais colegas estão apagando as velinhas hoje.', component: WidgetAniversarios },
  { id: 'duvidas', name: 'Mural de Dúvidas', description: 'Perguntas de alunos e colegas esperando por uma resposta.', component: WidgetDuvidas },
  { id: 'ranking', name: 'Ranking de Vibe', description: 'Placar de líderes com os professores mais ativos da semana.', component: WidgetRanking },
  { id: 'conquistas', name: 'Seus Selos', description: 'Quadro das suas conquistas e medalhas pedagógicas.', component: WidgetConquistas },
  { id: 'metas', name: 'Meta Diária', description: 'Barra de progresso das suas interações para criar hábitos.', component: WidgetMetas },
  { id: 'atalhos', name: 'Atalhos Rápidos', description: 'Botões de ação rápida para criar conteúdos e turmas.', component: WidgetAtalhos },
  { id: 'enquetes', name: 'Enquetes Rápidas', description: 'Participe da pesquisa rápida do dia da comunidade.', component: WidgetEnquetes },
];
