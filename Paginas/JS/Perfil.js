// ═══════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO — cole a URL do JSON da aba Palpites
// ═══════════════════════════════════════════════════════════════
const URL_PALPITES = 'https://script.google.com/macros/s/AKfycbw3S0FDdjMZbP0mnyQ4iMDHufuN6QTBtNXcWWpOmCkfqnPHQWiUv15Z0uxagpseoibe/exec?aba=Palpites';

const URL_ELIM = 'https://script.google.com/macros/s/AKfycbzqa0SYv8nPTePgIz33hKwpqFMluqwaRyoKdsfHPPQYipEKdll692Z5fu-7-IiGPXnI/exec?aba=Palpites_Elim';

const URL_ONEP = 'https://script.google.com/macros/s/AKfycbzqa0SYv8nPTePgIz33hKwpqFMluqwaRyoKdsfHPPQYipEKdll692Z5fu-7-IiGPXnI/exec?aba=OnePage';

const URL_HIST = 'https://script.google.com/macros/s/AKfycbzqa0SYv8nPTePgIz33hKwpqFMluqwaRyoKdsfHPPQYipEKdll692Z5fu-7-IiGPXnI/exec?aba=Historico';

const URL_CONQ = 'https://script.google.com/macros/s/AKfycbzqa0SYv8nPTePgIz33hKwpqFMluqwaRyoKdsfHPPQYipEKdll692Z5fu-7-IiGPXnI/exec?aba=Conquistas';


let participanteSelecionado = null;
// ═══════════════════════════════════════════════════════════════
//  DICIONÁRIOS — 48 países da Copa 2026
// ═══════════════════════════════════════════════════════════════
const BANDEIRAS = {
  'Argentina':'ar','Brasil':'br','Colômbia':'co','Equador':'ec',
  'Paraguai':'py','Uruguai':'uy','Canadá':'ca','Curaçao':'cw',
  'Estados Unidos':'us','Haiti':'ht','México':'mx','Panamá':'pa',
  'Alemanha':'de','Áustria':'at','Bélgica':'be',
  'Bósnia e Herzegovina':'ba','Croácia':'hr','Escócia':'gb-sct',
  'Espanha':'es','França':'fr','Holanda':'nl','Inglaterra':'gb-eng',
  'Noruega':'no','Portugal':'pt','República Tcheca':'cz','Suécia':'se',
  'Suíça':'ch','Turquia':'tr','África do Sul':'za','Argélia':'dz',
  'Cabo Verde':'cv','RD Congo':'cd','Costa do Marfim':'ci','Egito':'eg',
  'Gana':'gh','Marrocos':'ma','Senegal':'sn','Tunísia':'tn',
  'Arábia Saudita':'sa','Austrália':'au','Coreia do Sul':'kr',
  'Iraque':'iq','Irã':'ir','Japão':'jp','Jordânia':'jo',
  'Catar':'qa','Uzbequistão':'uz','Nova Zelândia':'nz',
};

const TRIGRAMAS = {
  // CONMEBOL
  'Argentina':'ARG','Brasil':'BRA','Colômbia':'COL','Equador':'ECU',
  'Paraguai':'PAR','Uruguai':'URU',
  // CONCACAF
  'Canadá':'CAN','Curaçao':'CUW','Estados Unidos':'USA',
  'Haiti':'HAI','México':'MEX','Panamá':'PAN',
  // UEFA
  'Alemanha':'GER','Áustria':'AUT','Bélgica':'BEL',
  'Bósnia e Herzegovina':'BIH','Croácia':'CRO','Escócia':'SCO',
  'Espanha':'ESP','França':'FRA','Holanda':'NED','Inglaterra':'ENG',
  'Noruega':'NOR','Portugal':'POR','República Tcheca':'CZE','Suécia':'SWE',
  'Suíça':'SUI','Turquia':'TUR',
  // CAF
  'África do Sul':'RSA','Argélia':'ALG','Cabo Verde':'CPV',
  'Congo DR':'COD','Costa do Marfim':'CIV','Egito':'EGY',
  'Gana':'GHA','Marrocos':'MAR','Senegal':'SEN','Tunísia':'TUN',
  // AFC
  'Arábia Saudita':'KSA','Austrália':'AUS','Coreia do Sul':'KOR',
  'Iraque':'IRQ','Irã':'IRN','Japão':'JPN','Jordânia':'JOR',
  'Catar':'QAT','Uzbequistão':'UZB',
  // OFC
  'Nova Zelândia':'NZL',
};


