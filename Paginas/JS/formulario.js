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
    payloadDebug: null,
    datasJogos: {}, // ADICIONADO: Guardará as datas vindas da planilha
    modificado: false // ADICIONADO: Avisa se há dados não salvos
};

// Movido para cá para ser global e reutilizado
const mapaIds = {
    "j1": ["J01", "J02"], "j2": ["J03", "J04"],
    "j3": ["J05", "J06"], "j4": ["J07", "J08"],
    "j5": ["J09", "J10"], "j6": ["J11", "J12"],
    "j7": ["J13", "J14"], "j8": ["J15", "J16"]
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

function atualizarPlacar(jogoId, campo, valor) {
    // Aceita somente "" ou até dois dígitos numéricos (0 a 99)
    if (valor !== "" && !/^\d{0,2}$/.test(valor)) {
        mostrarErro("⚠️ Por favor, digite apenas números positivos (0 a 99) nos placares.");
        
        // Força a limpeza do caractere inválido da tela imediatamente
        const input = document.querySelector(`[data-jogo-id="${jogoId}"][data-campo="${campo}"]`);
        if (input) input.value = state.scores[jogoId][campo];
        
        // Limpa a mensagem de erro após 2,5 segundos
        setTimeout(() => limparErro(), 2500);
        return;
    }

    state.scores[jogoId][campo] = valor;
    state.modificado = true; // ADICIONADO: Marca que há alterações não salvas

    // Verifica se o classificado mudou e limpa a cascata
    const jogo = OITAVAS.find(j => j.id === jogoId);
    const novoClassificado = calcularClassificado(jogo, state.scores[jogoId]);

    if (novoClassificado !== "EMPATE") {
        state.scores[jogoId].penaltis = "";
    }

    limparCadeiaSeNecessario(jogoId, novoClassificado);

    renderOitavas();
    renderFasesFinais();
}

// ============================================================================
// SELEÇÃO NOS PÊNALTIS
// ============================================================================

function selecionarPenaltis(jogoId, vencedor) {

    state.scores[jogoId].penaltis = vencedor;
    state.modificado = true; // ADICIONADO: Marca que há alterações não salvas

    // NOVA LÓGICA: Ao definir os pênaltis, o classificado mudou, logo limpamos a cascata
    limparCadeiaSeNecessario(jogoId, vencedor);

    renderOitavas();
    renderFasesFinais();
}

// ============================================================================
// LIMPEZA EM CASCATA (Se um time muda, limpa as fases seguintes)
// ============================================================================

function limparCadeiaSeNecessario(jogoId, classificadoAtual) {
    
    // Mapa de qual jogo das Oitavas alimenta qual chave das Quartas
    const mapaOitavasParaQuartas = {
        "j1": "q1", "j2": "q1",
        "j3": "q2", "j4": "q2",
        "j5": "q3", "j6": "q3",
        "j7": "q4", "j8": "q4"
    };
    
    const qId = mapaOitavasParaQuartas[jogoId];
    if (!qId) return;

    const selecaoAnteriorQuartas = state.quartas[qId];
    
    // Se o time que se classificou mudou (ou ficou nulo/empate), 
    // e era diferente do que estava selecionado, limpa a seleção das Quartas
    if (classificadoAtual !== selecaoAnteriorQuartas) {
        state.quartas[qId] = "";
        
        // Se limpou as Quartas, verifica se precisa limpar a Semi
        const sId = (qId === "q1" || qId === "q2") ? "s1" : "s2";
        if (state.semis[sId]) {
            state.semis[sId] = "";
            
            // Se limpou a Semi, limpa a Final
            state.final = "";
        }
    }
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
    onFora,
    jogoId,
    campoCasa,
    campoFora, 
    dataHora,
    bloqueado = false // ADICIONADO
}) {

    const container = document.createElement("div");

    const labelElement = document.createElement("div");
    labelElement.className = "rodada-label";

    // ADICIONADO: Se tiver data, coloca ao lado do label
    if (dataHora) {
        labelElement.innerHTML = `<strong>${label}</strong> <span class="data-jogo">${escapeHTML(dataHora)}</span>`;
    } else {
        labelElement.textContent = label;
    }

    // ADICIONADO: Aviso visual de bloqueio
    if (bloqueado) {
        labelElement.innerHTML += ` <span style="color: var(--gold); font-weight: bold; font-size: 0.9em;">🔒 Encerrado</span>`;
    }

    const row = document.createElement("div");
    row.className = "score-row";

    const timeCasa = document.createElement("span");
    timeCasa.className = "nome-time casa";
    timeCasa.title = casa;
    timeCasa.innerHTML = `<span class="nome-time-texto">${escapeHTML(casa)}</span>${escudoTimeHTML(casa)}`;

    const inputCasa = document.createElement("input");
    inputCasa.className = "score-input";
    inputCasa.type = "text";
    inputCasa.inputMode = "numeric";
    inputCasa.maxLength = 2;
    inputCasa.value = valCasa;
    inputCasa.dataset.jogoId = jogoId;
    inputCasa.dataset.campo = campoCasa;
    inputCasa.disabled = bloqueado; // ADICIONADO: Trava o input

    inputCasa.addEventListener("input", event => {onCasa(event.target.value);});

    const separador = document.createElement("span");
    separador.className = "separador-placar";
    separador.textContent = "x";

    const inputFora = document.createElement("input");
    inputFora.className = "score-input";
    inputFora.type = "text";
    inputFora.inputMode = "numeric";
    inputFora.maxLength = 2;
    inputFora.value = valFora;
    inputFora.dataset.jogoId = jogoId;
    inputFora.dataset.campo = campoFora;
    inputFora.disabled = bloqueado; // ADICIONADO: Trava o input

    inputFora.addEventListener("input", event => {onFora(event.target.value);});

    const timeFora = document.createElement("span");
    timeFora.className = "nome-time";
    timeFora.title = fora;
    timeFora.innerHTML = `${escudoTimeHTML(fora)}<span class="nome-time-texto">${escapeHTML(fora)}</span>`;

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
// PRESERVAÇÃO DE FOCO / CURSOR AO RE-RENDERIZAR
// ============================================================================

// Como renderOitavas() recria todo o DOM da lista a cada atualização de
// placar, o campo em que o usuário está digitando (ou o botão clicado)
// seria destruído e o foco cairia para o <body>. Isso quebrava a navegação
// por Tab (o próximo Tab recomeçava do primeiro campo da página) e fazia
// a página rolar para o topo ao perder o foco. Para evitar isso, guardamos
// qual campo estava focado — e a posição do cursor nele — antes de
// recriar o DOM, e devolvemos o foco para o campo equivalente depois.

function salvarFocoAtual(container) {

    const ativo = document.activeElement;

    if (!ativo || !container.contains(ativo)) {
        return null;
    }

    if (ativo.dataset && ativo.dataset.jogoId) {

        return {
            jogoId: ativo.dataset.jogoId,
            campo: ativo.dataset.campo,
            selectionStart: ativo.selectionStart,
            selectionEnd: ativo.selectionEnd
        };

    }

    return null;

}


function restaurarFoco(container, focoSalvo) {

    if (!focoSalvo) return;

    const seletor =
        `[data-jogo-id="${focoSalvo.jogoId}"][data-campo="${focoSalvo.campo}"]`;

    const elemento = container.querySelector(seletor);

    if (!elemento) return;

    // Restaura o foco sem deixar o navegador rolar a página, já que o
    // elemento está exatamente na mesma posição visual de antes.
    elemento.focus({ preventScroll: true });

    if (
        typeof focoSalvo.selectionStart === "number" &&
        typeof elemento.setSelectionRange === "function"
    ) {

        elemento.setSelectionRange(
            focoSalvo.selectionStart,
            focoSalvo.selectionEnd
        );

    }

}


// ============================================================================
// RENDERIZAÇÃO DAS OITAVAS
// ============================================================================

function renderOitavas() {

    const container = get("lista-oitavas");
    const focoSalvo = salvarFocoAtual(container);
    container.innerHTML = "";
    const classificados = obterClassificados();

    OITAVAS.forEach(jogo => {
        const scores = state.scores[jogo.id];
        const resultado = classificados[jogo.id];
        const card = document.createElement("div");
        card.className = "card-confronto";
        const titulo = document.createElement("div");
        titulo.className = "titulo-confronto";
        titulo.textContent = `${jogo.casa} x ${jogo.fora}`;
        const placares = document.createElement("div");
        placares.className = "placares";

        // Pega os IDs corretos da planilha para buscar a data
        const [idIda, idVolta] = mapaIds[jogo.id];

        // Busca as datas salvas no estado
        const dataIda = state.datasJogos[idIda] 
            ? `${state.datasJogos[idIda].data} ${state.datasJogos[idIda].horario}` 
            : "";
            
        const dataVolta = state.datasJogos[idVolta] 
            ? `${state.datasJogos[idVolta].data} ${state.datasJogos[idVolta].horario}` 
            : "";

        // ADICIONADO: Verifica se os jogos estão bloqueados
        const idaBloqueada = verificarBloqueio(idIda);
        const voltaBloqueada = verificarBloqueio(idVolta);
        
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
                ),
            jogoId: jogo.id,
            campoCasa: "idaCasa",
            campoFora: "idaFora",
            dataHora: dataIda,
            bloqueado: idaBloqueada // ADICIONADO

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
                ),
            jogoId: jogo.id,
            campoCasa: "voltaCasa",
            campoFora: "voltaFora",
            dataHora: dataVolta,
            bloqueado: voltaBloqueada // ADICIONADO
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

    restaurarFoco(container, focoSalvo);

}


// ============================================================================
// RENDERIZAÇÃO DAS QUARTAS
// ============================================================================

function renderQuartas() {

    const container = get("lista-quartas");
    container.innerHTML = "";

    const quartasComNomes = obterQuartasComNomes();
    const prazoEncerrado = verificarPrazoMataMata();

    quartasComNomes.forEach(q => {

        const card = document.createElement("div");
        card.className = "confronto-escolha";

        const descricao = document.createElement("div");
        descricao.className = "descricao-escolha";
        descricao.textContent = `${q.opcaoA} x ${q.opcaoB}`;
        card.appendChild(descricao);

        if (prazoEncerrado) {
            const bloqueado = document.createElement("div");
            bloqueado.className = "texto-bloqueado";
            bloqueado.textContent = "🔒 Prazo encerrado para alterar as Quartas de Final.";
            card.appendChild(bloqueado);
        } else {
            const botoes = criarBotoesEscolha(
                [q.opcaoA, q.opcaoB],
                state.quartas[q.id],
                vencedor => {
                    const selecaoAnterior = state.quartas[q.id];
                    state.quartas[q.id] = vencedor;

                    // Se mudou a seleção, limpa as fases dependentes
                    if (selecaoAnterior !== vencedor) {
                        state.modificado = true; // ADICIONADO
                        const sId = (q.id === "q1" || q.id === "q2") ? "s1" : "s2";
                        state.semis[sId] = ""; // Limpa a Semi
                        state.final = "";     // Limpa a Final
                    }

                    renderFasesFinais();
                }
            );
            card.appendChild(botoes);
        }

        container.appendChild(card);
    });
}


// ============================================================================
// RENDERIZAÇÃO DAS SEMIFINAIS
// ============================================================================

function renderSemis() {

    const container = get("lista-semis");
    container.innerHTML = "";

    const semisComNomes = obterSemisComNomes();
    const prazoEncerrado = verificarPrazoMataMata();

    semisComNomes.forEach(semi => {

        const card = document.createElement("div");
        card.className = "confronto-escolha";

        const descricao = document.createElement("div");
        descricao.className = "descricao-escolha";
        descricao.textContent = `${semi.opcaoA} x ${semi.opcaoB}`;
        card.appendChild(descricao);

        if (prazoEncerrado) {
            const bloqueado = document.createElement("div");
            bloqueado.className = "texto-bloqueado";
            bloqueado.textContent = "🔒 Prazo encerrado para alterar as Semifinais.";
            card.appendChild(bloqueado);
        } else if (semi.pronto) {
            const botoes = criarBotoesEscolha(
                [semi.opcaoA, semi.opcaoB],
                state.semis[semi.id],
                vencedor => {
                    const selecaoAnterior = state.semis[semi.id];
                    state.semis[semi.id] = vencedor;

                    // Se mudou a seleção, limpa a Final
                    if (selecaoAnterior !== vencedor) {
                        state.modificado = true; // ADICIONADO
                        state.final = "";
                    }

                    renderFasesFinais();
                }
            );
            card.appendChild(botoes);
        } else {
            const bloqueado = document.createElement("div");
            bloqueado.className = "texto-bloqueado";
            bloqueado.textContent = "Escolha os dois classificados das quartas correspondentes acima primeiro.";
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
    const prazoEncerrado = verificarPrazoMataMata();

    const descricao = document.createElement("div");
    descricao.className = "descricao-escolha";
    descricao.textContent = `${final.opcaoA} x ${final.opcaoB}`;
    container.appendChild(descricao);

    if (prazoEncerrado) {
        const bloqueado = document.createElement("div");
        bloqueado.className = "texto-bloqueado";
        bloqueado.textContent = "🔒 Prazo encerrado para alterar a Final.";
        container.appendChild(bloqueado);
    } else if (final.pronta) {
        const botoes = criarBotoesEscolha(
            [final.opcaoA, final.opcaoB],
            state.final,
            vencedor => {
                state.final = vencedor;
                state.modificado = true; // ADICIONADO
                renderFinal();
            }
        );
        container.appendChild(botoes);
    } else {
        const bloqueado = document.createElement("div");
        bloqueado.className = "texto-bloqueado";
        bloqueado.textContent = "Escolha os dois classificados das semifinais acima primeiro.";
        container.appendChild(bloqueado);
    }

    const campeaoElement = get("campeao-selecionado");

    if (state.final) {
        // NOVA FORMATAÇÃO COM DESTAQUE TOTAL
        campeaoElement.innerHTML = `
            <div style="margin-top: 24px; padding: 24px; background: linear-gradient(135deg, rgba(255,215,0,.15), rgba(255,215,0,.05)); border: 2px solid var(--gold); border-radius: 16px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,.3);">
                <div style="font-size: 14px; color: rgba(255,255,255,.7); margin-bottom: 8px; font-weight: 600; letter-spacing: 1px;">🏆 SEU CAMPEÃO 🏆</div>
                <div style="font-size: 28px; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; gap: 12px;">
                    ${escudoTimeHTML(state.final)}
                    <span>${escapeHTML(state.final)}</span>
                </div>
            </div>
        `;
        campeaoElement.hidden = false;
    } else {
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
// VALIDAÇÃO CRUZADA (Consistência do Mata-Mata)
// ============================================================================
function validarConsistenciaPalpites() {
    
    // 1. Valida Quartas (Devem ser os classificados das Oitavas)
    const quartasComNomes = obterQuartasComNomes();
    for (const q of quartasComNomes) {
        const selecao = state.quartas[q.id];
        if (selecao && selecao !== q.opcaoA && selecao !== q.opcaoB) {
            return "Inconsistência nas Quartas: Um time eliminado nas Oitavas foi selecionado. Revise seus palpites.";
        }
    }

    // 2. Valida Semifinais (Devem ser os classificados das Quartas)
    const semisComNomes = obterSemisComNomes();
    for (const s of semisComNomes) {
        const selecao = state.semis[s.id];
        if (selecao && selecao !== s.opcaoA && selecao !== s.opcaoB) {
            return "Inconsistência nas Semifinais: Um time eliminado nas Quartas foi selecionado. Revise seus palpites.";
        }
    }

    // 3. Valida Final (Devem ser os classificados das Semifinais)
    const final = obterFinal();
    if (state.final && state.final !== final.opcaoA && state.final !== final.opcaoB) {
        return "Inconsistência na Final: O campeão selecionado não estava entre os finalistas. Revise seus palpites.";
    }

    return ""; // Passou em todos os testes
}

// ============================================================================
// PEGAR NOME DO USUÁRIO LOGADO
// ============================================================================
// Tenta pegar o nome do usuário através do seu módulo Bolao.auth.
// Caso não consiga, usa um nome padrão para não travar o envio.
function obterNomeParticipante() {
    try {
        if (window.Bolao && Bolao.auth && Bolao.auth.getUsuario) {

            const usuario = Bolao.auth.getUsuario();

            // getUsuario() retorna o objeto de sessão inteiro
            // ({ nome, token, criadoEm }), não só o nome. Por isso
            // extraímos explicitamente o campo "nome" aqui — se o
            // payload usar o objeto inteiro, ele é serializado como
            // "{nome=..., token=..., criadoEm=...}" na planilha.
            if (usuario && typeof usuario === "object" && usuario.nome) {
                return usuario.nome;
            }

            if (typeof usuario === "string" && usuario) {
                return usuario;
            }

        }
    } catch (e) {
        console.warn("Não foi possível obter o usuário logado.");
    }
    return "Participante";
}

// ============================================================================
// MONTAGEM DO PAYLOAD (Formato da Planilha)
// ============================================================================
function montarPayload() {

    const participante = obterNomeParticipante();
    const agora = new Date().toISOString();

    // Dicionário com as datas originais (se o usuário já tinha palpites salvos)
    const datasCriadas = state.datasCriacao || {};

    let listaDePalpites = [];

    // 1. OITAVAS (Placares de Ida e Volta)
    OITAVAS.forEach(jogo => {
        const scores = state.scores[jogo.id];
        const [idIda, idVolta] = mapaIds[jogo.id];

        // Palpite do Jogo de Ida
        listaDePalpites.push({
            Participante: participante,
            JogoID: idIda,
            Fase: "Oitavas",
            TipoPalpite: "Placar",
            GolsMandante: scores.idaCasa === "" ? null : Number(scores.idaCasa),
            GolsVisitante: scores.idaFora === "" ? null : Number(scores.idaFora),
            Valor: "",
            CriadoEm: datasCriadas[idIda + "_Placar"] || agora,
            AtualizadoEm: agora
        });

        // Palpite do Jogo de Volta
        listaDePalpites.push({
            Participante: participante,
            JogoID: idVolta,
            Fase: "Oitavas",
            TipoPalpite: "Placar",
            GolsMandante: scores.voltaCasa === "" ? null : Number(scores.voltaCasa),
            GolsVisitante: scores.voltaFora === "" ? null : Number(scores.voltaFora),
            Valor: "",
            CriadoEm: datasCriadas[idVolta + "_Placar"] || agora,
            AtualizadoEm: agora
        });

        // Linha de pênaltis (sempre envia para limpar caso não haja)
        listaDePalpites.push({
            Participante: participante,
            JogoID: idIda,
            Fase: "Oitavas",
            TipoPalpite: "Penaltis",
            GolsMandante: null,
            GolsVisitante: null,
            Valor: scores.penaltis || "",
            CriadoEm: datasCriadas[idIda + "_Penaltis"] || agora,
            AtualizadoEm: agora
        });
    });

    // 2. QUARTAS DE FINAL (8 times classificados)
    const classificadosOitavas = obterClassificados();
    let qIdx = 1;
    for (const jogoId in classificadosOitavas) {
        const timeClassificado = classificadosOitavas[jogoId];
        if (timeClassificado && timeClassificado !== "EMPATE") {
            listaDePalpites.push({
                Participante: participante,
                JogoID: `Q${qIdx}`, // Q1 a Q8
                Fase: "Quartas",
                TipoPalpite: "Classificado",
                GolsMandante: null,
                GolsVisitante: null,
                Valor: timeClassificado,
                CriadoEm: datasCriadas[`Q${qIdx}_Classificado`] || agora,
                AtualizadoEm: agora
            });
            qIdx++;
        }
    }

    // 3. SEMIFINAL (4 times classificados)
    let sIdx = 1;
    for (const qId in state.quartas) {
        const timeClassificado = state.quartas[qId];
        if (timeClassificado) {
            listaDePalpites.push({
                Participante: participante,
                JogoID: `S${sIdx}`, // S1 a S4
                Fase: "Semifinal",
                TipoPalpite: "Classificado",
                GolsMandante: null,
                GolsVisitante: null,
                Valor: timeClassificado,
                CriadoEm: datasCriadas[`S${sIdx}_Classificado`] || agora,
                AtualizadoEm: agora
            });
            sIdx++;
        }
    }

    // 4. FINAL (2 times classificados)
    let fIdx = 1;
    for (const sId in state.semis) {
        const timeClassificado = state.semis[sId];
        if (timeClassificado) {
            listaDePalpites.push({
                Participante: participante,
                JogoID: `F${fIdx}`, // F1 e F2
                Fase: "Final",
                TipoPalpite: "Classificado",
                GolsMandante: null,
                GolsVisitante: null,
                Valor: timeClassificado,
                CriadoEm: datasCriadas[`F${fIdx}_Classificado`] || agora,
                AtualizadoEm: agora
            });
            fIdx++;
        }
    }

    // 5. CAMPEÃO (1 time)
    if (state.final) {
        listaDePalpites.push({
            Participante: participante,
            JogoID: "C1",
            Fase: "Campeao",
            TipoPalpite: "Campeao",
            GolsMandante: null,
            GolsVisitante: null,
            Valor: state.final,
            CriadoEm: datasCriadas["C1_Campeao"] || agora,
            AtualizadoEm: agora
        });
    }

    return listaDePalpites;
}

// ============================================================================
// ENVIO DO FORMULÁRIO (Comunicação com o Google Sheets)
// ============================================================================

async function handleSubmit() {

    // 1. Verifica se tudo está preenchido
    let mensagem = validar();
    
    // 2. NOVA VERIFICAÇÃO: Checa se os palpites são coerentes (cruzados)
    if (!mensagem) {
        mensagem = validarConsistenciaPalpites();
    }

    if (mensagem) {
        mostrarErro(mensagem);
        return;
    }
    
    limparErro();

    // 2. Monta os dados no formato da planilha
    const payload = montarPayload();
    state.payloadDebug = payload;

    // URL do seu Google Apps Script
    const urlDaPlanilha = 'https://script.google.com/macros/s/AKfycbxiiDpGwGYiEauxy_1e8fH5ysQGi3IJijVZluOZQI_Ftndbyz6htgngfWQFkfeLwL3XWg/exec';

    // Pega o botão e trava para evitar cliques duplos
    const btnEnviar = get("btn-enviar");
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    try {
        // 3. Envia os dados para a internet
        const resposta = await fetch(urlDaPlanilha, {
            method: 'POST',
            // Usa text/plain para evitar erro de CORS do Google
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({acao: 'salvarPalpite', payload})
        });

        // O Apps Script (ContentService) sempre responde com HTTP 200,
        // mesmo quando a gravação falhou internamente. Por isso não basta
        // checar resposta.ok — é preciso ler o corpo da resposta e
        // conferir o campo "status" que o próprio script devolve.
        let resultado;
        try {
            resultado = await resposta.json();
        } catch (erroParse) {
            resultado = null;
        }

        const sucesso =
            resposta.ok &&
            resultado &&
            resultado.status === "sucesso";

        // 4. Se deu tudo certo, mostra a tela de sucesso
        if (sucesso) {
            state.enviado = true;
            state.modificado = false; // ADICIONADO: Desliga o alerta pois salvou
            mostrarTelaSucesso();
        } else {
            const detalhe =
                (resultado && resultado.mensagem) ||
                "Código: " + resposta.status;

            alert("Erro ao enviar palpites. " + detalhe);
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar Palpites";
        }

    } catch (erro) {
        console.error("Erro de conexão:", erro);
        alert("Erro de conexão ao enviar. Verifique sua internet e tente novamente.");
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar Palpites";
    }
}

// ============================================================================
// TELA DE SUCESSO
// ============================================================================

function mostrarTelaSucesso() {

    // Esconde o app e mostra a tela de sucesso (apenas se existirem)
    const app = get("app");
    const telaSucesso = get("tela-sucesso");
    
    if (app) app.hidden = true;
    if (telaSucesso) telaSucesso.hidden = false;

    // Atualiza a mensagem de sucesso
    const mensagem = get("mensagem-sucesso");
    if (mensagem) {
        mensagem.textContent = "Seu palpite foi registrado com sucesso.";
    }

    // Atualiza o payload no console de debug (apenas se o elemento existir)
    const payloadDebug = get("payload-debug");
    if (payloadDebug) {
        payloadDebug.textContent = JSON.stringify(state.payloadDebug, null, 2);
    }

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

    // A função get() pode retornar null se você apagou o botão do HTML.
    const btnAvancar = get("btn-avancar");
    if (btnAvancar) btnAvancar.addEventListener("click", avancarEtapa);

    const btnVoltar = get("btn-voltar");
    if (btnVoltar) btnVoltar.addEventListener("click", voltarEtapa);

    const btnEnviar = get("btn-enviar");
    if (btnEnviar) btnEnviar.addEventListener("click", handleSubmit);

    const btnNovoPalpite = get("btn-novo-palpite");
    if (btnNovoPalpite) btnNovoPalpite.addEventListener("click", novoPalpite);

    // ADICIONADO: Alerta ao tentar fechar/recarregar a página com dados não salvos
    window.addEventListener('beforeunload', function (e) {
        if (state.modificado) {
            e.preventDefault(); // Padrão para navegadores modernos
            e.returnValue = '';  // Necessário para o Chrome funcionar
            return '';           // Padrão para navegadores antigos
        }
    });
}

// ============================================================================
// TRAVA DE ACESSO — só libera o formulário para quem estiver logado
// ============================================================================

function mostrarBloqueioLogin() {

    get("app").hidden = true;
    get("tela-sucesso").hidden = true;
    get("tela-login-necessario").hidden = false;

}


// ============================================================================
// LIBERAR FORMULÁRIO (Com tela de carregamento e Aviso de Prazo)
// ============================================================================

async function liberarFormulario() {

    get("tela-login-necessario").hidden = true;
    
    // 1. Mostra a tela de carregamento e esconde o app
    const telaCarregando = get("tela-carregando");
    const app = get("app");
    const etapa1 = get("etapa-1");
    const etapa2 = get("etapa-2");
    
    if (telaCarregando) telaCarregando.hidden = false;
    if (app) app.hidden = true;
    
    // Configura os botões enquanto carrega
    configurarEventos();

    // PAUSA ESTRATÉGICA
    await new Promise(r => setTimeout(r, 50));

    // 2. Busca os dados na nuvem
    await carregarPalpitesSalvos();
    await buscarListaDeJogos();

    // 3. Esconde o loader e mostra o app preenchido
    if (telaCarregando) telaCarregando.hidden = true;
    if (app) app.hidden = false;
    
    if (etapa1) etapa1.hidden = false;
    if (etapa2) etapa2.hidden = true;

    // Renderiza a tela
    renderOitavas();
    renderFasesFinais();

    // ADICIONADO: Insere o aviso de prazo estendido no topo da Etapa 1
    /*
        if (etapa1 && !etapa1.querySelector('.aviso-prazo')) {
        const aviso = document.createElement("div");
        aviso.className = "aviso-prazo";
        aviso.style.cssText = "background: rgba(255, 215, 0, 0.15); border: 1px solid var(--gold); color: var(--gold); padding: 12px 16px; border-radius: 10px; margin-bottom: 24px; text-align: center; font-weight: 700; font-size: 15px;";
        aviso.innerHTML = "⏰ <strong>PRAZO ESTENDIDO!</strong> Vocês têm até hoje (11/08/2026) às <strong>13h</strong> para enviar ou alterar os palpites das fases finais. Aproveitem!";
        
        // Insere antes da lista de jogos
        etapa1.insertBefore(aviso, etapa1.firstChild.nextSibling); 
    }
    */
    // ADICIONADO: Prazo Limite para Etapas além das Oitavas
    if (etapa1 && !etapa1.querySelector('.aviso-prazo')) {
        const aviso = document.createElement("div");
        aviso.className = "aviso-prazo";
        aviso.style.cssText = "background: rgba(255, 215, 0, 0.15); border: 1px solid var(--gold); color: var(--gold); padding: 12px 16px; border-radius: 10px; margin-bottom: 24px; text-align: center; font-weight: 700; font-size: 15px;";
        aviso.innerHTML = "⏰ <strong>ATEBNÇÃO AO PRAZO LIMITE!</strong> Temos até somente até 3a feira (17/08/2026) até às 23:59h <strong>13h</strong> para modificar os palpites das fases finais. Depois disso só restará torcer!";
        
        // Insere antes da lista de jogos
        etapa1.insertBefore(aviso, etapa1.firstChild.nextSibling); 
    }
       
    // Se ao carregar a etapa 2 já estiver liberada, rola a tela
    if (state.etapa === 2) {
         if (etapa2) etapa2.hidden = false;
         get("etapa-2").scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
// CARREGAR PALPITES SALVOS DO GOOGLE SHEETS
// ============================================================================

async function carregarPalpitesSalvos() {
    const participante = obterNomeParticipante();
    const urlDaPlanilha = 'https://script.google.com/macros/s/AKfycbxiiDpGwGYiEauxy_1e8fH5ysQGi3IJijVZluOZQI_Ftndbyz6htgngfWQFkfeLwL3XWg/exec';

    try {
        const resposta = await fetch(urlDaPlanilha, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ acao: 'buscarPalpites', nome: participante })
        });

        const resultado = await resposta.json();

        // Se a planilha devolveu palpites desse usuário
        if (resultado.sucesso && resultado.palpites && resultado.palpites.length > 0) {

            // Tradutor reverso: converte J01 da planilha para j1 do site
            const mapaReverso = {
                "J01": "j1", "J02": "j1", "J03": "j2", "J04": "j2",
                "J05": "j3", "J06": "j3", "J07": "j4", "J08": "j4",
                "J09": "j5", "J10": "j5", "J11": "j6", "J12": "j6",
                "J13": "j7", "J14": "j7", "J15": "j8", "J16": "j8"
            };

            // Zera o estado atual antes de preencher
            state.scores = criarScoresIniciais();
            state.quartas = {};
            state.semis = {};
            state.final = "";

            // Zera o estado atual antes de preencher
            state.scores = criarScoresIniciais();
            state.quartas = {};
            state.semis = {};
            state.final = "";
            state.datasCriacao = {}; // <--- ADICIONE ESTA LINHA
            
            resultado.palpites.forEach(p => {
                const jogoIdSite = mapaReverso[p.JogoID];

                // 1. Preenche Oitavas
                if (p.Fase === "Oitavas" && p.TipoPalpite === "Placar" && jogoIdSite) {
                    const numeroJogo = parseInt(p.JogoID.replace('J', ''));
                    
                    // Função auxiliar rápida para tratar o 0 corretamente
                    const tratarGol = (val) => (val === "" || val === null || val === undefined) ? "" : String(val);

                    // Jogos de Ida são ímpares (J01, J03...), Volta são pares (J02, J04...)
                    if (numeroJogo % 2 !== 0) { 
                        state.scores[jogoIdSite].idaCasa = tratarGol(p.GolsMandante);
                        state.scores[jogoIdSite].idaFora = tratarGol(p.GolsVisitante);
                    } else { 
                        state.scores[jogoIdSite].voltaCasa = tratarGol(p.GolsMandante);
                        state.scores[jogoIdSite].voltaFora = tratarGol(p.GolsVisitante);
                    }
                }

                // 2. Preenche Pênaltis
                if (p.Fase === "Oitavas" && p.TipoPalpite === "Penaltis" && jogoIdSite) {
                    state.scores[jogoIdSite].penaltis = p.Valor;
                }

                // 3. QUARTAS: Não precisamos recarregar, pois as Quartas são
                // calculadas automaticamente na tela ao ler os placares das Oitavas.

                // 4. SEMIFINAIS (Lê os 4 times da planilha e joga pro state.quartas)
                if (p.Fase === "Semifinal") {
                    const idx = parseInt(p.JogoID.replace('S', '')); // S1 vira 1, S2 vira 2...
                    if (idx >= 1 && idx <= 4) {
                        state.quartas[`q${idx}`] = p.Valor;
                    }
                }

                // 5. FINAL (Lê os 2 times da planilha e joga pro state.semis)
                if (p.Fase === "Final") {
                    const idx = parseInt(p.JogoID.replace('F', '')); // F1 vira 1, F2 vira 2
                    if (idx >= 1 && idx <= 2) {
                        state.semis[`s${idx}`] = p.Valor;
                    }
                }

                // 6. CAMPEÃO (Lê o 1 time da planilha e joga pro state.final)
                if (p.Fase === "Campeao") {
                    state.final = p.Valor;
                }

                // 7. Guarda a data de criação original de cada palpite
                const chaveData = p.JogoID + "_" + p.TipoPalpite;
                if (p.CriadoEm) {
                    state.datasCriacao[chaveData] = p.CriadoEm;
                }
            });
            
            // Se preencheu tudo, avança o usuário direto para a etapa 2
            if (oitavasCompletas() && !haEmpatesPendentes() && state.final) {
                state.etapa = 2;
                get("etapa-2").hidden = false;
            }
            state.modificado = false; // ADICIONADO: Dados carregados não são "alterações não salvas"
        }
    } catch (erro) {
        console.error("Erro ao carregar palpites salvos:", erro);
    }
}

// ============================================================================
// BUSCAR DATAS DOS JOGOS
// ============================================================================
async function buscarListaDeJogos() {
    const urlDaPlanilha = 'https://script.google.com/macros/s/AKfycbxiiDpGwGYiEauxy_1e8fH5ysQGi3IJijVZluOZQI_Ftndbyz6htgngfWQFkfeLwL3XWg/exec';
    try {
        // Usa GET passando o nome da aba
        const resposta = await fetch(`${urlDaPlanilha}?aba=ListaDeJogos`);
        const resultado = await resposta.json();
        
        if (resultado.data) {
            resultado.data.forEach(jogo => {
                if (jogo.idJogo) {
                    state.datasJogos[jogo.idJogo] = {
                        data: jogo.data || "",
                        horario: jogo.horario || ""
                    };
                }
            });
        }
    } catch (erro) {
        console.error("Erro ao buscar datas dos jogos:", erro);
    }
}

// ============================================================================
// VERIFICAR SE O JOGO ESTÁ BLOQUEADO
// ============================================================================
function verificarBloqueio(idJogo) {
    const dadosJogo = state.datasJogos[idJogo];
    // Se não tiver data na planilha, não bloqueia
    if (!dadosJogo || !dadosJogo.data) return false; 
    
    let dia, mes, ano;
    // Aceita data no formato dd/MM/yyyy ou yyyy-MM-dd
    if (dadosJogo.data.includes('/')) {
        const partes = dadosJogo.data.split('/');
        dia = parseInt(partes[0]);
        mes = parseInt(partes[1]) - 1; // Mês no JS começa do 0
        ano = parseInt(partes[2]);
    } else if (dadosJogo.data.includes('-')) {
        const partes = dadosJogo.data.split('-');
        ano = parseInt(partes[0]);
        mes = parseInt(partes[1]) - 1;
        dia = parseInt(partes[2]);
    } else {
        return false;
    }

    // Cria a data do jogo meia-noite (início do dia do jogo)
    //const dataJogo = new Date(ano, mes, dia, 0, 0, 0);
    //const hoje = new Date();
    //hoje.setHours(0, 0, 0, 0); // Zera as horas de hoje para comparar só os dias

    // Bloqueia se o dia de hoje for igual ou maior que o dia do jogo
    //return hoje >= dataJogo;

    // Cria a data do jogo definindo o horário limite para as 13h00
    const dataJogo = new Date(ano, mes, dia, 13, 0, 0);
    const hoje = new Date();

    // Bloqueia se o momento atual (com hora real) for igual ou maior 
    // que as 13h do dia do jogo
    return hoje >= dataJogo;
    
}

// ============================================================================
// VERIFICAR PRAZO DO MATA-MATA (Até 18 de Agosto)
// ============================================================================
function verificarPrazoMataMata() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas dias
    
    // Define o prazo: 18 de Agosto do ano atual (Mês 7 = Agosto no JavaScript)
    const prazoFinal = new Date(hoje.getFullYear(), 7, 18);
    
    // Retorna true se o dia de hoje for DEPOIS do dia 18
    return hoje > prazoFinal;
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
