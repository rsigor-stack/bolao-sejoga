// ============================================================================
// PERFIL PALPITES
// perfil-render-base.js
// Bloco 1 - Helpers de Renderização
// ============================================================================

'use strict';


// ============================================================================
// HTML
// ============================================================================

function setHTML(id, html) {

    const el = $(id);

    if (el)
        el.innerHTML = html;

}

function limpar(id) {

    setHTML(id, '');

}



// ============================================================================
// CLASSES CSS
// ============================================================================

function addClass(id, classe) {

    const el = $(id);

    if (el)
        el.classList.add(classe);

}

function removeClass(id, classe) {

    const el = $(id);

    if (el)
        el.classList.remove(classe);

}

function toggleClass(id, classe, ativo) {

    const el = $(id);

    if (!el)
        return;

    el.classList.toggle(classe, ativo);

}



// ============================================================================
// PREENCHIMENTO DE CAMPOS
// ============================================================================

function preencherCampos(mapa, dados) {

    Object.entries(mapa).forEach(([id, campo]) => {

        setText(

            id,

            dados?.[campo]

        );

    });

}



// ============================================================================
// BADGES
// ============================================================================

function badgeNivel(nivel) {

    if (!nivel)
        return '—';

    return nivel;

}

function classeNivel(nivel) {
    const map = {
        'Ouro':   'nivel-ouro',
        'Prata':  'nivel-prata',
        'Bronze': 'nivel-bronze',
    };
    return map[nivel] ?? 'bloqueado';
}



// ============================================================================
// COMPONENTE DE CONQUISTA
// ============================================================================

function atualizarCardConquista({

    card,

    badge,

    descricao,

    nivel,

    texto

}) {

    const cardEl = $(card);

    const badgeEl = $(badge);

    const descEl = $(descricao);

    if (!cardEl)
        return;

    cardEl.classList.remove(

        'ouro',

        'prata',

        'bronze',

        'bloqueado',

    'nivel-ouro',
    'nivel-prata',
    'nivel-bronze',
    'bloqueado'          // mantém para o estado sem conquista

    );

    cardEl.classList.add(

        classeNivel(nivel)

    );

if (badgeEl)
    badgeEl.textContent = badgeNivel(nivel);

if (descEl)
    descEl.textContent = texto || '—';

}



// ============================================================================
// RESET DAS CONQUISTAS
// ============================================================================

function limparConquistas() {

    [

        {

            card:'cq-top-ranking',

            badge:'cq-top-ranking-nivel',

            descricao:'cq-top-ranking-desc'

        },

        {

            card:'cq-cravadas',

            badge:'cq-cravadas-nivel',

            descricao:'cq-cravadas-desc'

        },

        {

            card:'cq-pensamento-unico',

            badge:'cq-pensamento-unico-nivel',

            descricao:'cq-pensamento-unico-desc'

        },

        {

            card:'cq-foguete',

            badge:'cq-foguete-nivel',

            descricao:'cq-foguete-desc'

        },

        {

            card:'cq-trofeu',

            badge:'cq-trofeu-nivel',

            descricao:'cq-trofeu-desc'

        }

    ].forEach(item =>

        atualizarCardConquista({

            ...item,

            nivel: null,

            texto: '—'

        })

    );

}



// ============================================================================
// COMPONENTE DE RESUMO
// ============================================================================

function atualizarResumo(dados) {

    preencherCampos({

        'resumo-nome':'Participante',

        'resumo-pos':'Pos_Real_Atual',

        'resumo-total':'Ptos_Atual',

        'resumo-exatos':'PlEXato_Atual',

        'resumo-jogos':'Jogos_Pontuados',

        'resumo-var':'ganhoR3R2'

    },

    dados);

}



// ============================================================================
// RESUMO DA FASE DE GRUPOS
// ============================================================================

/*
function atualizarResumoGrupos(dados) {

    preencherCampos({

        'fg-resultados-corretos':'ResultCorretos',

        'fg-ranking-moral':'Pos_Moral_Atual',

        'fg-melhor-class':'Melhor_Real',

        'fg-data-melhor':'Quando_Melhor_Real',

        'fg-jogo-melhor':'AposJogo'

    },

    dados);

}
*/

function atualizarResumoGrupos(dados) {

    preencherCampos({

        'fg-resultados-corretos':'ResultCorretos',

        'fg-ranking-moral':'Pos_Moral_Atual',

        'fg-melhor-class':'Melhor_Real'

    }, dados);

    setText(
        'fg-data-melhor',
        formatarDataHora(dados?.Quando_Melhor_Real)
    );

    renderJogoMelhorClassificacao(dados);

}



