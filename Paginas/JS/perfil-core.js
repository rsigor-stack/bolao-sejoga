// ============================================================================
// PERFIL PALPITES - CORE
// Bloco 1 - Configuração, Estado e Constantes
// ============================================================================

'use strict';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const CONFIG = Object.freeze({

    URLS: {

        PALPITES:
            'https://script.google.com/macros/s/AKfycbw3S0FDdjMZbP0mnyQ4iMDHufuN6QTBtNXcWWpOmCkfqnPHQWiUv15Z0uxagpseoibe/exec?aba=Palpites',

        ELIMINATORIAS:
            'https://script.google.com/macros/s/AKfycbzqa0SYv8nPTePgIz33hKwpqFMluqwaRyoKdsfHPPQYipEKdll692Z5fu-7-IiGPXnI/exec?aba=Palpites_Elim',

        ONE_PAGE:
            'https://script.google.com/macros/s/AKfycbzqa0SYv8nPTePgIz33hKwpqFMluqwaRyoKdsfHPPQYipEKdll692Z5fu-7-IiGPXnI/exec?aba=OnePage',

        HISTORICO:
            'https://script.google.com/macros/s/AKfycbzqa0SYv8nPTePgIz33hKwpqFMluqwaRyoKdsfHPPQYipEKdll692Z5fu-7-IiGPXnI/exec?aba=Historico',

        CONQUISTAS:
            'https://script.google.com/macros/s/AKfycbzqa0SYv8nPTePgIz33hKwpqFMluqwaRyoKdsfHPPQYipEKdll692Z5fu-7-IiGPXnI/exec?aba=Conquistas'

    },

    URL_IMAGENS:
        'https://sejoganacopa.vercel.app/imagens/',

    DEBUG: false

});


// ============================================================================
// ESTADO DA APLICAÇÃO
// ============================================================================

const App = {

    participante: null,

    participantes: [],

    jogos: [],

    dados: {

        onePage: [],

        historico: [],

        conquistas: [],

        eliminatorias: []

    },

    ui: {}

};


// ============================================================================
// PONTUAÇÃO DAS ELIMINATÓRIAS
// ============================================================================

const PONTOS_ELIM = Object.freeze({

    Segundas: 3,

    Oitavas: 5,

    Quartas: 10,

    Semis: 15,

    Final: 20,

    Campeao: 30,

    Artilheiro: 30

});



// ============================================================================
// PERFIL PALPITES - CORE
// Bloco 2 - Helpers, Utilitários e Acesso aos Dados
// ============================================================================


// ============================================================================
// DEBUG
// ============================================================================

function debug(...args) {

    if (CONFIG.DEBUG) {
        console.log(...args);
    }

}


// ============================================================================
// HELPERS DO DOM
// ============================================================================

function $(id) {
    return document.getElementById(id);
}

function setText(id, valor) {

    const el = $(id);

    if (!el) return;

    el.textContent =
        valor !== undefined &&
        valor !== null &&
        valor !== ''
            ? valor
            : '—';
}

function getElement(target) {

    if (!target)
        return null;

    if (typeof target === 'string')
        return document.getElementById(target);

    return target;

}

function showBlock(target){

    const el=getElement(target);

    if(el)

        el.style.display="block";

}


function showFlex(target){

    const el=getElement(target);

    if(el)

        el.style.display="flex";

}

function show(target) {

    const el = getElement(target);

    if (el)
        el.style.display = '';

}

function hide(target) {

    const el = getElement(target);

    if (el)
        el.style.display = 'none';

}

function toggle(target, mostrar){

    mostrar ? show(target) : hide(target);

}

// ============================================================================
// NORMALIZAÇÃO
// ============================================================================

