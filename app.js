/**
 * StockTI - Application Logic
 * Integrates Supabase with SPA Views (Insumos, Nova Solicitação, Minhas Requisições, Painel Admin)
 */

// 1. SUPABASE CLIENT CONFIGURATION
const SUPABASE_URL = 'https://fwisrawxqogrkuvfgpsh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MeUyT7SMIXpHhEmhl0kGnA_dUF9h29u';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// STATE
let currentUser = {
  id: '0ced722f-47bc-4ecb-8efc-38e536206923', // Default Admin Carlos Eduardo
  email: 'carlos.eduardo@empresa.com.br',
  full_name: 'Carlos Eduardo',
  role: 'admin'
};

let cachedItems = [];
let cachedCategories = [];
let cachedRequisitions = [];

// DOM LOAD INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
  initRouting();
  await loadCategories();
  await loadUserProfiles();
  updateHeaderUserDisplay();

  // Handle hash route or default to #insumos
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
});

// 2. ROUTING & VIEW NAVIGATION
function initRouting() {
  document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const route = link.getAttribute('data-route');
      window.location.hash = route;
    });
  });

  const btnSwitchUser = document.getElementById('btn-switch-user');
  if (btnSwitchUser) {
    btnSwitchUser.addEventListener('click', () => {
      // Toggle between Colaborador and Admin
      if (currentUser.role === 'admin') {
        selectLoginProfile('solicitante');
      } else {
        selectLoginProfile('admin');
      }
      showToast('Perfil Alterado', `Alternado para perfil: ${currentUser.full_name} (${currentUser.role})`);
    });
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'insumos';
  showView(hash);
}

function showView(viewId) {
  // Hide all view sections
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.add('hidden');
  });

  // Active nav highlighting
  document.querySelectorAll('#nav-links a').forEach(link => {
    if (link.getAttribute('data-route') === viewId) {
      link.classList.add('bg-slate-100', 'text-brand-royal', 'font-bold');
    } else {
      link.classList.remove('bg-slate-100', 'text-brand-royal', 'font-bold');
    }
  });

  const targetSection = document.getElementById(`view-${viewId}`);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    // Load view specific data
    switch (viewId) {
      case 'insumos':
        loadInsumosView();
        break;
      case 'nova-solicitacao':
        loadNovaSolicitacaoView();
        break;
      case 'minhas-requisicoes':
        loadMinhasRequisicoesView();
        break;
      case 'admin':
        loadAdminView();
        break;
      case 'login':
        // Login view handles itself
        break;
      default:
        loadInsumosView();
    }
  } else {
    // Default fallback
    document.getElementById('view-insumos').classList.remove('hidden');
    loadInsumosView();
  }
}

// 3. USER MANAGEMENT & PROFILES
async function loadUserProfiles() {
  const { data: profiles, error } = await supabaseClient.from('profiles').select('*');
  if (!error && profiles && profiles.length > 0) {
    // Sync current user with real DB profiles
    const admin = profiles.find(p => p.role === 'admin');
    if (admin) currentUser = admin;
  }
}

function selectLoginProfile(role) {
  if (role === 'admin') {
    currentUser = {
      id: '0ced722f-47bc-4ecb-8efc-38e536206923',
      email: 'carlos.eduardo@empresa.com.br',
      full_name: 'Carlos Eduardo',
      role: 'admin'
    };
  } else {
    currentUser = {
      id: 'fe59b730-b832-4a13-b87f-0b346bccdeb8',
      email: 'solicitante@empresa.com.br',
      full_name: 'João Silva',
      role: 'solicitante'
    };
  }
  updateHeaderUserDisplay();

  // Refresh current view if needed
  const currentView = window.location.hash.replace('#', '') || 'insumos';
  showView(currentView);
}

function updateHeaderUserDisplay() {
  document.getElementById('header-user-name').textContent = currentUser.full_name;
  document.getElementById('header-user-role').textContent = currentUser.role === 'admin' ? 'Gestor TI (Admin)' : 'Colaborador';
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const name = document.getElementById('login-name').value;
  currentUser.email = email;
  currentUser.full_name = name;
  updateHeaderUserDisplay();
  showToast('Acesso Realizado', `Bem-vindo(a), ${name}!`);
  window.location.hash = 'insumos';
}

