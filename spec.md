# SPEC - Sistema Interno de Requisição e Controle de Insumos de TI

## 1. Visão Geral
Sistema web interno para gestão, requisição e controle do estoque de insumos de TI e escritório (papel, toners, periféricos), reduzindo duplicidade de pedidos e perda de materiais.

## 2. Usuários e Papéis
- **Colaborador / Solicitante**: Pode visualizar insumos disponíveis, abrir requisições e acompanhar o status dos seus pedidos.
- **Gestor de TI / Administrador**: Pode gerenciar o estoque (CRUD de insumos), aprovar ou rejeitar requisições, registrar entradas/saídas e visualizar relatórios básicos.

## 3. Funcionalidades Principais
1. **Autenticação**: Login simples para funcionários e gestores.
2. **Catálogo & Estoque de Insumos**:
   - Cadastro de itens (ex: Toner HP, Resma A4, Mouse USB).
   - Quantidade em estoque atual e alerta de estoque mínimo.
3. **Módulo de Requisição**:
   - Criação de nova requisição escolhendo item, quantidade e justificativa.
   - Bloqueio/Alerta de solicitações duplicadas pendentes para o mesmo usuário/item.
4. **Aprovação e Controle**:
   - Painel para o Gestor aprovar, rejeitar ou finalizar a entrega do insumo.
   - Baixa automática no estoque após a entrega/aprovação.
5. **Histórico e Logs**:
   - Registro de movimentações de estoque (quem pediu, quantidade, data, responsável pela liberação).

## 4. Requisitos Técnicos
- **Frontend**: HTML5, CSS3, JavaScript (compatível com Google Stitch / SPA estática).
- **Backend / Banco de Dados**: Supabase (PostgreSQL + REST API).