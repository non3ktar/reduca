# Reduca 🍎
*Antigo Teach&Learn Modernizado*

A **Reduca** é uma plataforma educacional e rede social desenhada para a emancipação de professores, gestores e alunos. O projeto evoluiu de um front-end estático para uma arquitetura moderna PWA/APK com backend em nuvem, notificações em tempo real e inteligência artificial embarcada, focando em um ecossistema digital soberano e colaborativo.

---

## 📌 Objetivo do Projeto
Proporcionar um ambiente de ensino-aprendizagem que integre metodologias ativas com ferramentas de tecnologia avançada. A Reduca serve como hub para gestão escolar, intercâmbio de saberes e democratização do acesso a recursos digitais.

## 🛠 Tech Stack
- **Framework Front-end:** Vite + React
- **Estilização:** TailwindCSS V4 (Design System focado em Glassmorphism, Dark Mode e UI Premium)
- **Backend (BaaS):** Supabase (PostgreSQL, Authentication, Realtime, Edge Functions)
- **Mobile/APK:** Capacitor (Geração de APK nativo híbrido)
- **Ícones & Animações:** Lucide React, Framer Motion
- **Inteligência Artificial:** `@tensorflow/tfjs` e `nsfwjs` (para moderação de conteúdo local, respeitando a privacidade dos dados)
- **Roteamento:** React Router DOM
- **Automação de Build:** Node.js script customizado (`release.js`)

## 🚀 Setup e Execução
Certifique-se de ter Node.js instalado e configurado com a `build_env` (JDK-21 para o ambiente Android).

1. Clone o repositório e acesse a pasta do projeto.
2. Instale as dependências:
   ```bash
   npm install
Inicie o servidor de desenvolvimento:

Bash
npm run dev
Nota: As credenciais do Supabase devem estar configuradas no seu arquivo src/supabase.js.

📦 Script de Release & Deploy (AutoUpdater)
Para gerar uma nova versão da plataforma web e do APK com Auto-Update, execute:

Bash
npm run release
O que este script automatiza:

Incremento de versão no public/version.json e build.gradle (Android).

Build web da pasta dist.

Sincronização de assets para o Android (npx cap sync).

Acionamento do gerar_apk.sh (build local).

Upload do APK para hospedagem.

Versionamento Git (add, commit, push) para segurança e rastreabilidade.

🌐 Deployment
Web App: reduca.zonaeducacional.org

Update Protocol: version.json

📝 Changelog / Histórico
v1.0 (Legado): Base HTML, jQuery, Materialize e Firebase.

v2.0 (Reduca): Migração Supabase, Design Vibe Coder, Grupos, Fórum e Integração Mobile com AutoUpdater.

Última Atualização (17/06/2026):

Otimização de UI/UX: Barras laterais sticky em desktop.

Implementação de WidgetAtalhos para rotas principais.

Ajuste de responsividade no cabeçalho de Grupos.

Adição de rotas administrativas (/admin) para gestão de usuários.

Incremento de versão APK para 1.0.20.

⚖️ Licença
Este projeto está licenciado sob a licença Creative Commons Atribuição-NãoComercial 4.0 Internacional (CC BY-NC 4.0).

Você tem permissão para:

Compartilhar: copiar e redistribuir o material em qualquer suporte ou formato.

Adaptar: remixar, transformar e criar a partir do material.

Sob as seguintes condições:

Atribuição: Você deve dar o crédito apropriado, prover um link para a licença e indicar se mudanças foram feitas.

NãoComercial: Você não pode usar o material para fins comerciais.

Para mais detalhes, consulte: https://creativecommons.org/licenses/by-nc/4.0/