// 4. DATA FETCHING - CATEGORIES & ITEMS
async function loadCategories() {
  const { data, error } = await supabaseClient.from('categories').select('*');
  if (!error && data) {
    cachedCategories = data;
    populateCategoryDropdowns();
  }
}

function populateCategoryDropdowns() {
  const filterCatSelect = document.getElementById('filter-category');
  const newItemCatSelect = document.getElementById('item-category');

  if (filterCatSelect) {
    filterCatSelect.innerHTML = '<option value="all">Todas as Categorias</option>';
    cachedCategories.forEach(c => {
      filterCatSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  if (newItemCatSelect) {
    newItemCatSelect.innerHTML = '';
    cachedCategories.forEach(c => {
      newItemCatSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }
}

async function fetchItemsFromSupabase() {
  const { data, error } = await supabaseClient
    .from('items')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  if (!error && data) {
    cachedItems = data;
  } else {
    console.error('Erro ao carregar insumos:', error);
  }
  return cachedItems;
}

// 5. VIEW: INSUMOS EM ESTOQUE
async function loadInsumosView() {
  const items = await fetchItemsFromSupabase();
  renderInsumosKPIs(items);
  renderInsumosGrid(items);
}

function renderInsumosKPIs(items) {
  const totalTypes = items.length;
  const totalStock = items.reduce((acc, curr) => acc + curr.quantity_stock, 0);
  const lowStockCount = items.filter(i => i.quantity_stock <= i.min_quantity_warning).length;

  document.getElementById('kpi-total-items').textContent = totalTypes;
  document.getElementById('kpi-total-stock').textContent = totalStock;
  document.getElementById('kpi-low-stock').textContent = lowStockCount;
}

function renderInsumosGrid(items) {
  const grid = document.getElementById('insumos-grid');
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        <span class="material-symbols-outlined text-4xl text-slate-400 mb-2">search_off</span>
        <p class="font-medium">Nenhum insumo cadastrado ou encontrado.</p>
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const isLowStock = item.quantity_stock <= item.min_quantity_warning;
    const isOutOfStock = item.quantity_stock <= 0;
    const categoryName = item.categories ? item.categories.name : 'Geral';

    let badgeHtml = '';
    if (isOutOfStock) {
      badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Esgotado</span>`;
    } else if (isLowStock) {
      badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Estoque Baixo (${item.quantity_stock}/${item.min_quantity_warning})</span>`;
    } else {
      badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Disponível</span>`;
    }

    const card = document.createElement('div');
    card.className = `bg-white rounded-2xl border ${isLowStock ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'} p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all`;

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wider">
            ${categoryName}
          </span>
          ${badgeHtml}
        </div>
        <h3 class="font-bold text-slate-900 text-base mb-1">${item.name}</h3>
        <p class="text-xs text-slate-500 line-clamp-2 mb-4">${item.description || 'Sem descrição cadastrada.'}</p>

        <div class="bg-slate-50 p-3 rounded-xl mb-4">
          <div class="flex justify-between items-center text-xs font-medium text-slate-600 mb-1">
            <span>Estoque Físico</span>
            <span class="font-bold text-slate-900">${item.quantity_stock} un <span class="text-slate-400 font-normal">(Mín: ${item.min_quantity_warning})</span></span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div class="${isLowStock ? 'bg-amber-500' : 'bg-brand-royal'} h-2 rounded-full transition-all" style="width: ${Math.min(100, (item.quantity_stock / 20) * 100)}%"></div>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span class="text-[11px] text-slate-400">ID: ${item.id.substring(0, 8)}...</span>
        <button onclick="preSelectRequestItem('${item.id}')" ${isOutOfStock ? 'disabled' : ''} class="px-3 py-1.5 bg-brand-navy hover:bg-brand-royal disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
          <span class="material-symbols-outlined text-[16px]">add_shopping_cart</span>
          <span>Solicitar</span>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterInsumosGrid() {
  const searchTerm = (document.getElementById('search-insumos').value || '').toLowerCase();
  const categoryId = document.getElementById('filter-category').value;
  const stockStatus = document.getElementById('filter-stock-status').value;

  const filtered = cachedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm) || (item.description && item.description.toLowerCase().includes(searchTerm));
    const matchesCat = categoryId === 'all' || item.category_id === categoryId;

    let matchesStock = true;
    if (stockStatus === 'disponivel') matchesStock = item.quantity_stock > item.min_quantity_warning;
    if (stockStatus === 'baixo') matchesStock = item.quantity_stock > 0 && item.quantity_stock <= item.min_quantity_warning;
    if (stockStatus === 'esgotado') matchesStock = item.quantity_stock <= 0;

    return matchesSearch && matchesCat && matchesStock;
  });

  renderInsumosGrid(filtered);
}

function preSelectRequestItem(itemId) {
  window.location.hash = 'nova-solicitacao';
  setTimeout(() => {
    const select = document.getElementById('select-item-solicitacao');
    if (select) {
      select.value = itemId;
      handleSolicitacaoItemChange();
    }
  }, 100);
}

// 6. VIEW: NOVA SOLICITAÇÃO
async function loadNovaSolicitacaoView() {
  await fetchItemsFromSupabase();
  const select = document.getElementById('select-item-solicitacao');
  select.innerHTML = '<option value="" disabled selected>Selecione um insumo disponível...</option>';

  cachedItems.forEach(item => {
    const isOutOfStock = item.quantity_stock <= 0;
    select.innerHTML += `<option value="${item.id}" ${isOutOfStock ? 'disabled' : ''} data-stock="${item.quantity_stock}">
      ${item.name} (${item.quantity_stock} em estoque) ${isOutOfStock ? '- ESGOTADO' : ''}
    </option>`;
  });

  // Check pending requisitions for current user to show alert if any
  checkPendingRequestsForAlert();
}

async function checkPendingRequestsForAlert() {
  const alertBox = document.getElementById('pending-request-alert');
  const alertMsg = document.getElementById('pending-request-alert-msg');

  const { data: pendingReqs, error } = await supabaseClient
    .from('requisitions')
    .select('*, items(name)')
    .eq('user_id', currentUser.id)
    .eq('status', 'pendente');

  if (!error && pendingReqs && pendingReqs.length > 0) {
    const itemsList = pendingReqs.map(r => r.items ? r.items.name : 'Insumo').join(', ');
    alertMsg.textContent = `Você possui solicitação(ões) pendente(s) em análise para: ${itemsList}.`;
    alertBox.classList.remove('hidden');
  } else {
    alertBox.classList.add('hidden');
  }
}

function handleSolicitacaoItemChange() {
  const select = document.getElementById('select-item-solicitacao');
  const itemId = select.value;
  const item = cachedItems.find(i => i.id === itemId);
  const hint = document.getElementById('stock-available-hint');
  const inputQty = document.getElementById('input-qtd-solicitacao');

  if (item) {
    hint.textContent = `Estoque disponível: ${item.quantity_stock} unidades.`;
    inputQty.max = item.quantity_stock;
    if (parseInt(inputQty.value) > item.quantity_stock) {
      inputQty.value = item.quantity_stock;
    }
    // Check if user already has pending request for THIS specific item
    checkPendingForSpecificItem(item.id, item.name);
  } else {
    hint.textContent = 'Selecione um item para ver o estoque';
  }
}

async function checkPendingForSpecificItem(itemId, itemName) {
  const { data: pending, error } = await supabaseClient
    .from('requisitions')
    .select('*')
    .eq('user_id', currentUser.id)
    .eq('item_id', itemId)
    .eq('status', 'pendente');

  const alertBox = document.getElementById('pending-request-alert');
  const alertMsg = document.getElementById('pending-request-alert-msg');

  if (!error && pending && pending.length > 0) {
    alertMsg.textContent = `Você JÁ possui uma solicitação pendente para "${itemName}" (${pending[0].quantity} un). Evite enviar em duplicidade!`;
    alertBox.classList.remove('hidden');
  }
}

function validateSolicitacaoQty() {
  const select = document.getElementById('select-item-solicitacao');
  const itemId = select.value;
  const item = cachedItems.find(i => i.id === itemId);
  const inputQty = document.getElementById('input-qtd-solicitacao');

  if (item) {
    let val = parseInt(inputQty.value) || 1;
    if (val > item.quantity_stock) {
      inputQty.value = item.quantity_stock;
      showToast('Aviso de Estoque', `Quantidade ajustada para o máximo disponível (${item.quantity_stock}).`);
    }
  }
}

async function handleNovaSolicitacaoSubmit(event) {
  event.preventDefault();
  const itemId = document.getElementById('select-item-solicitacao').value;
  const quantity = parseInt(document.getElementById('input-qtd-solicitacao').value);
  const justification = document.getElementById('input-justificativa').value;

  if (!itemId) {
    showToast('Erro', 'Selecione um insumo válido.');
    return;
  }

  const item = cachedItems.find(i => i.id === itemId);
  if (!item || item.quantity_stock < quantity) {
    showToast('Estoque Insuficiente', 'Não há quantidade suficiente em estoque.');
    return;
  }

  const btn = document.getElementById('btn-submit-solicitacao');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  // Insert into requisitions table
  const { data, error } = await supabaseClient
    .from('requisitions')
    .insert([{
      user_id: currentUser.id,
      item_id: itemId,
      quantity: quantity,
      justification: justification,
      status: 'pendente'
    }])
    .select();

  btn.disabled = false;
  btn.innerHTML = `<span>Enviar Solicitação</span><span class="material-symbols-outlined text-[18px]">send</span>`;

  if (error) {
    console.error('Erro ao enviar solicitação:', error);
    showToast('Erro', 'Falha ao salvar a requisição no Supabase.');
  } else {
    showToast('Sucesso!', 'Requisição enviada com sucesso ao Gestor.');
    document.getElementById('form-nova-solicitacao').reset();
    window.location.hash = 'minhas-requisicoes';
  }
}

// 7. VIEW: MINHAS REQUIOSIÇÕES
async function loadMinhasRequisicoesView() {
  const container = document.getElementById('minhas-reqs-list');
  container.innerHTML = '<div class="text-center py-8 text-slate-500">Carregando suas requisições...</div>';

  const { data, error } = await supabaseClient
    .from('requisitions')
    .select('*, items(name, description)')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar requisições:', error);
    container.innerHTML = '<div class="text-center py-8 text-rose-500">Erro ao carregar dados.</div>';
    return;
  }

  cachedRequisitions = data || [];
  renderMinhasRequisicoes('all');
}

function renderMinhasRequisicoes(filterStatus) {
  const container = document.getElementById('minhas-reqs-list');
  container.innerHTML = '';

  const filtered = cachedRequisitions.filter(req => {
    if (filterStatus === 'all') return true;
    return req.status === filterStatus;
  });

  // Also update KPI user reqs
  document.getElementById('kpi-user-reqs').textContent = cachedRequisitions.length;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
        <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
        <p class="font-medium">Nenhuma requisição encontrada nesta categoria.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(req => {
    const itemName = req.items ? req.items.name : 'Insumo Removido';
    const dateStr = new Date(req.created_at).toLocaleString('pt-BR');

    let statusBadge = '';
    let statusBorder = 'border-slate-200';

    if (req.status === 'pendente') {
      statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>Pendente</span>`;
      statusBorder = 'border-amber-300 border-l-4 border-l-amber-500';
    } else if (req.status === 'aprovado' || req.status === 'entregue') {
      statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">check_circle</span>Aprovado / Entregue</span>`;
      statusBorder = 'border-emerald-300 border-l-4 border-l-emerald-500';
    } else if (req.status === 'rejeitado') {
      statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">cancel</span>Rejeitado</span>`;
      statusBorder = 'border-rose-300 border-l-4 border-l-rose-500';
    }

    const card = document.createElement('div');
    card.className = `bg-white rounded-2xl border ${statusBorder} p-6 shadow-sm space-y-3`;

    card.innerHTML = `
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-900 text-lg">${itemName}</h3>
            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold">${req.quantity} un</span>
          </div>
          <span class="text-xs text-slate-400">ID: ${req.id} • Solicitado em: ${dateStr}</span>
        </div>
        ${statusBadge}
      </div>

      <div class="bg-slate-50 p-3 rounded-xl text-xs text-slate-700">
        <strong class="text-slate-900">Justificativa:</strong> "${req.justification || 'Não informada'}"
      </div>

      ${req.status === 'pendente' ? `
        <div class="flex justify-end pt-2">
          <button onclick="cancelarRequisicao('${req.id}')" class="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">delete</span>
            Cancelar Requisição
          </button>
        </div>
      ` : ''}
    `;

    container.appendChild(card);
  });
}

function filterMinhasReqs(status) {
  document.querySelectorAll('.req-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-status') === status) {
      btn.className = 'req-tab-btn active px-4 py-2 text-xs font-bold rounded-lg bg-brand-navy text-white transition-all';
    } else {
      btn.className = 'req-tab-btn px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-all';
    }
  });
  renderMinhasRequisicoes(status);
}

async function cancelarRequisicao(reqId) {
  if (confirm('Deseja cancelar esta solicitação pendente?')) {
    const { error } = await supabaseClient
      .from('requisitions')
      .delete()
      .eq('id', reqId);

    if (error) {
      showToast('Erro', 'Não foi possível cancelar a requisição.');
    } else {
      showToast('Cancelada', 'Requisição removida com sucesso.');
      loadMinhasRequisicoesView();
    }
  }
}

// 8. VIEW: PAINEL ADMIN DE APROVAÇÃO
async function loadAdminView() {
  const container = document.getElementById('admin-reqs-list');
  container.innerHTML = '<div class="text-center py-8 text-slate-500">Carregando solicitações para gestão...</div>';

  const { data, error } = await supabaseClient
    .from('requisitions')
    .select('*, items(id, name, quantity_stock), profiles(full_name, email)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar admin:', error);
    container.innerHTML = '<div class="text-center py-8 text-rose-500">Erro ao carregar requisições.</div>';
    return;
  }

  cachedRequisitions = data || [];
  renderAdminRequisicoes('pendente');
}