function normalizarNome(nome) {

    return String(nome || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

}

function mesmoParticipante(a, b) {

    return normalizarNome(a) === normalizarNome(b);

}


// ============================================================================
// BUSCA DE REGISTROS
// ============================================================================

function encontrarParticipante(lista, nome) {

    return lista.find(item =>
        mesmoParticipante(
            item.Participante || item.nome,
            nome
        )
    ) || null;

}

function getResumo(nome) {

    return encontrarParticipante(
        App.dados.onePage,
        nome
    );

}

function getConquistas(nome) {

    return encontrarParticipante(
        App.dados.conquistas,
        nome
    );

}

function getHistorico(nome) {

    return encontrarParticipante(
        App.dados.historico,
        nome
    );

}


// ============================================================================
// OBTÉM PALPITE DE UM PARTICIPANTE EM UM JOGO
// ============================================================================

function getPalpite(jogo, participante) {

    if (!jogo || !jogo.palpites)
        return null;

    return jogo.palpites.find(p =>
        mesmoParticipante(
            p.nome,
            participante
        )
    ) || null;

}


// ============================================================================
// FORMATADORES
// ============================================================================

function numero(valor, padrao = '—') {

    if (
        valor === undefined ||
        valor === null ||
        valor === ''
    ) {
        return padrao;
    }

    return Number(valor);

}

function texto(valor, padrao = '—') {

    return (
        valor !== undefined &&
        valor !== null &&
        valor !== ''
    )
        ? String(valor)
        : padrao;

}

function inteiro(valor) {

    const n = parseInt(valor, 10);

    return Number.isNaN(n)
        ? 0
        : n;

}


// ============================================================================
// RESUMO DO PARTICIPANTE
// ============================================================================

function calcularResumoParticipante(participante) {

    let pontos = 0;

    let exatos = 0;

    let jogosPontuados = 0;

    App.jogos.forEach(jogo => {

        const p = getPalpite(
            jogo,
            participante
        );

        if (!p)
            return;

        if (
            p.pontos !== null &&
            p.pontos !== ''
        ) {

            pontos += Number(p.pontos);

            if (Number(p.pontos) > 0)
                jogosPontuados++;

        }

        const temResultado =
            jogo.gols1Real !== null &&
            jogo.gols2Real !== null;

        const temPalpite =
            p.gols1 !== null &&
            p.gols2 !== null;

        if (
            temResultado &&
            temPalpite &&
            String(p.gols1) === String(jogo.gols1Real) &&
            String(p.gols2) === String(jogo.gols2Real)
        ) {
            exatos++;
        }

    });

    return {

        participante,

        pontos,

        exatos,

        jogosPontuados

    };

}


// ============================================================================
// RENDERIZAÇÃO SEGURA
// ============================================================================

function preencherCampos(campos, dados) {

    Object.entries(campos).forEach(([id, chave]) => {

        setText(
            id,
            dados?.[chave]
        );

    });

}

// ============================================================================
// PERFIL PALPITES - CORE
// Bloco 3 - Parser e Utilidades de Negócio
// ============================================================================


// ============================================================================
// CLASSE CSS DA PONTUAÇÃO
// ============================================================================

function ptsClasse(pontos) {

    if (
        pontos === null ||
        pontos === undefined ||
        pontos === ''
    ) {
        return 'pts-vazio';
    }

    const valor = Number(pontos);

    if (valor === 0) return 'pts-0';

    if (valor <= 3) return 'pts-low';

    if (valor <= 6) return 'pts-mid';

    return 'pts-high';

}


// ============================================================================
// MONTA A CÉLULA DE EXIBIÇÃO DO PAÍS
// ============================================================================

function timeCelula(pais) {

    if (!pais)
        return '';

    const codigo =
        BANDEIRAS[pais];

    const trigrama =
        TRIGRAMAS[pais] ??
        pais.substring(0,3).toUpperCase();

    const imagem = codigo

        ? `
            <img
                src="https://flagcdn.com/w40/${codigo}.png"
                style="${FLAG_STYLE_SM}"
                alt="${pais}">
          `

        : `
            <span
                style="
                    display:block;
                    height:24px;
                ">
            </span>
          `;

    return `

        <div class="jogo-time-cell">

            ${imagem}

            <span class="jogo-tri">

                ${trigrama}

            </span>

        </div>

    `;

}


// ============================================================================
// CONVERSÃO DE VALORES
// ============================================================================

function valorPlanilha(valor) {

    if (
        valor === '' ||
        valor === '-' ||
        valor === undefined ||
        valor === null
    ) {
        return null;
    }

    return valor;

}


// ============================================================================
// DETECTA PARTICIPANTES
// ============================================================================

function obterParticipantes(linha) {

    return Object.keys(linha)

        .filter(chave =>
            chave.endsWith('_pal1')
        )

        .map(chave => ({

            nome:
                chave.replace('_pal1','')

        }));

}


// ============================================================================
// CONVERTE UMA LINHA DA PLANILHA EM UM JOGO
// ============================================================================

function criarJogo(linha, participantes) {

    const time1 =
        String(linha.Time1 || '').trim();

    const time2 =
        String(linha.Time2 || '').trim();

    if (!time1 && !time2)
        return null;

    return {

        data:
            String(linha.Data || '').trim(),

        horario:
            String(linha.Hora || '').trim(),

        time1,

        time2,

        gols1Real:
            valorPlanilha(linha.Real1),

        gols2Real:
            valorPlanilha(linha.Real2),

        palpites:

            participantes.map(p => ({

                nome:

                    p.nome,

                gols1:

                    valorPlanilha(
                        linha[
                            `${p.nome}_pal1`
                        ]
                    ),

                gols2:

                    valorPlanilha(
                        linha[
                            `${p.nome}_pal2`
                        ]
                    ),

                pontos:

                    valorPlanilha(
                        linha[
                            `${p.nome}_pts`
                        ]
                    )

            }))

    };

}


// ============================================================================
// PARSER PRINCIPAL
// ============================================================================

function parsearDados(linhas) {

    if (
        !Array.isArray(linhas) ||
        !linhas.length
    ) {

        App.participantes = [];

        App.jogos = [];

        return {

            participantes: [],

            jogos: []

        };

    }

    const participantes =
        obterParticipantes(
            linhas[0]
        );

    if (!participantes.length) {

        App.participantes = [];

        App.jogos = [];

        return {

            participantes: [],

            jogos: []

        };

    }

    const jogos = linhas

        .map(linha =>
            criarJogo(
                linha,
                participantes
            )
        )

        .filter(Boolean);

    App.participantes =
        participantes;

    App.jogos =
        jogos;

    return {

        participantes,

        jogos

    };

}


// ============================================================================
// CARREGA JSON REMOTO
// ============================================================================

async function carregarJSON(url) {

    const resposta =
        await fetch(url);

    if (!resposta.ok) {

        throw new Error(

            `Erro HTTP ${resposta.status}`

        );

    }

    const json =
        await resposta.json();

    return json.data || json || [];

}


// ============================================================================
// CARREGA TODOS OS DADOS
// ============================================================================

async function carregarDados() {

    const [

        palpites,

        eliminatorias,

        onePage,

        historico,

        conquistas

    ] = await Promise.all([

        carregarJSON(
            CONFIG.URLS.PALPITES
        ),

        carregarJSON(
            CONFIG.URLS.ELIMINATORIAS
        ),

        carregarJSON(
            CONFIG.URLS.ONE_PAGE
        ),

        carregarJSON(
            CONFIG.URLS.HISTORICO
        ),

        carregarJSON(
            CONFIG.URLS.CONQUISTAS
        )

    ]);

    App.dados.eliminatorias =
        eliminatorias;

    App.dados.onePage =
        onePage;

    App.dados.historico =
        historico;

    App.dados.conquistas =
        conquistas;

    return parsearDados(
        palpites
    );

}
