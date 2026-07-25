// ============================================================================
// PERFIL PALPITES
// perfil-init.js
// Bloco 1 - Cache do DOM e carregamento dos dados
// ============================================================================

'use strict';

// ============================================================================
// CACHE DO DOM
// ============================================================================

function cacheDOM() {

    App.ui = {

        loading: $('loading-state'),

        conteudo: $('conteudo'),

	perfil:{

	    card:$("perfil-header"),

	    nome:$("perfil-header-nome"),

	    posicao:$("perfil-header-posicao"),

	    pontos:$("perfil-header-pontos")

	},

        resumo: {

            card: $('resumo-participante'),

            nome: $('resumo-nome'),

            posicao: $('resumo-pos'),

            pontos: $('resumo-total'),

            exatos: $('resumo-exatos'),

            jogos: $('resumo-jogos'),

            variacao: $('resumo-var')

        },

        busca: {

            input: $('busca-input'),

            clear: $('busca-clear'),

            lista: $('lista-participantes'),

            scroll: $('lista-scroll'),

            chip: $('selecionado-chip'),

            chipNome: $('chip-nome'),

            chipTrocar: $('chip-trocar')

        },

        abas: {

            grupos: $('tab-jogos'),

            eliminatorias: $('tab-elim'),

            geral: $('tab-geral')

        },

       secoes: {
       
           grupos: $('fg-resumo-section'),
       
           conquistas: $('conq-section'),
       
           eliminatorias: $('eliminatorias-card'),
       
           geral: $('geral-card'),
       
           pizzaGrupos: $('pizza-grupos-section'),
       
           pizzaRodadas: $('pizza-section')
       
       }

    };

}



// ============================================================================
// CARREGA UM JSON REMOTO
// ============================================================================

async function carregarJSON(url) {

    const resposta = await fetch(url);

    if (!resposta.ok) {

        throw new Error(

            `Erro HTTP ${resposta.status}`

        );

    }

    const json = await resposta.json();

    return json.data || json || [];

}



// ============================================================================
// CARREGA TODOS OS DADOS DA APLICAÇÃO
// ============================================================================

async function carregarDados() {

    const [

        palpites,

        eliminatorias,

        onePage,

        historico,

        conquistas

    ] = await Promise.all([

        carregarJSON(CONFIG.URLS.PALPITES),

        carregarJSON(CONFIG.URLS.ELIMINATORIAS),

        carregarJSON(CONFIG.URLS.ONE_PAGE),

        carregarJSON(CONFIG.URLS.HISTORICO),

        carregarJSON(CONFIG.URLS.CONQUISTAS)

    ]);


    App.dados.eliminatorias = eliminatorias;

    App.dados.onePage = onePage;

    App.dados.historico = historico;

    App.dados.conquistas = conquistas;


    return parsearDados(palpites);

}



// ============================================================================
// MOSTRA / ESCONDE A TELA DE CARREGAMENTO
// ============================================================================

function mostrarLoading() {

    show('loading-state');

    hide('conteudo');

}


function esconderLoading() {

    hide('loading-state');

    show('conteudo');

}



// ============================================================================
// EXIBE MENSAGEM DE ERRO
// ============================================================================

function mostrarErro(mensagem) {

    if (!App.ui.loading)
        return;

    App.ui.loading.innerHTML = `

        <div class="error-state">

            ❌ Erro ao carregar dados.

            <br><br>

            <small>${mensagem}</small>

        </div>

    `;

}

// ============================================================================
// PERFIL PALPITES
// perfil-init.js
// Bloco 2 - Interface, Seletor e Abas
// ============================================================================


// ============================================================================
// EXIBE SOMENTE AS SEÇÕES INFORMADAS
// ============================================================================

function mostrarSecoes(...secoes) {

    const todas = [
    
        App.ui.secoes.grupos,
    
        App.ui.secoes.conquistas,
    
        App.ui.secoes.eliminatorias,
    
        App.ui.secoes.geral,
    
        App.ui.secoes.pizzaGrupos,
    
        App.ui.secoes.pizzaRodadas
    
    ];

    todas.forEach(hide);

    secoes.forEach(show);

}


// ============================================================================
// ALTERA A ABA ATIVA
// ============================================================================

function ativarAba(aba) {

    Object.values(App.ui.abas)
        .forEach(btn => btn.classList.remove('active'));

    App.ui.abas[aba]
        ?.classList.add('active');

}


// ============================================================================
// SELETOR DE PARTICIPANTES
// ============================================================================