function atualizarResumoCompleto(nome){

    renderResumo(nome);

    renderResumoFaseGrupos(nome);

    renderConquistas(nome);

    renderPizzaResumo(nome);

}

function renderJogoMelhorClassificacao(dados){

    if(
        !dados?.Melhor_TimeA ||
        !dados?.Melhor_TimeB
    ){

        setHTML(
            'fg-jogo-melhor',
            '—'
        );

        return;

    }

    setHTML(

        'fg-jogo-melhor',

        `
        <div class="jogo-mini-card">

            <div class="time-mini">

                <img
                    class="bandeira-mini"
                    src="${getBandeira(dados.Melhor_TimeA)}"
                    alt="${dados.Melhor_TimeA}">

                <div class="trigrama-mini">
                    ${dados.Melhor_TimeA}
                </div>

            </div>

            <div class="placar-mini">

                ${dados.Melhor_GolsA}
                <span>x</span>
                ${dados.Melhor_GolsB}

            </div>

            <div class="time-mini">

                <img
                    class="bandeira-mini"
                    src="${getBandeira(dados.Melhor_TimeB)}"
                    alt="${dados.Melhor_TimeB}">

                <div class="trigrama-mini">
                    ${dados.Melhor_TimeB}
                </div>

            </div>

        </div>
        `

    );

}

// ============================================================================
// PERFIL PALPITES
// perfil-render-base.js
// Bloco 2 - Resumo do Participante
// ============================================================================


// ============================================================================
// RENDERIZA O RESUMO SUPERIOR
// ============================================================================

function renderResumo(participante) {

    const resumo = getResumo(participante);

    atualizarResumo({

        Participante: participante,

        Pos_Real_Atual:
            resumo?.Pos_Real_Atual ?? '—',

        Ptos_Atual:
            resumo?.Ptos_Atual ?? calculado.pontos,

        PlEXato_Atual:
            resumo?.PlEXato_Atual ?? calculado.exatos,

        Jogos_Pontuados:
            resumo?.Jogos_Pontuados ?? calculado.jogosPontuados,

        ganhoR3R2:
            resumo?.ganhoR3R2 ?? '—'

    });

    show(App.ui.resumo.card);

}



// ============================================================================
// RENDERIZA O RESUMO DA FASE DE GRUPOS
// ============================================================================

function renderResumoFaseGrupos(participante) {

    const resumo = getResumo(participante);

    if (!resumo) {

        atualizarResumoGrupos({

            ResultCorretos: '—',

            Pos_Moral_Atual: '—',

            Melhor_Real: '—',

            Quando_Melhor_Real: '—',

            AposJogo: '—'

        });

        show(App.ui.secoes.grupos);

        return;

    }

    atualizarResumoGrupos(resumo);

    show(App.ui.secoes.grupos);

}



// ============================================================================
// LIMPA O RESUMO SUPERIOR
// ============================================================================

function limparResumo() {

    atualizarResumo({

        Participante: '',

        Pos_Real_Atual: '',

        Ptos_Atual: '',

        PlEXato_Atual: '',

        Jogos_Pontuados: '',

        ganhoR3R2: ''

    });

}



// ============================================================================
// LIMPA O RESUMO DA FASE DE GRUPOS
// ============================================================================

function limparResumoGrupos() {

    atualizarResumoGrupos({

        ResultCorretos: '',

        Pos_Moral_Atual: '',

        Melhor_Real: '',

        Quando_Melhor_Real: '',

        AposJogo: ''

    });

}



// ============================================================================
// RESETA A ÁREA DO PARTICIPANTE
// ============================================================================

function limparPerfil() {

    limparResumo();

    limparResumoGrupos();

    limparConquistas();

    hide(App.ui.resumo.card);

    hide(App.ui.secoes.grupos);

    hide(App.ui.secoes.conquistas);

}


