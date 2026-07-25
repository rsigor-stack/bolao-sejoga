// ============================================================================
// PERFIL PALPITES
// perfil-pizza.js
// Bloco 1 - Configurações e Helpers
// ============================================================================

'use strict';

const GRUPOS_CONFIG = [
  { key: 'ptsA', rkgKey: 'rkgA', label: 'Grupo A', cor: '#00d4ff' },
  { key: 'ptsB', rkgKey: 'rkgB', label: 'Grupo B', cor: '#08f7a1' },
  { key: 'ptsC', rkgKey: 'rkgC', label: 'Grupo C', cor: '#F5A623' },
  { key: 'ptsD', rkgKey: 'rkgD', label: 'Grupo D', cor: '#A29BFE' },
  { key: 'ptsE', rkgKey: 'rkgE', label: 'Grupo E', cor: '#FF6B9D' },
  { key: 'ptsF', rkgKey: 'rkgF', label: 'Grupo F', cor: '#4ECDC4' },
  { key: 'ptsG', rkgKey: 'rkgG', label: 'Grupo G', cor: '#FFD93D' },
  { key: 'ptsH', rkgKey: 'rkgH', label: 'Grupo H', cor: '#FF8E53' },
  { key: 'ptsI', rkgKey: 'rkgI', label: 'Grupo I', cor: '#6BCB77' },
  { key: 'ptsJ', rkgKey: 'rkgJ', label: 'Grupo J', cor: '#C77DFF' },
  { key: 'ptsK', rkgKey: 'rkgK', label: 'Grupo K', cor: '#F72585' },
  { key: 'ptsL', rkgKey: 'rkgL', label: 'Grupo L', cor: '#4CC9F0' },
];

let pizzaGruposChart = null;

let pizzaChart = null;

// ============================================================================
// RETORNA OS DADOS DO PARTICIPANTE PARA OS GRÁFICOS
// ============================================================================

function getDadosPizza(participante){

    if(
        !App ||
        !App.dados ||
        !Array.isArray(App.dados.onePage)
    ){
        return null;
    }

    return App.dados.onePage.find(row =>
        (row.Participante || '').trim() === participante
    ) || null;

}

// ============================================================================
// CONTROLA A VISIBILIDADE DE UMA SEÇÃO
// ============================================================================

function mostrarSecaoPizza(secao, exibir){

    if(exibir){

        show(secao);

    }else{

        hide(secao);

    }

}

// ============================================================================
// HELPER — formata o badge de ranking (ex.: "1°", "—" se ausente/zero)
// ============================================================================

function _fmtRkg(val) {
  const n = parseInt(val, 10);
  return (!isNaN(n) && n > 0) ? n + 'º' : '—';
}

// ============================================================================
// HELPER — retorna classe CSS de destaque conforme posição
// ============================================================================

function _rkgClass(val) {
  const n = parseInt(val, 10);
  if (isNaN(n) || n <= 0) return '';
  if (n === 1) return 'pizza-rkg-ouro';
  if (n === 2) return 'pizza-rkg-prata';
  if (n === 3) return 'pizza-rkg-bronze';
  return '';
}

function renderPizzaGruposChart(dadosParticipante) {
  const valores = GRUPOS_CONFIG.map(g => Number(dadosParticipante[g.key]) || 0);
  const total   = valores.reduce((a, b) => a + b, 0);

  // Filtra apenas grupos com pontos > 0 para o gráfico
  const ativos = GRUPOS_CONFIG
    .map((g, i) => ({ ...g, valor: valores[i] }))
    .filter(g => g.valor > 0);

   const section = App.ui.secoes.pizzaGrupos;

   mostrarSecaoPizza(
      section,
      total > 0
   );

  // Monta a legenda dinamicamente
  const legendaEl = document.getElementById('pizza-grupos-legenda');
  legendaEl.innerHTML = '';

  GRUPOS_CONFIG.forEach(g => {
    const val = Number(dadosParticipante[g.key]) || 0;
    const pct = total > 0 ? Math.round((val / total) * 100) + '%' : '0%';
    const rkgRaw = dadosParticipante[g.rkgKey];
    const rkgTxt = val > 0 ? _fmtRkg(rkgRaw) : '—';
    const rkgCls = val > 0 ? _rkgClass(rkgRaw) : '';

    const item = document.createElement('div');
    item.className = 'pizza-legenda-item';
    item.style.opacity = val === 0 ? '0.4' : '1';
    item.innerHTML = `
      <span class="pizza-legenda-dot" style="background:${g.cor};color:${g.cor};"></span>
      <div class="pizza-legenda-info">
        <span class="pizza-legenda-label">${g.label}</span>
        <span class="pizza-legenda-valor">${val} pts</span>
      </div>
      <div class="pizza-legenda-direita">
        <span class="pizza-legenda-pct">${pct}</span>
        <span class="pizza-rkg-badge ${rkgCls}" title="Classificação no ${g.label}">${rkgTxt}</span>
      </div>
    `;
    legendaEl.appendChild(item);
  });

  // Linha de total
  const totalRow = document.createElement('div');
  totalRow.className = 'pizza-total-row';
  totalRow.style.gridColumn = '1 / -1';
  totalRow.innerHTML = `
    <span class="pizza-total-label">Total Fase de Grupos</span>
    <span class="pizza-total-valor">${total} pts</span>
  `;
  legendaEl.appendChild(totalRow);

  // Destroi gráfico anterior se existir
  if (pizzaGruposChart) {
    pizzaGruposChart.destroy();
    pizzaGruposChart = null;
  }

  const ctx = document.getElementById('pizza-grupos-canvas').getContext('2d');

  if (total === 0) {
    ctx.clearRect(0, 0, 280, 280);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '14px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sem pontos registrados', 140, 140);
    return;
  }

  const dados  = ativos.length > 0 ? ativos : GRUPOS_CONFIG.map((g, i) => ({ ...g, valor: valores[i] }));
  const bgCores = dados.map(g => g.cor);
  const borderCores = dados.map(() => 'rgba(4,20,45,0.9)');

  pizzaGruposChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: dados.map(g => g.label),
      datasets: [{
        data: dados.map(g => g.valor),
        backgroundColor: bgCores,
        borderColor: borderCores,
        borderWidth: 3,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: false,
      cutout: '58%',
      animation: { animateRotate: true, duration: 800 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return ` ${val} pts (${pct}%)`;
            }
          }
        }
      }
    },
    plugins: [{
      id: 'centroTotalGrupos',
      afterDraw(chart) {
        const { ctx, chartArea: { left, right, top, bottom } } = chart;
        const cx = (left + right) / 2;
        const cy = (top + bottom) / 2;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Montserrat, sans-serif';
        ctx.fillText(total, cx, cy - 8);
        ctx.font = '11px Montserrat, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('pts total', cx, cy + 14);
        ctx.restore();
      }
    }]
  });
}

