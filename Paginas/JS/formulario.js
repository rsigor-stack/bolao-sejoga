// ============================================================================
// PALPITE ELIMINATÓRIAS — BOLÃO LIBERTADORES 2026
// Conversão da versão React/JSX para JavaScript puro
// ============================================================================


// ============================================================================
// DADOS DOS CONFRONTOS
// ============================================================================

// Mandante do jogo de ida conforme a planilha oficial do bolão.
// Na volta, os mandos são automaticamente invertidos.

const OITAVAS = [

    {
        id: "j1",
        casa: "Estudiantes",
        fora: "Universidad Católica"
    },

    {
        id: "j2",
        casa: "Rosario Central",
        fora: "Corinthians"
    },

    {
        id: "j3",
        casa: "Cruzeiro",
        fora: "Flamengo"
    },

    {
        id: "j4",
        casa: "Tolima",
        fora: "Independiente del Valle"
    },

    {
        id: "j5",
        casa: "Mirassol",
        fora: "LDU"
    },

    {
        id: "j6",
        casa: "Palmeiras",
        fora: "Cerro Porteño"
    },

    {
        id: "j7",
        casa: "Platense",
        fora: "Coquimbo Unido"
    },

    {
        id: "j8",
        casa: "Fluminense",
        fora: "Independiente Rivadavia"
    }

];


// ============================================================================
// QUARTAS DE FINAL
// ============================================================================

const QUARTAS = [

    {
        id: "q1",
        opcaoA: "Vencedor J1 (Fla/Cru)",
        opcaoB: "Vencedor J2 (Pal/Cerro)"
    },

    {
        id: "q2",
        opcaoA: "Vencedor J3 (Cor/Rosario)",
        opcaoB: "Vencedor J4 (Flu/Rivadavia)"
    },

    {
        id: "q3",
        opcaoA: "Vencedor J5 (Mirassol/LDU)",
        opcaoB: "Vencedor J6 (Estudiantes/U.Católica)"
    },

    {
        id: "q4",
        opcaoA: "Vencedor J7 (IDV/Platense)",
        opcaoB: "Vencedor J8 (Coquimbo/Tolima)"
    }

];


// ============================================================================
// ESTADO DA APLICAÇÃO
// ============================================================================

const state = {

    scores: {},

    quartas: {},

    semis: {},

    final: "",

    etapa: 1,

    erro: "",

    enviado: false,

    payloadDebug: null

};


// ============================================================================
// INICIALIZAÇÃO DOS PLACARES
// ============================================================================

function criarScoresIniciais() {

    const scores = {};

    OITAVAS.forEach(jogo => {

        scores[jogo.id] = {

            idaCasa: "",

            idaFora: "",

            voltaCasa: "",

            voltaFora: "",

            penaltis: ""

        };

    });

    return scores;

}


state.scores = criarScoresIniciais();


// ============================================================================
// UTILITÁRIOS
// ============================================================================

function get(id) {

    return document.getElementById(id);

}


