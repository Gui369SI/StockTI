# TASKS - Tarefas de Desenvolvimento para Agente I.A.

## Tarefa 1: Interface de Usuário (UI)
- [ ] Criar layout moderno e responsivo com navegação lateral/superior.
- [ ] Implementar tela de Dashboard exibindo total de itens em estoque, alertas de estoque baixo e requisições pendentes.
- [ ] Criar tela de Lista e Cadastro de Insumos com busca e filtros.
- [ ] Criar formulário simples para o colaborador solicitar um insumo.
- [ ] Criar painel de Gestão de Requisições com botões de "Aprovar" e "Rejeitar".

## Tarefa 2: Integração com Supabase
- [ ] Configurar cliente Supabase utilizando variáveis/chaves de API (`SUPABASE_URL` e `SUPABASE_ANON_KEY`).
- [ ] Implementar leitura da tabela `items` para carregar o catálogo de insumos na tela.
- [ ] Implementar inserção na tabela `requisitions` ao enviar um novo pedido.
- [ ] Implementar atualização do status da requisição e decremento automático na quantidade em estoque (`quantity_stock`) ao aprovar/entregar o pedido.

## Tarefa 3: Regras de Negócio e Prevenção de Erros
- [ ] Validar se o insumo possui quantidade disponível no estoque antes de permitir a solicitação.
- [ ] Exibir aviso visual caso o usuário já possua uma solicitação pendente para o mesmo item.

## 🛠️ Ajustes Solicitados (Sprint de Correção)
- [ ] Redirecionar a rota inicial (`index.html`) para a tela de Login.
- [ ] Limpar container HTML na exibição dos insumos para evitar duplicação com dados do Supabase.