const ARTILHEIROS = {
  'C.Ronaldo (POR)': {
    foto: 'CRonaldo.jpg',
    nome: 'C. Ronaldo'
  },
  'Endrick (BRA)': {
    foto: 'Endrick.jpg',
    nome: 'Endrick'
  },
  'H. Kane (ENG)': {
    foto: 'Kane.jpg',
    nome: 'H. Kane'
  },
  'L. Henrique (BRA)': {
    foto: 'LHenrique.jpg',
    nome: 'L. Henrique'
  },
  'Mbappé (FRA)': {
    foto: 'Mbappe.jpg',
    nome: 'Mbappé'
  },
  'Neymar Jr. (BRA)': {
    foto: 'Neymar.jpg',
    nome: 'Neymar Jr.'
  },
  'Olise (FRA)': {
    foto: 'Olise.jpg',
    nome: 'Olise'
  },
  'Oyarzabal (ESP)': {
    foto: 'Oyarzabal.jpg',
    nome: 'Oyarzabal'
  },
  'Paquetá (BRA)': {
    foto: 'Paqueta.jpg',
    nome: 'Paquetá'
  },
  'Vini Jr. (BRA)': {
    foto: 'ViniJr.jpg',
    nome: 'Vini Jr.'
  },
  'L.Yamal (ESP)': {
    foto: 'Yamine.jpg',
    nome: 'L. Yamal'
  }
};

const URL_IMAGENS =
'https://sejoganacopa.vercel.app/imagens/';

const PONTOS_ELIM = {
  Segundas:3,
  Oitavas:5,
  Quartas:10,
  Semis:15,
  Final:20,
  Campeao:30,
  Artilheiro:30
};

const FLAG_STYLE_SM = 'width:26px;height:19px;border-radius:2px;object-fit:cover;display:block;margin:0 auto 2px;';

// Célula de time: bandeira grande + trigrama abaixo
function timeCelula(pais) {
  const cod = BANDEIRAS[pais];
  const tri = TRIGRAMAS[pais] || pais.slice(0,3).toUpperCase();
  const img = cod
    ? `<img src="https://flagcdn.com/w40/${cod}.png" style="${FLAG_STYLE_SM}" alt="${pais}">`
    : `<span style="display:block;height:24px;"></span>`;
  return `<div class="jogo-time-cell">${img}<span class="jogo-tri">${tri}</span></div>`;
}

// ═══════════════════════════════════════════════════════════════
//  PARSER — lê o formato gerado pelo Apps Script:
//  Chaves fixas: Data, Hora, Time1, Time2, Real1, Real2
//  Chaves de participante: Nome_pal1, Nome_pal2, Nome_pts
// ═══════════════════════════════════════════════════════════════
function parsearDados(rows) {
  if (!rows.length) return { participantes: [], jogos: [] };

  // Detecta participantes pelas chaves que terminam em _pal1
  const chaves = Object.keys(rows[0]);
  const participantes = chaves
    .filter(k => k.endsWith('_pal1'))
    .map(k => k.replace('_pal1', ''));

  if (!participantes.length) return { participantes: [], jogos: [] };

  // Valor vazio → null
  const val = v => (v === '' || v === null || v === undefined || v === '-') ? null : v;

  const jogos = rows.map(r => {
    const time1 = String(r.Time1 || '').trim();
    const time2 = String(r.Time2 || '').trim();
    if (!time1 && !time2) return null;

    return {
      data:      String(r.Data    || '').trim(),
      horario:   String(r.Hora    || '').trim(),
      time1,
      time2,
      gols1Real: val(r.Real1),
      gols2Real: val(r.Real2),
      palpites:  participantes.map(nome => ({
        nome,
        gols1:  val(r[`${nome}_pal1`]),
        gols2:  val(r[`${nome}_pal2`]),
        pontos: val(r[`${nome}_pts`]),
      })),
    };
  }).filter(Boolean);

  return { participantes: participantes.map(nome => ({ nome })), jogos };
}