function renderPizzaChart(dadosParticipante) {
  const r1 = Number(dadosParticipante['Ptos_R1_F1']) || 0;
  const r2 = Number(dadosParticipante['Ptos_R2_F1']) || 0;
  const r3 = Number(dadosParticipante['Ptos_R3_F1']) || 0;
  const total = r1 + r2 + r3;

  const rkg1 = dadosParticipante['Rkg_R1_F1'];
  const rkg2 = dadosParticipante['Rkg_R2_F1'];
  const rkg3 = dadosParticipante['Rkg_R3_F1'];

  const section = App.ui.secoes.pizzaRodadas;

  mostrarSecaoPizza(
      section,
      total > 0
  );

  // Valores na legenda
  document.getElementById('pizza-val-r1').textContent = r1 + ' pts';
  document.getElementById('pizza-val-r2').textContent = r2 + ' pts';
  document.getElementById('pizza-val-r3').textContent = r3 + ' pts';
  document.getElementById('pizza-total').textContent = total + ' pts';

  // Percentuais
  const fmt = (v) => total > 0 ? Math.round((v / total) * 100) + '%' : '0%';
  document.getElementById('pizza-pct-r1').textContent = fmt(r1);
  document.getElementById('pizza-pct-r2').textContent = fmt(r2);
  document.getElementById('pizza-pct-r3').textContent = fmt(r3);

  // Rankings por rodada
  const setRkg = (elId, val, pts) => {
    const el = document.getElementById(elId);
    if (!el) return;
    const txt = pts > 0 ? _fmtRkg(val) : '—';
    const cls = pts > 0 ? _rkgClass(val) : '';
    el.textContent = txt;
    el.className = 'pizza-rkg-badge ' + cls;
  };
  setRkg('pizza-rkg-r1', rkg1, r1);
  setRkg('pizza-rkg-r2', rkg2, r2);
  setRkg('pizza-rkg-r3', rkg3, r3);

  // Destroi gráfico anterior se existir
  if (pizzaChart) {
    pizzaChart.destroy();
    pizzaChart = null;
  }

  const ctx = document.getElementById('pizza-canvas').getContext('2d');

  // Se todos zeros, exibe mensagem
  if (total === 0) {
    ctx.clearRect(0, 0, 280, 280);
    ctx.fillStyle = '#888';
    ctx.font = '14px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sem pontos registrados', 140, 140);
    return;
  }

  pizzaChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Rodada 1', 'Rodada 2', 'Rodada 3'],
      datasets: [{
        data: [r1, r2, r3],
        backgroundColor: ['#F5A623', '#4ECDC4', '#A29BFE'],
        borderColor: ['#1a1a2e', '#1a1a2e', '#1a1a2e'],
        borderWidth: 3,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: false,
      cutout: '58%',
      animation: { animateRotate: true, duration: 800 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return ` ${val} pts (${pct}%)`;
            }
          }
        }
      }
    },
    plugins: [{
      id: 'centroTotal',
      afterDraw(chart) {
        const { ctx, chartArea: { left, right, top, bottom } } = chart;
        const cx = (left + right) / 2;
        const cy = (top + bottom) / 2;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 22px Montserrat, sans-serif';
        ctx.fillText(total, cx, cy - 8);
        ctx.font = '11px Montserrat, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('pts total', cx, cy + 14);
        ctx.restore();
      }
    }]
  });
}

// ============================================================================
// RENDERIZA TODOS OS GRÁFICOS DO PERFIL
// ============================================================================

function renderPizzaResumo(participante){

    const dados = getDadosPizza(participante);

    if(!dados){

        hide(App.ui.secoes.pizzaGrupos);
        hide(App.ui.secoes.pizzaRodadas);

        return;
    }

    renderPizzaGruposChart(dados);

    renderPizzaChart(dados);

}