function renderSeletor() {

    const {

        input,

        clear,

        lista,

        scroll,

        chip,

        chipNome,

        chipTrocar

    } = App.ui.busca;

    // Reconstrói os itens da lista a cada chamada (igual ao Palpites_OK)
    function atualizarLista(filtro = '') {

        const termo = normalizarNome(filtro);

        const itens = App.participantes.filter(p =>

            !termo || normalizarNome(p.nome).includes(termo)

        );

        if (!itens.length) {

            scroll.innerHTML =
                '<div class="lista-vazia">Nenhum participante encontrado</div>';

            return;

        }

        scroll.innerHTML = itens.map((p) => {

            const pos = App.participantes.indexOf(p) + 1;

            return `
                <div class="lista-item" data-nome="${p.nome}" tabindex="0">
                    <span class="pos-badge">${pos}</span>
                    <span class="item-nome">${p.nome}</span>
                    <span class="item-seta">›</span>
                </div>`;

        }).join('');

        scroll.querySelectorAll('.lista-item').forEach(item => {

            item.addEventListener('click', () => selecionar(item.dataset.nome));

            item.addEventListener('keydown', e => {

                if (e.key === 'Enter') selecionar(item.dataset.nome);

            });

        });

    }

    function selecionar(nome) {

        App.participante = nome;

        chipNome.textContent = nome;

        chip.classList.add('visivel');

        lista.classList.remove('visivel');

        input.value = '';

        clear.classList.remove('visivel');

        input.blur();

        renderPerfil(nome);

    }

    // Abre a lista ao focar no campo
    input.addEventListener('focus', () => {

        atualizarLista(input.value);

        lista.classList.add('visivel');

    });

    // Filtra conforme digita
    input.addEventListener('input', () => {

        clear.classList.toggle('visivel', input.value.length > 0);

        atualizarLista(input.value);

        lista.classList.add('visivel');

    });

    // Botão ✕ limpa o campo
    clear.addEventListener('click', () => {

        input.value = '';

        clear.classList.remove('visivel');

        atualizarLista('');

        input.focus();

    });

    // Chip "trocar participante"
    chipTrocar.addEventListener('click', () => {

        chip.classList.remove('visivel');

        input.value = '';

        clear.classList.remove('visivel');

        atualizarLista('');

        lista.classList.add('visivel');

        input.focus();

    });

    // Fecha a lista ao clicar fora
    document.addEventListener('click', e => {

        if (

            !e.target.closest('.busca-wrap') &&

            !e.target.closest('.lista-participantes')

        ) {

            lista.classList.remove('visivel');

        }

    });

    // Navegação por teclado ↑ ↓ Esc
    input.addEventListener('keydown', e => {

        const itens = scroll.querySelectorAll('.lista-item');

        const ativo = scroll.querySelector('.lista-item:focus');

        if (e.key === 'ArrowDown') {

            e.preventDefault();

            (ativo ? ativo.nextElementSibling : itens[0])?.focus();

        } else if (e.key === 'ArrowUp') {

            e.preventDefault();

            (ativo ? ativo.previousElementSibling : itens[itens.length - 1])?.focus();

        } else if (e.key === 'Escape') {

            lista.classList.remove('visivel');

            input.blur();

        }

    });

    atualizarLista();

}



// ============================================================================
// CONFIGURAÇÃO DAS ABAS
// ============================================================================

function configurarAbas() {

    App.ui.abas.grupos.onclick = () => {

        ativarAba('grupos');

        mostrarSecoes(

            App.ui.secoes.grupos

//            App.ui.secoes.conquistas,

//            App.ui.secoes.pizzaGrupos,

//            App.ui.secoes.pizzaRodadas

        );



        if(App.participante){

            renderResumoFaseGrupos(

                App.participante

            );



            renderConquistas(

                App.participante

            );

        }

    };



    App.ui.abas.eliminatorias.onclick = () => {

        ativarAba('eliminatorias');

        mostrarSecoes(

            App.ui.secoes.eliminatorias

        );



        if(App.participante)

            renderEliminatorias(

                App.participante

            );

    };



    App.ui.abas.geral.onclick = () => {

        ativarAba('geral');

        mostrarSecoes(

            App.ui.secoes.geral

        );



        if(App.participante)

            renderGeral(

                App.participante

            );

    };

}

// ============================================================================
// PERFIL PALPITES
// perfil-init.js
// Bloco 3 - Inicialização da aplicação
// ============================================================================


// ============================================================================
// PRÉ-SELEÇÃO VIA PARÂMETRO DA URL
// Exemplo:
// perfil.html?participante=Igor%20R%20Souza
// ============================================================================

function selecionarParticipanteURL() {

    const params = new URLSearchParams(window.location.search);

    const nome = params.get('participante');

    if (!nome)
        return;

    const participante = App.participantes.find(p =>
        mesmoParticipante(p.nome, nome)
    );

    if (!participante)
        return;

    App.ui.busca.chipNome.textContent = participante.nome;

    show(App.ui.busca.chip);

    renderPerfil(participante.nome);

}



// ============================================================================
// CONFIGURA COMPONENTES DA INTERFACE
// ============================================================================

function configurarInterface() {

    cacheDOM();

    renderSeletor();

    configurarAbas();

}



// ============================================================================
// INICIALIZA A APLICAÇÃO
// ============================================================================

async function init() {

    try {

        mostrarLoading();

        await carregarDados();

        configurarInterface();

        esconderLoading();

        selecionarParticipanteURL();

    }

    catch (erro) {

        console.error(erro);

        mostrarErro(

            erro.message ||

            'Erro desconhecido.'

        );

    }

}



// ============================================================================
// STARTUP
// ============================================================================

document.addEventListener(

    'DOMContentLoaded',

    init

);