// ═══════════════════════════════════════════════════════════════
//  CLASSE CSS DOS PONTOS
// ═══════════════════════════════════════════════════════════════
function ptsClasse(pts) {
  if (pts === null || pts === '') return 'pts-vazio';
  const n = Number(pts);
  if (n === 0) return 'pts-0';
  if (n <= 3)  return 'pts-low';
  if (n <= 6)  return 'pts-mid';
  return 'pts-high';
}

// ═══════════════════════════════════════════════════════════════
//  RENDERIZA RESUMO FASE DE GRUPOS (dados OnePage)
// ═══════════════════════════════════════════════════════════════
function renderResumoFaseGrupos(participante) {

   console.log("Participante:", participante);
   console.log(window.DADOS_ONEP);

  const dados = window.DADOS_ONEP || [];
  const row = dados.find(r =>
    r.Participante === participante ||
    (r.Participante && r.Participante.toLowerCase() === participante.toLowerCase())
  );
  
  console.log("Registro encontrado:", row);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = (val !== undefined && val !== null && val !== '') ? val : '—';
  };

  if (row) {
    set('fg-resultados-corretos', row.ResultCorretos);
    set('fg-ranking-moral',       row.Pos_Moral_Atual);
    set('fg-melhor-class',        row.Melhor_Real);
    set('fg-data-melhor',         row.Quando_Melhor_Real);
    set('fg-jogo-melhor',         row.AposJogo);
  } else {
    ['fg-resultados-corretos','fg-ranking-moral','fg-melhor-class','fg-data-melhor','fg-jogo-melhor']
      .forEach(id => set(id, '—'));
  }

  document.getElementById('fg-resumo-section').style.display = 'block';
}

