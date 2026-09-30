# Catálogo de ferramentas da plataforma (alvo de replicação no OpenCode)

Referência para decidir o que expor ao agente via MCP (`.opencode/mcp/`).
Legenda de estado: ✅ já replicado · 🎯 candidato prioritário · ⏳ possível depois · ⛔ não faz sentido replicar (é do chat/IDE, não do agente).

---

## 1. Mídia e criação (AI Gateway)

| Tool | O que faz | Estado |
|---|---|---|
| `imagegen--generate_image` | Texto → imagem, salva no disco | ✅ |
| `imagegen--edit_image` | Edita imagem(ns) existente(s) por instrução | ✅ |
| `videogen--generate_video` | Texto → vídeo MP4 com áudio | ✅ |
| `audio--text_to_speech` | Narração/voz (`/v1/audio/speech`, Gemini TTS → WAV) | ✅ |
| `audio--transcribe` | Áudio → texto (`/v1/audio/transcriptions`, Gemini) | ✅ |
| _embeddings_ | Vetores para busca semântica | ⏳ |
| _chat completions_ | Texto/raciocínio auxiliar via gateway | ⏳ (o agente já é um LLM) |
| `design--create_directions` | Gera direções visuais em HTML | ⏳ |

## 2. Conhecimento e pesquisa

| Tool | O que faz | Estado |
|---|---|---|
| `websearch--web_search` | Busca web com conteúdo das páginas | ✅ |
| `lovable_docs--search_docs` | Busca na documentação da Lovable | 🎯 |
| `document--parse_document` | PDF/DOCX/XLSX → texto | 🎯 |
| `acp_subagent--explore` | Subagente de investigação do código | ⏳ |
| `acp_subagent--spawn_agent` | Subagente genérico em paralelo | ⏳ |
| `chat_search--*` | Busca no histórico de conversas | ⛔ |
| `semrush--*` (10 tools) | SEO: domínio, keywords, SERP, backlinks | ⏳ |
| `google_search_console--diagnose` | Diagnóstico de indexação | ⏳ |

## 3. Código e ambiente

| Tool | O que faz | Estado |
|---|---|---|
| exec / view / write / line_replace | Shell e arquivos | ✅ nativo do OpenCode |
| navegador (Playwright) | Abrir o app, clicar, screenshot, console | 🎯 (via `agent-browser`) |
| logs de observabilidade | build, runtime, console, rede (`/tmp/observability`) | 🎯 (wrapper simples) |
| `stack_modern--invoke-server-function` | Chama server function do projeto | ⏳ |
| `stack_modern--server-function-logs` | Logs das server functions | ⏳ |

## 4. Backend do projeto (Cloud/Supabase)

| Tool | O que faz | Estado |
|---|---|---|
| `supabase--enable` | Liga o backend | ⛔ (ação de plataforma) |
| SQL / migrations / storage | Banco, políticas, arquivos | ⏳ só leitura via CLI `lovable` |
| `secrets--*` | Ler/criar/rotacionar segredos | ⛔ risco |
| `security--run_security_scan`, `dependency_scan` | Varredura de segurança | ⏳ |

## 5. Projeto e publicação

| Tool | O que faz | Estado |
|---|---|---|
| `project_urls--get_urls` | URLs de preview/produção | 🎯 trivial |
| `preview_ui--publish` | Publica o app | ⛔ |
| `preview_ui--set_preview_device_viewport` | Muda o viewport do preview | ⛔ |
| `publish_settings--*` | Visibilidade, selo, trust center | ⛔ |
| `drafts--*` | Rascunhos de deploy | ⛔ |
| `domain_connect--*`, `domain_status--*` | Domínios | ⛔ |
| `analytics--read_project_analytics` | Métricas de uso | ⏳ |
| `cross_project--*` | Listar/buscar outros projetos | ⏳ |
| `folders--*` | Organização de projetos | ⛔ |

## 6. Integrações e comércio

| Tool | O que faz | Estado |
|---|---|---|
| `standard_connectors--*` | Conectar serviços externos (OAuth) | ⏳ |
| `mcp--list_app_mcps`, `mcp--connect` | Conectar MCPs de apps Lovable | ⏳ |
| `connector_app_user--*` | OAuth por utilizador final | ⏳ |
| `payments--*`, `stripe--*`, `shopify--*` | Pagamentos e loja | ⛔ |
| `email_domain--*` | Domínio e logs de email | ⏳ |
| `slack_apps--provision_slack_app` | App de Slack | ⏳ |
| `google_ads--*` | Contas de anúncios | ⛔ |

## 7. Conta, custos e governança

| Tool | O que faz | Estado |
|---|---|---|
| `credits--*` | Saldo, uso, limites | 🎯 (útil ao agente saber o custo) |
| `billing--*` | Plano e prontidão de compra | ⛔ |
| `ai_gateway_logs--*` | Log das chamadas de IA | ⏳ |
| `lovable_api_key--*` | Criar/rotacionar chave | ⛔ risco |
| `comments--*` | Comentários no preview | ⛔ |
| `questions--ask_questions`, `plan--show`, `approvals--*` | UI do chat | ⛔ |
| `skills--apply_draft`, memória (`mem://`) | Skills e memória persistente | 🎯 memória vale replicar |

---

## Ordem sugerida de implementação

**Lote 1 — completa a mídia (mesmo padrão já provado):**
1. `audio--text_to_speech`
2. `audio--transcribe`

**Lote 2 — dá olhos e contexto ao agente:**
3. `browser--screenshot` / `browser--inspect` (Playwright)
4. `observability--read_logs` (build, runtime, console, rede)
5. `lovable_docs--search_docs`

**Lote 3 — documentos e projeto:**
6. `document--parse_document`
7. `project_urls--get_urls` + `credits--get_credit_balance`

**Lote 4 — memória persistente do agente** (`mem://` em disco), para ele reter regras entre sessões.