function renderAdminRequisicoes(filterStatus) {
  const container = document.getElementById('admin-reqs-list');
  container.innerHTML = '';

  const filtered = cachedRequisitions.filter(req => {
    if (filterStatus === 'all') return true;
    return req.status === filterStatus;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
        <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">task_alt</span>
        <p class="font-medium">Nenhuma requisição ${filterStatus === 'pendente' ? 'pendente de aprovação' : 'encontrada'}.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(req => {
    const itemName = req.items ? req.items.name : 'Insumo N/A';
    const currentStock = req.items ? req.items.quantity_stock : 0;
    const userName = req.profiles ? req.profiles.full_name : 'Usuário';
    const userEmail = req.profiles ? req.profiles.email : '';
    const dateStr = new Date(req.created_at).toLocaleString('pt-BR');

    let statusBadge = '';
    if (req.status === 'pendente') {
      statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Aguardando Aprovação</span>`;
    } else if (req.status === 'aprovado') {
      statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Aprovado</span>`;
    } else if (req.status === 'rejeitado') {
      statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Rejeitado</span>`;
    }

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4';

    card.innerHTML = `
      <div class="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span class="text-xs text-brand-royal font-bold uppercase tracking-wider">Solicitante: ${userName} (${userEmail})</span>
          <h3 class="font-bold text-slate-900 text-lg mt-0.5">${itemName}</h3>
          <span class="text-xs text-slate-400">Data: ${dateStr} • ID: ${req.id}</span>
        </div>
        ${statusBadge}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
        <div>
          <span class="text-slate-500 block">Qtd. Solicitada</span>
          <strong class="text-slate-900 text-sm">${req.quantity} un</strong>
        </div>
        <div>
          <span class="text-slate-500 block">Estoque Atual em Tabela</span>
          <strong class="${currentStock < req.quantity ? 'text-rose-600' : 'text-slate-900'} text-sm">${currentStock} un</strong>
        </div>
        <div>
          <span class="text-slate-500 block">Impacto Pós-Aprovação</span>
          <strong class="text-brand-royal text-sm">${currentStock - req.quantity} un</strong>
        </div>
      </div>

      <div class="text-xs text-slate-700 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
        <strong class="text-amber-950">Justificativa do Solicitante:</strong> "${req.justification || 'Nenhuma'}"
      </div>

      ${req.status === 'pendente' ? `
        <div class="flex items-center justify-end gap-3 pt-2">
          <button onclick="rejeitarRequisicao('${req.id}')" class="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-rose-600 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">close</span>
            Rejeitar
          </button>
          <button onclick="aprovarRequisicao('${req.id}', '${req.item_id}', ${req.quantity}, ${currentStock})" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">check</span>
            Aprovar e Dar Baixa no Estoque
          </button>
        </div>
      ` : ''}
    `;

    container.appendChild(card);
  });
}

function filterAdminReqs(status) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-status') === status) {
      btn.className = 'admin-tab-btn active px-4 py-2 text-xs font-bold rounded-lg bg-brand-navy text-white transition-all';
    } else {
      btn.className = 'admin-tab-btn px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-all';
    }
  });
  renderAdminRequisicoes(status);
}

// APPROVE REQUISITION AND DECREMENT STOCK IN `items` TABLE
async function aprovarRequisicao(reqId, itemId, qtyRequested, currentStock) {
  if (currentStock < qtyRequested) {
    if (!confirm('Atenção: O estoque atual é menor que a quantidade solicitada! Deseja aprovar mesmo assim?')) {
      return;
    }
  }

  const newStock = Math.max(0, currentStock - qtyRequested);

  // 1. Update requisition status to 'aprovado'
  const { error: reqError } = await supabaseClient
    .from('requisitions')
    .update({ status: 'aprovado', updated_at: new Date().toISOString() })
    .eq('id', reqId);

  if (reqError) {
    console.error('Erro ao aprovar requisição:', reqError);
    showToast('Erro', 'Falha ao atualizar status da requisição.');
    return;
  }

  // 2. Decrement quantity_stock in items table
  const { error: itemError } = await supabaseClient
    .from('items')
    .update({ quantity_stock: newStock })
    .eq('id', itemId);

  if (itemError) {
    console.error('Erro ao decrementar estoque:', itemError);
    showToast('Aviso', 'Requisição aprovada, mas falhou ao atualizar a tabela de itens.');
  } else {
    showToast('Aprovado!', `Requisição aprovada e estoque atualizado para ${newStock} unidades.`);
  }

  loadAdminView();
}

async function rejeitarRequisicao(reqId) {
  if (confirm('Confirma a rejeição desta requisição?')) {
    const { error } = await supabaseClient
      .from('requisitions')
      .update({ status: 'rejeitado', updated_at: new Date().toISOString() })
      .eq('id', reqId);

    if (error) {
      showToast('Erro', 'Falha ao rejeitar requisição.');
    } else {
      showToast('Rejeitado', 'Requisição marcada como rejeitada.');
      loadAdminView();
    }
  }
}

// 9. NEW ITEM MODAL (ADMIN CRUD)
function openNewItemModal() {
  populateCategoryDropdowns();
  document.getElementById('modal-new-item').classList.remove('hidden');
  document.getElementById('modal-new-item').classList.add('flex');
}

function closeNewItemModal() {
  document.getElementById('modal-new-item').classList.add('hidden');
  document.getElementById('modal-new-item').classList.remove('flex');
  document.getElementById('form-new-item').reset();
}

async function handleNewItemSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('item-name').value;
  const categoryId = document.getElementById('item-category').value;
  const description = document.getElementById('item-desc').value;
  const quantityStock = parseInt(document.getElementById('item-stock').value);
  const minQuantityWarning = parseInt(document.getElementById('item-min-warning').value);

  const { data, error } = await supabaseClient
    .from('items')
    .insert([{
      name: name,
      category_id: categoryId || null,
      description: description,
      quantity_stock: quantityStock,
      min_quantity_warning: minQuantityWarning
    }])
    .select();

  if (error) {
    console.error('Erro ao cadastrar novo insumo:', error);
    showToast('Erro', 'Não foi possível cadastrar o insumo.');
  } else {
    showToast('Insumo Cadastrado!', `"${name}" adicionado ao estoque.`);
    closeNewItemModal();
    loadInsumosView();
  }
}

// 10. TOAST NOTIFICATION UTILITY
function showToast(title, message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-msg').textContent = message;

  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 4000);
}