// ═══════════════════════════════════════════════════════════════
//  RENDERIZA FASE DE GRUPOS — resumo + conquistas
// ═══════════════════════════════════════════════════════════════
function renderTabela(participante, jogos) {

  // Calcula totais para o resumo da barra superior
  let totalPts = 0, exatos = 0, pontuados = 0;
  jogos.forEach(jogo => {
    const p = jogo.palpites.find(x => x.Participante === participante);
    if (!p || p.pontos === null || p.pontos === '') return;
    totalPts += Number(p.pontos);
    if (Number(p.pontos) > 0) pontuados++;
    const temReal    = jogo.gols1Real !== null && jogo.gols2Real !== null;
    const temPalpite = p.gols1 !== null && p.gols2 !== null;
    if (temReal && temPalpite &&
        String(p.gols1) === String(jogo.gols1Real) &&
        String(p.gols2) === String(jogo.gols2Real)) exatos++;
  });

  // Atualiza barra de resumo do participante
  document.getElementById('resumo-nome').textContent   = participante;
  document.getElementById('resumo-pos').textContent    = totalPts;
  document.getElementById('resumo-total').textContent  = totalPts;
  document.getElementById('resumo-exatos').textContent = exatos;
  document.getElementById('resumo-jogos').textContent  = pontuados;
  document.getElementById('resumo-participante').classList.add('visivel');

  // Renderiza as duas seções da aba Fase de Grupos
  renderResumoFaseGrupos(participante);
  renderConquistas(participante);

  document.getElementById('fg-resumo-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════════════════════════
//  RENDERIZA CONQUISTAS DO PARTICIPANTE (dados URL_CONQ)
// ═══════════════════════════════════════════════════════════════
function renderConquistas(participante) {
  const dados = window.DADOS_CONQ || [];
  const row = dados.find(r =>
    r.Participante === participante ||
    (r.Participante && r.Participante.toLowerCase() === participante.toLowerCase())
  );

  function nivelClasse(nivel) {
    if (!nivel || nivel === '-' || nivel === '') return 'bloqueado';
    const n = String(nivel).toLowerCase();
    if (n.includes('ouro')   || n === '3' || n === 'iii') return 'nivel-ouro';
    if (n.includes('prata')  || n === '2' || n === 'ii')  return 'nivel-prata';
    if (n.includes('bronze') || n === '1' || n === 'i')   return 'nivel-bronze';
    return 'nivel-bronze'; // qualquer outro valor válido
  }

  function aplicarCard(cardId, nivelId, descId, nivel, desc) {
    const card    = document.getElementById(cardId);
    const nivelEl = document.getElementById(nivelId);
    const descEl  = document.getElementById(descId);
    if (!card) return;
    const cls = nivelClasse(nivel);
    card.className = 'conq-card ' + cls;
    if (nivelEl) nivelEl.textContent = (nivel && nivel !== '-') ? nivel : '—';
    if (descEl)  descEl.textContent  = (desc  && desc  !== '-') ? desc  : '—';
  }

  const pontoEl = document.getElementById('conq-pontos-total');

  if (!row) {
    if (pontoEl) pontoEl.textContent = '—';
    ['cq-top-ranking','cq-cravadas','cq-pensamento-unico','cq-foguete','cq-trofeu']
      .forEach(id => {
        const c = document.getElementById(id);
        if (c) c.className = 'conq-card bloqueado';
      });
    document.getElementById('conq-section').style.display = 'block';
    return;
  }

  if (pontoEl) pontoEl.textContent = (row.cqPontos !== undefined && row.cqPontos !== '') ? row.cqPontos : '—';

  aplicarCard('cq-top-ranking',      'cq-top-ranking-nivel',      'cq-top-ranking-desc',      row.cqTopRanking,      row.obsTopRanking);
  aplicarCard('cq-pensamento-unico', 'cq-pensamento-unico-nivel', 'cq-pensamento-unico-desc', row.cqPensamentoUnico, row.obsPensamentoUnico);
  aplicarCard('cq-foguete',          'cq-foguete-nivel',          'cq-foguete-desc',          row.cqFoguete,         row.obsFoguete);
  aplicarCard('cq-trofeu',           'cq-trofeu-nivel',           'cq-trofeu-desc',           row.cqTrofeu,          row.obsTrofeu);

  // Placares Exatos — exibe o número de cravadas na descrição
  const clsCrav = nivelClasse(row.cqCravadas);
  const cravCard  = document.getElementById('cq-cravadas');
  const cravNivel = document.getElementById('cq-cravadas-nivel');
  const cravDesc  = document.getElementById('cq-cravadas-desc');
  if (cravCard)  cravCard.className = 'conq-card ' + clsCrav;
  if (cravNivel) cravNivel.textContent = (row.cqCravadas && row.cqCravadas !== '-') ? row.cqCravadas : '—';
  if (cravDesc) {
    const n = row.nCravadas;
    cravDesc.textContent = (n !== undefined && n !== '' && n !== '-') ? n + ' placares exatos' : '—';
  }

  document.getElementById('conq-section').style.display = 'block';
}

// ═══════════════════════════════════════════════════════════════
//  RENDERIZA A TABELA ELIMINATORIAS PARA O PARTICIPANTE SELECIONADO
// ═══════════════════════════════════════════════════════════════
function renderEliminatorias(nome){

    console.log('renderEliminatorias');

    console.log(nome);

    console.log(window.DADOS_ELIM);


  const dados = window.DADOS_ELIM || [];

  if(!dados.length) return;

  const fases = [
    'Segundas',
    'Oitavas',
    'Quartas',
    'Semis',
    'Final',
    'Campeao',
    'Artilheiro'
  ];

  let totalAcertos = 0;
  let totalPontos  = 0;

  let html = '';

  fases.forEach(fase=>{

    const linhas =
      dados.filter(
        x=>x.Fase===fase
      );

const reaisDaFase =
  new Set(
    linhas
      .map(x =>
        String(x.Real || '')
          .trim()
          .toLowerCase()
      )
      .filter(Boolean)
  );


    let acertos = 0;

    const cards =
      linhas.map(l=>{

    const palpite =
     String(l[nome] || '').trim();

const acertou =
  palpite &&
  reaisDaFase.has(
    palpite.toLowerCase()
  );

        if(acertou) acertos++;

if(fase === 'Artilheiro'){

    const jogador =
      ARTILHEIROS[palpite];

    const foto =
      jogador
        ? URL_IMAGENS + jogador.foto
        : '';

    const nomeExibicao =
      jogador
        ? jogador.nome
        : palpite;

    return `

      <div class="elim-team ${acertou?'hit':''}">

        ${
          foto
          ? `
            <img
              class="artilheiro-foto"
              src="${foto}"
              alt="${nomeExibicao}">
          `
          : ''
        }

        <div class="artilheiro-nome">
          ${nomeExibicao}
        </div>

        ${
          acertou
          ? '<div class="elim-ok">✔ ACERTOU</div>'
          : ''
        }

      </div>

    `;
}

const flag =
  BANDEIRAS[palpite];

return `

  <div class="elim-team ${acertou?'hit':''}">

    ${
      flag
      ? `
        <img
          class="elim-flag"
          src="https://flagcdn.com/w80/${flag}.png">
      `
      : ''
    }

    <div class="elim-tri">
      ${TRIGRAMAS[palpite] || ''}
    </div>

    ${
      acertou
      ? '<div class="elim-ok">✔ ACERTOU</div>'
      : ''
    }

  </div>

`;

      }).join('');

    const pontos =
      acertos *
      PONTOS_ELIM[fase];

    totalAcertos += acertos;
    totalPontos  += pontos;

    html += `
      <div class="elim-section">

        <div class="elim-header">

          <div class="elim-title">
            🏆 ${fase} - ${PONTOS_ELIM[fase]} pts/acerto
          </div>

          <div class="elim-score">
            ${acertos} acertos •
            ${pontos} pts
          </div>

        </div>

        <div class="elim-grid">
          ${cards}
        </div>

      </div>
    `;
  });

  document.getElementById(
    'eliminatorias-card'
  ).innerHTML = html;

}


// ═══════════════════════════════════════════════════════════════
//  SELETOR COM BUSCA
// ═══════════════════════════════════════════════════════════════
function renderSeletor(participantes, jogos) {
  const input       = document.getElementById('busca-input');
  const clearBtn    = document.getElementById('busca-clear');
  const lista       = document.getElementById('lista-participantes');
  const scroll      = document.getElementById('lista-scroll');
  const chip        = document.getElementById('selecionado-chip');
  const chipNome    = document.getElementById('chip-nome');
  const chipTrocar  = document.getElementById('chip-trocar');

  let selecionado = null;

  // Renderiza os itens filtrados na lista
  function renderLista(filtro) {
    const termo = (filtro || '').toLowerCase().trim();
    const filtrados = participantes.filter(p =>
      !termo || p.nome.toLowerCase().includes(termo)
    );

    if (!filtrados.length) {
      scroll.innerHTML = `<div class="lista-vazia">Nenhum participante encontrado</div>`;
    } else {
      scroll.innerHTML = filtrados.map((p, i) => `
        <div class="lista-item${selecionado === p.nome ? ' ativo' : ''}"
             data-nome="${p.nome}" tabindex="0">
          <span class="pos-badge">${participantes.indexOf(p) + 1}</span>
          <span class="item-nome">${p.nome}</span>
          <span class="item-seta">›</span>
        </div>`).join('');

      // Eventos dos itens
      scroll.querySelectorAll('.lista-item').forEach(item => {
        item.addEventListener('click', () => selecionar(item.dataset.nome));
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter') selecionar(item.dataset.nome);
        });
      });
    }
  }

  // Seleciona um participante
  function selecionar(nome) {
    selecionado = nome;
    participanteSelecionado = nome;

    // Atualiza chip
    chipNome.textContent = nome;
    chip.classList.add('visivel');

    // Esconde lista e limpa busca
    lista.classList.remove('visivel');
    input.value = '';
    clearBtn.classList.remove('visivel');
    input.blur();

    renderTabela(nome, jogos);
    renderEliminatorias(nome);
  }

  // Abre a lista mostrando todos ao focar no campo
  input.addEventListener('focus', () => {
    renderLista(input.value);
    lista.classList.add('visivel');
  });

  // Filtra conforme digita
  input.addEventListener('input', () => {
    clearBtn.classList.toggle('visivel', input.value.length > 0);
    renderLista(input.value);
    lista.classList.add('visivel');
  });

  // Limpa o campo
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('visivel');
    renderLista('');
    input.focus();
  });

  // Trocar participante: reabre o campo de busca
  chipTrocar.addEventListener('click', () => {
    chip.classList.remove('visivel');
    input.value = '';
    clearBtn.classList.remove('visivel');
    renderLista('');
    lista.classList.add('visivel');
    input.focus();
  });

  // Fecha a lista ao clicar fora
  document.addEventListener('click', e => {
    if (!e.target.closest('.busca-wrap') && !e.target.closest('.lista-participantes')) {
      lista.classList.remove('visivel');
    }
  });

  // Navegação por teclado (↑ ↓ Esc)
  input.addEventListener('keydown', e => {
    const itens = scroll.querySelectorAll('.lista-item');
    const ativo = scroll.querySelector('.lista-item:focus');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (ativo ? ativo.nextElementSibling : itens[0])?.focus();
    } else if (e.key === 'Escape') {
      lista.classList.remove('visivel');
      input.blur();
    }
  });
}