function escapeHTML(valor) {

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================================
// ESCUDO DO TIME (usa o módulo compartilhado Bolao.clubs, se disponível)
// ============================================================================

function escudoTimeHTML(nomeTime) {

    if (!window.Bolao || !Bolao.clubs) return "";

    const url = Bolao.clubs.methods.getEscudo(nomeTime);

    if (!url) return "";

    return `<img src="${url}" alt="" class="escudo-time">`;

}


// ============================================================================
// PONTUAÇÃO DE MINI-LIGA
// ============================================================================

// 3 pontos para vitória
// 1 ponto para empate
// 0 pontos para derrota

function winPts(a, b) {

    if (a > b) return 3;

    if (a === b) return 1;

    return 0;

}


// ============================================================================
// CÁLCULO DO CLASSIFICADO
// ============================================================================

function calcularClassificado(jogo, scores) {

    const {

        idaCasa,

        idaFora,

        voltaCasa,

        voltaFora,

        penaltis

    } = scores;


    // Enquanto algum placar estiver vazio,
    // ainda não há classificado.

    if (

        idaCasa === "" ||

        idaFora === "" ||

        voltaCasa === "" ||

        voltaFora === ""

    ) {

        return null;

    }


    const ic = Number(idaCasa);

    const iff = Number(idaFora);

    const vc = Number(voltaCasa);

    const vf = Number(voltaFora);


    // Ida:
    //
    // jogo.casa manda em casa
    // jogo.fora joga fora
    //
    // Volta:
    //
    // jogo.fora manda em casa
    // jogo.casa joga fora

    const ptsCasa =

        winPts(ic, iff) +

        winPts(vf, vc);


    const ptsFora =

        winPts(iff, ic) +

        winPts(vc, vf);


    const saldoCasa =

        (ic - iff) +

        (vf - vc);


    const saldoFora = -saldoCasa;


    if (ptsCasa > ptsFora) {

        return jogo.casa;

    }


    if (ptsFora > ptsCasa) {

        return jogo.fora;

    }


    if (saldoCasa > saldoFora) {

        return jogo.casa;

    }


    if (saldoFora > saldoCasa) {

        return jogo.fora;

    }


    // Empate em pontos e saldo:
    // depende dos pênaltis.

    return penaltis || "EMPATE";

}


// ============================================================================
// CLASSIFICADOS ATUAIS
// ============================================================================

function obterClassificados() {

    const classificados = {};

    OITAVAS.forEach(jogo => {

        classificados[jogo.id] =

            calcularClassificado(

                jogo,

                state.scores[jogo.id]

            );

    });

    return classificados;

}


// ============================================================================
// VALIDADORES DAS OITAVAS
// ============================================================================

function oitavasCompletas() {

    return OITAVAS.every(jogo => {

        const s = state.scores[jogo.id];


        return (

            s.idaCasa !== "" &&

            s.idaFora !== "" &&

            s.voltaCasa !== "" &&

            s.voltaFora !== ""

        );

    });

}


function haEmpatesPendentes() {

    const classificados = obterClassificados();


    return OITAVAS.some(jogo =>

        classificados[jogo.id] === "EMPATE"

    );

}


// ============================================================================
// NOMES DOS VENCEDORES
// ============================================================================

function nomeVencedor(jogoId, fallback) {

    const classificados = obterClassificados();

    const classificado = classificados[jogoId];


    if (

        classificado &&

        classificado !== "EMPATE"

    ) {

        return classificado;

    }


    return fallback;

}


// ============================================================================
// QUARTAS COM NOMES ATUALIZADOS
// ============================================================================

function obterQuartasComNomes() {

    return QUARTAS.map((q, i) => {

        const jogoA = OITAVAS[i * 2];

        const jogoB = OITAVAS[i * 2 + 1];


        return {

            ...q,

            opcaoA: nomeVencedor(

                jogoA.id,

                q.opcaoA

            ),

            opcaoB: nomeVencedor(

                jogoB.id,

                q.opcaoB

            )

        };

    });

}


// ============================================================================
// SEMIFINAIS COM NOMES ATUALIZADOS
// ============================================================================

function obterSemisComNomes() {

    const quartasComNomes = obterQuartasComNomes();


    const pares = [

        [0, 1],

        [2, 3]

    ];


    return pares.map(([ia, ib], i) => {

        const qA = quartasComNomes[ia];

        const qB = quartasComNomes[ib];


        return {

            id: `s${i + 1}`,

            opcaoA:

                state.quartas[qA.id] ||

                `Vencedor ${qA.opcaoA} x ${qA.opcaoB}`,

            opcaoB:

                state.quartas[qB.id] ||

                `Vencedor ${qB.opcaoA} x ${qB.opcaoB}`,

            pronto:

                Boolean(

                    state.quartas[qA.id] &&

                    state.quartas[qB.id]

                )

        };

    });

}


// ============================================================================
// FINAL
// ============================================================================

function obterFinal() {

    const semisComNomes = obterSemisComNomes();


    return {

        opcaoA:

            state.semis.s1 ||

            "Vencedor Semi 1",


        opcaoB:

            state.semis.s2 ||

            "Vencedor Semi 2",


        pronta:

            Boolean(

                state.semis.s1 &&

                state.semis.s2

            )

    };

}


// ============================================================================
// CONTROLE DE ERROS
// ============================================================================

function mostrarErro(mensagem) {

    state.erro = mensagem;


    const erroEtapa1 = get("erro-etapa-1");

    const erroEtapa2 = get("erro-etapa-2");


    erroEtapa1.hidden = true;

    erroEtapa2.hidden = true;


    if (!mensagem) return;


    if (state.etapa === 1) {

        erroEtapa1.textContent = mensagem;

        erroEtapa1.hidden = false;

    }

    else {

        erroEtapa2.textContent = mensagem;

        erroEtapa2.hidden = false;

    }

}


function limparErro() {

    state.erro = "";


    get("erro-etapa-1").hidden = true;

    get("erro-etapa-2").hidden = true;

}


// ============================================================================
// ATUALIZAÇÃO DE PLACAR
// ============================================================================

function atualizarPlacar(

    jogoId,

    campo,

    valor

) {

    // Aceita somente:

    // ""

    // ou até dois dígitos numéricos.

    if (

        valor !== "" &&

        !/^\d{0,2}$/.test(valor)

    ) {

        return;

    }


    state.scores[jogoId][campo] = valor;


    renderOitavas();

}


// ============================================================================
// SELEÇÃO NOS PÊNALTIS
// ============================================================================

function selecionarPenaltis(

    jogoId,

    vencedor

) {

    state.scores[jogoId].penaltis = vencedor;


    renderOitavas();

}


// ============================================================================
// CRIAÇÃO DOS BOTÕES DE ESCOLHA
// ============================================================================

function criarBotoesEscolha(

    options,

    selected,

    onSelect

) {

    const container = document.createElement("div");


    container.className = "botoes-escolha";


    options.forEach(option => {

        const button = document.createElement("button");


        button.type = "button";

        button.className = "botao-escolha";


        if (selected === option) {

            button.classList.add("selecionado");

        }


        button.textContent = option;


        button.addEventListener(

            "click",

            () => onSelect(option)

        );


        container.appendChild(button);

    });


    return container;

}


// ============================================================================
// RENDERIZAÇÃO DE UMA LINHA DE PLACAR
// ============================================================================

function criarScoreRow({

    label,

    casa,

    fora,

    valCasa,

    valFora,

    onCasa,

    onFora

}) {

    const container = document.createElement("div");


    const labelElement = document.createElement("div");

    labelElement.className = "rodada-label";

    labelElement.textContent = label;


    const row = document.createElement("div");

    row.className = "score-row";


    const timeCasa = document.createElement("span");

    timeCasa.className = "nome-time casa";

    timeCasa.title = casa;

    timeCasa.innerHTML =
        `<span class="nome-time-texto">${escapeHTML(casa)}</span>${escudoTimeHTML(casa)}`;


    const inputCasa = document.createElement("input");

    inputCasa.className = "score-input";

    inputCasa.type = "text";

    inputCasa.inputMode = "numeric";

    inputCasa.maxLength = 2;

    inputCasa.value = valCasa;


    inputCasa.addEventListener(

        "input",

        event => {

            onCasa(event.target.value);

        }

    );


    const separador = document.createElement("span");

    separador.className = "separador-placar";

    separador.textContent = "x";


    const inputFora = document.createElement("input");

    inputFora.className = "score-input";

    inputFora.type = "text";

    inputFora.inputMode = "numeric";

    inputFora.maxLength = 2;

    inputFora.value = valFora;


    inputFora.addEventListener(

        "input",

        event => {

            onFora(event.target.value);

        }

    );


    const timeFora = document.createElement("span");

    timeFora.className = "nome-time";

    timeFora.title = fora;

    timeFora.innerHTML =
        `${escudoTimeHTML(fora)}<span class="nome-time-texto">${escapeHTML(fora)}</span>`;


    row.appendChild(timeCasa);

    row.appendChild(inputCasa);

    row.appendChild(separador);

    row.appendChild(inputFora);

    row.appendChild(timeFora);


    container.appendChild(labelElement);

    container.appendChild(row);


    return container;

}


// ============================================================================
// RENDERIZAÇÃO DAS OITAVAS
// ============================================================================

function renderOitavas() {

    const container = get("lista-oitavas");


    container.innerHTML = "";


    const classificados = obterClassificados();


    OITAVAS.forEach(jogo => {

        const scores = state.scores[jogo.id];

        const resultado = classificados[jogo.id];


        const card = document.createElement("div");

        card.className = "card-confronto";


        const titulo = document.createElement("div");

        titulo.className = "titulo-confronto";

        titulo.textContent =

            `${jogo.casa} x ${jogo.fora}`;


        const placares = document.createElement("div");

        placares.className = "placares";


        const ida = criarScoreRow({

            label: "Ida",

            casa: jogo.casa,

            fora: jogo.fora,

            valCasa: scores.idaCasa,

            valFora: scores.idaFora,

            onCasa: valor =>

                atualizarPlacar(

                    jogo.id,

                    "idaCasa",

                    valor

                ),

            onFora: valor =>

                atualizarPlacar(

                    jogo.id,

                    "idaFora",

                    valor

                )

        });


        const volta = criarScoreRow({

            label: "Volta",

            casa: jogo.fora,

            fora: jogo.casa,

            valCasa: scores.voltaCasa,

            valFora: scores.voltaFora,

            onCasa: valor =>

                atualizarPlacar(

                    jogo.id,

                    "voltaCasa",

                    valor

                ),

            onFora: valor =>

                atualizarPlacar(

                    jogo.id,

                    "voltaFora",

                    valor

                )

        });


        placares.appendChild(ida);

        placares.appendChild(volta);


        card.appendChild(titulo);

        card.appendChild(placares);


        // Empate no agregado

        if (resultado === "EMPATE") {

            const areaPenaltis = document.createElement("div");

            areaPenaltis.className = "area-penaltis";


            const texto = document.createElement("div");

            texto.className = "texto-penaltis";

            texto.textContent =

                "Agregado empatado — vai para os pênaltis. Quem passa?";


            const botoes = criarBotoesEscolha(

                [jogo.casa, jogo.fora],

                scores.penaltis,

                vencedor =>

                    selecionarPenaltis(

                        jogo.id,

                        vencedor

                    )

            );


            areaPenaltis.appendChild(texto);

            areaPenaltis.appendChild(botoes);


            card.appendChild(areaPenaltis);

        }


        // Classificado definido

        if (

            resultado &&

            resultado !== "EMPATE"

        ) {

            const classificado = document.createElement("div");


            classificado.className =

                "resultado-classificado";


            classificado.textContent =

                `Classificado: ${resultado}`;


            card.appendChild(classificado);

        }


        container.appendChild(card);

    });

}


// ============================================================================
// RENDERIZAÇÃO DAS QUARTAS
// ============================================================================

function renderQuartas() {

    const container = get("lista-quartas");


    container.innerHTML = "";


    const quartasComNomes =

        obterQuartasComNomes();


    quartasComNomes.forEach(q => {

        const card = document.createElement("div");

        card.className = "confronto-escolha";


        const descricao = document.createElement("div");

        descricao.className = "descricao-escolha";

        descricao.textContent =

            `${q.opcaoA} x ${q.opcaoB}`;


        const botoes = criarBotoesEscolha(

            [q.opcaoA, q.opcaoB],

            state.quartas[q.id],

            vencedor => {

                state.quartas[q.id] = vencedor;


                // Caso a escolha de uma quarta
                // altere a composição de uma semifinal,
                // renderiza novamente todas as fases seguintes.

                renderFasesFinais();

            }

        );


        card.appendChild(descricao);

        card.appendChild(botoes);


        container.appendChild(card);

    });

}


// ============================================================================
// RENDERIZAÇÃO DAS SEMIFINAIS
// ============================================================================

function renderSemis() {

    const container = get("lista-semis");


    container.innerHTML = "";


    const semisComNomes =

        obterSemisComNomes();


    semisComNomes.forEach(semi => {

        const card = document.createElement("div");

        card.className = "confronto-escolha";


        const descricao = document.createElement("div");

        descricao.className = "descricao-escolha";

        descricao.textContent =

            `${semi.opcaoA} x ${semi.opcaoB}`;


        card.appendChild(descricao);


        if (semi.pronto) {

            const botoes = criarBotoesEscolha(

                [semi.opcaoA, semi.opcaoB],

                state.semis[semi.id],

                vencedor => {

                    state.semis[semi.id] = vencedor;


                    renderFasesFinais();

                }

            );


            card.appendChild(botoes);

        }

        else {

            const bloqueado = document.createElement("div");

            bloqueado.className = "texto-bloqueado";


            bloqueado.textContent =

                "Escolha os dois classificados das quartas correspondentes acima primeiro.";


            card.appendChild(bloqueado);

        }


        container.appendChild(card);

    });

}


// ============================================================================
// RENDERIZAÇÃO DA FINAL
// ============================================================================

function renderFinal() {

    const container = get("card-final");


    container.innerHTML = "";


    const final = obterFinal();


    const descricao = document.createElement("div");

    descricao.className = "descricao-escolha";


    descricao.textContent =

        `${final.opcaoA} x ${final.opcaoB}`;


    container.appendChild(descricao);


    if (final.pronta) {

        const botoes = criarBotoesEscolha(

            [final.opcaoA, final.opcaoB],

            state.final,

            vencedor => {

                state.final = vencedor;


                renderFinal();

            }

        );


        container.appendChild(botoes);

    }

    else {

        const bloqueado = document.createElement("div");

        bloqueado.className = "texto-bloqueado";


        bloqueado.textContent =

            "Escolha os dois classificados das semifinais acima primeiro.";


        container.appendChild(bloqueado);

    }


    const campeaoElement = get("campeao-selecionado");


    if (state.final) {

        campeaoElement.textContent =

            `Seu campeão: ${state.final}`;


        campeaoElement.hidden = false;

    }

    else {

        campeaoElement.hidden = true;

    }

}


// ============================================================================
// RENDERIZAÇÃO DAS FASES FINAIS
// ============================================================================

function renderFasesFinais() {

    renderQuartas();

    renderSemis();

    renderFinal();

}


// ============================================================================
// AVANÇAR PARA A ETAPA 2
// ============================================================================

function avancarEtapa() {

    if (!oitavasCompletas()) {

        mostrarErro(

            "Preencha os placares (ida e volta) de todos os 8 confrontos."

        );


        return;

    }


    if (haEmpatesPendentes()) {

        mostrarErro(

            "Há confrontos empatados no agregado. Indique quem passa nos pênaltis antes de continuar."

        );


        return;

    }


    limparErro();


    state.etapa = 2;


    // Etapa 1 permanece visível — a página é expandida, não substituída.
    get("etapa-2").hidden = false;


    renderFasesFinais();


    // Rola até o início da Etapa 2 (em vez de voltar ao topo da página),
    // já que a Etapa 1 continua visível acima.
    get("etapa-2").scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ============================================================================
// VOLTAR PARA A ETAPA 1
// ============================================================================

function voltarEtapa() {

    state.etapa = 1;


    get("etapa-1").hidden = false;

    get("etapa-2").hidden = true;


    limparErro();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ============================================================================
// VALIDAÇÃO COMPLETA
// ============================================================================

function validar() {


    if (!oitavasCompletas()) {

        return "Preencha os placares de todos os 8 confrontos das oitavas.";

    }


    if (haEmpatesPendentes()) {

        return "Indique quem passa nos pênaltis nos confrontos empatados.";

    }


    const quartasComNomes =

        obterQuartasComNomes();


    for (const q of quartasComNomes) {

        if (!state.quartas[q.id]) {

            return "Escolha quem passa em todos os confrontos das quartas.";

        }

    }


    if (

        !state.semis.s1 ||

        !state.semis.s2

    ) {

        return "Escolha quem passa nas duas semifinais.";

    }


    if (!state.final) {

        return "Escolha o campeão da final.";

    }


    return "";

}


// ============================================================================
// MONTAGEM DO PAYLOAD
// ============================================================================

function montarPayload() {

    const classificados =

        obterClassificados();


    const quartasComNomes =

        obterQuartasComNomes();


    const semisComNomes =

        obterSemisComNomes();


    const final =

        obterFinal();


    return {


        oitavas: OITAVAS.map(jogo => {

            const scores =

                state.scores[jogo.id];


            return {

                confronto:

                    `${jogo.casa} x ${jogo.fora}`,

                ida:

                    `${scores.idaCasa}-${scores.idaFora}`,

                volta:

                    `${scores.voltaCasa}-${scores.voltaFora}`,

                penaltis:

                    scores.penaltis || null,

                classificadoInferido:

                    classificados[jogo.id]

            };

        }),


        quartas:

            quartasComNomes.map(q => ({

                confronto:

                    `${q.opcaoA} x ${q.opcaoB}`,

                classificado:

                    state.quartas[q.id]

            })),


        semis:

            semisComNomes.map(s => ({

                confronto:

                    `${s.opcaoA} x ${s.opcaoB}`,

                classificado:

                    state.semis[s.id]

            })),


        final:

            `${final.opcaoA} x ${final.opcaoB}`,


        campeao:

            state.final,


        enviadoEm:

            new Date().toISOString()

    };

}


// ============================================================================
// ENVIO DO FORMULÁRIO
// ============================================================================

function handleSubmit() {

    const mensagem = validar();


    if (mensagem) {

        mostrarErro(mensagem);

        return;

    }


    limparErro();


    const payload = montarPayload();


    // ========================================================================
    // MODO DE TESTE
    // ========================================================================

    state.payloadDebug = payload;

    state.enviado = true;


    mostrarTelaSucesso();


    // ========================================================================
    // FUTURA INTEGRAÇÃO COM GOOGLE APPS SCRIPT
    // ========================================================================
    //
    // fetch("SUA_URL_DO_APPS_SCRIPT_AQUI", {
    //
    //     method: "POST",
    //
    //     body: JSON.stringify(payload)
    //
    // });
    //
    // ========================================================================

}


// ============================================================================
// TELA DE SUCESSO
// ============================================================================

function mostrarTelaSucesso() {

    get("app").hidden = true;

    get("tela-sucesso").hidden = false;




    get("mensagem-sucesso").textContent =

        "Seu palpite para as Oitavas da Libertadores foi recebido.";


    get("payload-debug").textContent =

        JSON.stringify(

            state.payloadDebug,

            null,

            2

        );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ============================================================================
// NOVO PALPITE
// ============================================================================

function novoPalpite() {


    state.scores = criarScoresIniciais();

    state.quartas = {};

    state.semis = {};

    state.final = "";

    state.etapa = 1;

    state.erro = "";

    state.enviado = false;

    state.payloadDebug = null;



    get("app").hidden = false;

    get("tela-sucesso").hidden = true;


    get("etapa-1").hidden = false;

    get("etapa-2").hidden = true;


    limparErro();


    renderOitavas();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ============================================================================
// EVENTOS DOS CAMPOS PRINCIPAIS
// ============================================================================

function configurarEventos() {

    get("btn-avancar").addEventListener(

        "click",

        avancarEtapa

    );


    get("btn-voltar").addEventListener(

        "click",

        voltarEtapa

    );


    get("btn-enviar").addEventListener(

        "click",

        handleSubmit

    );


    get("btn-novo-palpite").addEventListener(

        "click",

        novoPalpite

    );

}


// ============================================================================
// TRAVA DE ACESSO — só libera o formulário para quem estiver logado
// ============================================================================

function mostrarBloqueioLogin() {

    get("app").hidden = true;
    get("tela-sucesso").hidden = true;
    get("tela-login-necessario").hidden = false;

}


function liberarFormulario() {

    get("tela-login-necessario").hidden = true;
    get("app").hidden = false;

    configurarEventos();
    renderOitavas();

}


function iniciarComVerificacaoDeLogin() {

    if (!window.Bolao || !Bolao.auth) {

        console.warn("auth.js não carregado — não é possível verificar o login. Liberando acesso.");
        liberarFormulario();
        return;

    }

    if (!Bolao.auth.estaLogado()) {

        mostrarBloqueioLogin();

        get("btn-fazer-login").addEventListener("click", () => {

            Bolao.layout.abrirModalLogin();

            // Verifica periodicamente se o login foi concluído no modal,
            // e libera o formulário assim que detectar a sessão ativa.
            const checarLogin = setInterval(() => {

                if (Bolao.auth.estaLogado()) {

                    clearInterval(checarLogin);
                    liberarFormulario();

                }

            }, 500);

        });

        return;

    }

    liberarFormulario();

}


// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

function init() {

    iniciarComVerificacaoDeLogin();

}


// Executa quando o DOM estiver pronto.

if (

    document.readyState === "loading"

) {

    document.addEventListener(

        "DOMContentLoaded",

        init

    );

}

else {

    init();

}