function formatarDataHora(valor) {

    if (!valor || valor === '—')
        return '—';

    const data = new Date(valor);

    if (isNaN(data))
        return valor;

    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0');
    const yyyy = data.getFullYear();

    const hh = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');

    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

// ============================================================================
// PERFIL PALPITES
// perfil-render-base.js
// Bloco 3 - Conquistas
// ============================================================================


// ============================================================================
// PONTUAÇÃO DAS CONQUISTAS
// ============================================================================

const PONTOS_CONQUISTAS = Object.freeze({

    Ouro: 10,

    Prata: 5,

    Bronze: 2

});

// ============================================================================
// CONFIGURAÇÃO DAS CONQUISTAS
// ============================================================================

const MAPA_CONQUISTAS = Object.freeze([

    {

        card: 'cq-top-ranking',

        badge: 'cq-top-ranking-nivel',

        descricao: 'cq-top-ranking-desc',

        nivel: 'cqTopRanking',

        texto: 'obsTopRanking'

    },

    {

        card: 'cq-cravadas',

        badge: 'cq-cravadas-nivel',

        descricao: 'cq-cravadas-desc',

        nivel: 'cqCravadas',

        texto: 'nCravadas'

    },

    {

        card: 'cq-pensamento-unico',

        badge: 'cq-pensamento-unico-nivel',

        descricao: 'cq-pensamento-unico-desc',

        nivel: 'cqPensamentoUnico',

        texto: 'obsPensamentoUnico'

    },

    {

        card: 'cq-foguete',

        badge: 'cq-foguete-nivel',

        descricao: 'cq-foguete-desc',

        nivel: 'cqFoguete',

        texto: 'obsFoguete'

    },

    {

        card: 'cq-trofeu',

        badge: 'cq-trofeu-nivel',

        descricao: 'cq-trofeu-desc',

        nivel: 'cqTrofeu',

        texto: 'obsTrofeu'

    }

]);

// ============================================================================
// CALCULA A PONTUAÇÃO TOTAL DAS CONQUISTAS
// ============================================================================

function calcularPontosConquistas(row) {

    if (!row)
        return 0;

    const medalhas = [

        row.cqTopRanking,

        row.cqCravadas,

        row.cqPensamentoUnico,

        row.cqFoguete,

        row.cqTrofeu

    ];

    return medalhas.reduce((total, medalha) =>

        total +

        (PONTOS_CONQUISTAS[medalha] || 0),

        0

    );

}



// ============================================================================
// RENDERIZA UMA CONQUISTA
// ============================================================================

function renderConquista(config, row) {

    atualizarCardConquista({

        card: config.card,

        badge: config.badge,

        descricao: config.descricao,

        nivel: row?.[config.nivel],

        texto: row?.[config.texto]

    });

}



// ============================================================================
// RENDERIZA TODAS AS CONQUISTAS
// ============================================================================

function renderConquistas(participante) {

    const row = getConquistas(participante);

    if (!row) {

        limparConquistas();

        setText(

            'conq-pontos-total',

            '—'

        );

        show(

            App.ui.secoes.conquistas

        );

        return;

    }

    MAPA_CONQUISTAS.forEach(cfg =>

        renderConquista(

            cfg,

            row

        )

    );

    setText(

        'conq-pontos-total',

        row.cqPontos ??

        calcularPontosConquistas(row)

    );

    show(

        App.ui.secoes.conquistas

    );


}

// ============================================================================
// PERFIL PALPITES
// perfil-render-base.js
// Bloco 4 - Orquestração da Renderização
// ============================================================================


// ============================================================================
// EXISTE PARTICIPANTE SELECIONADO?
// ============================================================================

function possuiParticipanteSelecionado() {

    return Boolean(App.participante);

}



// ============================================================================
// RETORNA O PARTICIPANTE ATUAL
// ============================================================================

function participanteAtual() {

    return App.participante;

}



// ============================================================================
// DEFINE O PARTICIPANTE ATUAL
// ============================================================================

function selecionarParticipante(nome) {

    App.participante = nome;

}



// ============================================================================
// RENDERIZA TODO O PERFIL
// ============================================================================

function renderPerfil(nome) {

    if (!nome) {

        limparPerfil();

        return;

    }

    renderCabecalhoPerfil(nome);

    selecionarParticipante(nome);

    atualizarResumoCompleto(nome);

 //   renderEliminatorias(nome);

//    renderGeral(nome);

}



// ============================================================================
// RECARREGA O PERFIL
// ============================================================================

function atualizarPerfil() {

    if (!possuiParticipanteSelecionado())
        return;

    renderPerfil(

        participanteAtual()

    );

}

function renderCabecalhoPerfil(nome){

    const row = getResumo(nome);

    console.log("Renderizando cabeçalho:", nome);

    if(!row)
        return;

    App.ui.perfil.nome.textContent =
        row.Participante;

    App.ui.perfil.pontos.textContent =
        (row.Ptos_Atual);

    App.ui.perfil.posicao.textContent =
        (row.Pos_Real_Atual)+'°';

    showBlock(App.ui.perfil.card);

}


// ============================================================================
// EXPORTA PARA OS DEMAIS RENDERIZADORES
// ============================================================================

// Object.freeze(renderPerfil);