function configurarAbas(){

    const tabJogos =
      document.getElementById('tab-jogos');

    const tabElim =
      document.getElementById('tab-elim');

    const tabGeral =
      document.getElementById('tab-geral');


    if(!tabJogos || !tabElim || !tabGeral){
        console.error('Abas não encontradas');
        return;
    }
    console.log("Config abas acionado");	

    tabJogos.addEventListener('click', () => {
        tabJogos.classList.add('active');
        tabElim.classList.remove('active');
        tabGeral.classList.remove('active');

        document.getElementById('fg-resumo-section').style.display  = participanteSelecionado ? 'block' : 'none';
        document.getElementById('conq-section').style.display        = participanteSelecionado ? 'block' : 'none';
        document.getElementById('eliminatorias-card').style.display  = 'none';
        document.getElementById('geral-card').style.display          = 'none';

        if (participanteSelecionado) {
            renderResumoFaseGrupos(participanteSelecionado);
            renderConquistas(participanteSelecionado);
        }
    });

    tabElim.addEventListener('click', () => {
        tabElim.classList.add('active');
        tabJogos.classList.remove('active');
        tabGeral.classList.remove('active');

        document.getElementById('fg-resumo-section').style.display  = 'none';
        document.getElementById('conq-section').style.display        = 'none';
        document.getElementById('eliminatorias-card').style.display  = 'block';
        document.getElementById('geral-card').style.display          = 'none';

        if (participanteSelecionado) { renderEliminatorias(participanteSelecionado); }
    });

    tabGeral.addEventListener('click', () => {
        tabGeral.classList.add('active');
        tabElim.classList.remove('active');
        tabJogos.classList.remove('active');

        document.getElementById('fg-resumo-section').style.display  = 'none';
        document.getElementById('conq-section').style.display        = 'none';
        document.getElementById('eliminatorias-card').style.display  = 'none';
        document.getElementById('geral-card').style.display          = 'block';

        if (participanteSelecionado) { renderGeral(participanteSelecionado); }
    });



    console.log('Abas configuradas');
}


