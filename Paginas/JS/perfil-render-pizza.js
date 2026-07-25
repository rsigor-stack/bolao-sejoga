/* =========================================================
   PIZZA GRUPOS — Pontos por Grupo da Fase de Grupos
   Colunas esperadas na aba OnePage: ptsA … ptsL
   ========================================================= */

const GRUPOS_CONFIG = [
  { key: 'ptsA', label: 'Grupo A', cor: '#00d4ff' },
  { key: 'ptsB', label: 'Grupo B', cor: '#08f7a1' },
  { key: 'ptsC', label: 'Grupo C', cor: '#F5A623' },
  { key: 'ptsD', label: 'Grupo D', cor: '#A29BFE' },
  { key: 'ptsE', label: 'Grupo E', cor: '#FF6B9D' },
  { key: 'ptsF', label: 'Grupo F', cor: '#4ECDC4' },
  { key: 'ptsG', label: 'Grupo G', cor: '#FFD93D' },
  { key: 'ptsH', label: 'Grupo H', cor: '#FF8E53' },
  { key: 'ptsI', label: 'Grupo I', cor: '#6BCB77' },
  { key: 'ptsJ', label: 'Grupo J', cor: '#C77DFF' },
  { key: 'ptsK', label: 'Grupo K', cor: '#F72585' },
  { key: 'ptsL', label: 'Grupo L', cor: '#4CC9F0' },
];

let pizzaGruposChart = null;

function renderPizzaGruposChart(dadosParticipante) {
  const valores = GRUPOS_CONFIG.map(g => Number(dadosParticipante[g.key]) || 0);
  const total   = valores.reduce((a, b) => a + b, 0);

  // Filtra apenas grupos com pontos > 0 para o gráfico
  const ativos = GRUPOS_CONFIG
    .map((g, i) => ({ ...g, valor: valores[i] }))
    .filter(g => g.valor > 0);

  const section = document.getElementById('pizza-grupos-section');
  section.style.display = 'block';

  // Monta a legenda dinamicamente
  const legendaEl = document.getElementById('pizza-grupos-legenda');
  legendaEl.innerHTML = '';

  GRUPOS_CONFIG.forEach(g => {
    const val = Number(dadosParticipante[g.key]) || 0;
    const pct = total > 0 ? Math.round((val / total) * 100) + '%' : '0%';
    const item = document.createElement('div');
    item.className = 'pizza-legenda-item';
    item.style.opacity = val === 0 ? '0.4' : '1';
    item.innerHTML = `
      <span class="pizza-legenda-dot" style="background:${g.cor};color:${g.cor};"></span>
      <div class="pizza-legenda-info">
        <span class="pizza-legenda-label">${g.label}</span>
        <span class="pizza-legenda-valor">${val} pts</span>
      </div>
      <span class="pizza-legenda-pct">${pct}</span>
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

function tryPizzaGruposFromApp() {
  const nomeAtual = (document.getElementById('chip-nome') || {}).textContent.trim();
  if (!nomeAtual) return;
  const lista = App && App.dados && Array.isArray(App.dados.onePage)
    ? App.dados.onePage : null;
  if (!lista) return;
  const participante = lista.find(r => (r['Participante'] || '').trim() === nomeAtual);
  if (participante) renderPizzaGruposChart(participante);
}

// Observa o chip-nome (mesmo padrão do gráfico de rodadas)
const chipNomeGrupos = document.getElementById('chip-nome');
if (chipNomeGrupos) {
  new MutationObserver(() => {
    if (chipNomeGrupos.textContent.trim()) {
      setTimeout(tryPizzaGruposFromApp, 200);
    }
  }).observe(chipNomeGrupos, { childList: true, subtree: true, characterData: true });
}

document.addEventListener('participante-selecionado', (e) => {
  if (e.detail) renderPizzaGruposChart(e.detail);
});
</script>

<script>
/* =========================================================
   PIZZA CHART — Pontos por Rodada da Fase de Grupos
   Colunas esperadas na aba OnePage:
     Ptos_R1_F1  Ptos_R2_F1  Ptos_R3_F1
   ========================================================= */

let pizzaChart = null;

function renderPizzaChart(dadosParticipante) {
  const r1 = Number(dadosParticipante['Ptos_R1_F1']) || 0;
  const r2 = Number(dadosParticipante['Ptos_R2_F1']) || 0;
  const r3 = Number(dadosParticipante['Ptos_R3_F1']) || 0;
  const total = r1 + r2 + r3;

  const section = document.getElementById('pizza-section');
  section.style.display = 'block';

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

/* ----------------------------------------------------------
   Integração via App.dados.onePage
   MutationObserver no chip-nome → busca o participante pelo nome
   no array App.dados.onePage assim que ele é selecionado.
   ---------------------------------------------------------- */

function tryPizzaFromApp() {
  const nomeAtual = (document.getElementById('chip-nome') || {}).textContent.trim();
  if (!nomeAtual) return;

  const lista = App && App.dados && Array.isArray(App.dados.onePage)
    ? App.dados.onePage
    : null;

  if (!lista) return;

  const participante = lista.find(r =>
    (r['Participante'] || '').trim() === nomeAtual
  );

  if (participante) renderPizzaChart(participante);
}

// Observa mudanças no chip do nome selecionado
const chipNome = document.getElementById('chip-nome');
if (chipNome) {
  new MutationObserver(() => {
    if (chipNome.textContent.trim()) {
      setTimeout(tryPizzaFromApp, 200);
    }
  }).observe(chipNome, { childList: true, subtree: true, characterData: true });
}

// Também escuta evento customizado, caso os scripts o disparem
document.addEventListener('participante-selecionado', (e) => {
  if (e.detail) renderPizzaChart(e.detail);
});