// ═══════════════════════════════════════════════════════════════
//  BOOTSTRAP
// ═══════════════════════════════════════════════════════════════
async function init() {
  try {

    const [resPalpites, resElim, resOneP, resHist, resConq] =
      await Promise.all([
        fetch(URL_PALPITES),
        fetch(URL_ELIM),
	fetch(URL_ONEP),
	fetch(URL_HIST),
	fetch(URL_CONQ)
      ]);

    if (!resPalpites.ok)
      throw new Error(`Palpites HTTP ${resPalpites.status}`);

    if (!resElim.ok)
      throw new Error(`Eliminatórias HTTP ${resElim.status}`);

    if (!resOneP.ok)
      throw new Error(`OnePage HTTP ${resOneP.status}`);

    if (!resHist.ok)
      throw new Error(`Histórico HTTP ${resHist.status}`);

    if (!resConq.ok)
      throw new Error(`Conquistas HTTP ${resConq.status}`);


    const json =
      await resPalpites.json();

    if (!json.data || !Array.isArray(json.data))
      throw new Error('Formato inesperado nos palpites.');

    const jsonElim =
      await resElim.json();

    console.log('JSON ELIM:', jsonElim);


    // Salva globalmente para renderEliminatorias()
    window.DADOS_ELIM =
      jsonElim.data || jsonElim || [];

    const jsonOneP = await resOneP.json();
    window.DADOS_ONEP = jsonOneP.data || jsonOneP || [];
    console.log('DADOS_ONEP:', window.DADOS_ONEP);

    console.log(
      'DADOS_ELIM:',
      window.DADOS_ELIM
    );

    console.log('JSON ONEP:', jsonOneP);


    const jsonHist =
      await resHist.json();
    
    console.log('JSON HIST:', jsonHist);

    const jsonConq =
      await resConq.json();
    
    console.log('JSON CONQ:', jsonConq);

    // Salva globalmente para renders de interesse
    window.DADOS_ONEP =
      jsonOneP.data || jsonOneP || [];

    console.log(
      'DADOS_ONEP:',
      window.DADOS_ONEP
    );

    window.DADOS_HIST =
      jsonHist.data || jsonHist || [];

    console.log(
      'DADOS_HIST:',
      window.DADOS_HIST
    );

    window.DADOS_CONQ =
      jsonConq.data || jsonConq || [];

    console.log(
      'DADOS_CONQ:',
      window.DADOS_CONQ
    );



    const { participantes, jogos } =
      parsearDados(json.data);




    if (!participantes.length) throw new Error('Nenhum participante encontrado.');

    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('conteudo').style.display      = 'block';

    renderSeletor(participantes, jogos);
    configurarAbas();

    // Pré-seleciona participante se vier via ?participante=Nome na URL
    const params = new URLSearchParams(window.location.search);
    const nomeParam = params.get('participante');
    if (nomeParam) {
      // Busca correspondência exata ou case-insensitive
      const encontrado = participantes.find(p =>
        p.nome === nomeParam ||
        p.nome.toLowerCase() === nomeParam.toLowerCase()
      );
      if (encontrado) {
        // Simula seleção: atualiza chip e abre tabela
        const chip      = document.getElementById('selecionado-chip');
        const chipNome  = document.getElementById('chip-nome');
        chipNome.textContent = encontrado.nome;
        chip.classList.add('visivel');
        renderTabela(encontrado.nome, jogos);
      }
    }

  } catch (e) {
    document.getElementById('loading-state').innerHTML =
      `<div class="error-state">❌ Erro ao carregar palpites.<br><small>${e.message}</small></div>`;
  }
}

init();
