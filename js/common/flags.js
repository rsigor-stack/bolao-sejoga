/**
 * ==========================================================
 * Bolão Se Joga Copa do Mundo 2026
 * Módulo de Seleções (Flags)
 * ==========================================================
 *
 * Responsável por:
 *
 * • Cadastro das seleções
 * • Trigramas FIFA
 * • Bandeiras
 * • Índices de pesquisa
 * • Métodos utilitários
 *
 * Dependências:
 *
 * core.js
 * config.js
 *
 * ==========================================================
 */

(function () {

    "use strict";

    //----------------------------------------------------------
    // Verificações
    //----------------------------------------------------------

    if (!window.Bolao) {

        throw new Error(
            "core.js deve ser carregado antes de flags.js."
        );

    }

    if (!Bolao.config) {

        throw new Error(
            "config.js deve ser carregado antes de flags.js."
        );

    }

    //----------------------------------------------------------
    // Namespace
    //----------------------------------------------------------

    Bolao.flags = {};

    //----------------------------------------------------------
    // Dados
    //----------------------------------------------------------

    Bolao.flags.data = {};

    //----------------------------------------------------------
    // Índices
    //----------------------------------------------------------

    Bolao.flags.index = {};

    //----------------------------------------------------------
    // Métodos públicos
    //----------------------------------------------------------

    Bolao.flags.methods = {};

     //----------------------------------------------------------
    // Código ISO das bandeiras
    //----------------------------------------------------------

    Bolao.flags.data.BANDEIRAS = {

        "Argentina":"ar",
        "Brasil":"br",
        "Colômbia":"co",
        "Equador":"ec",
        "Paraguai":"py",
        "Uruguai":"uy",

        "Canadá":"ca",
        "Curaçao":"cw",
        "Estados Unidos":"us",
        "Haiti":"ht",
        "México":"mx",
        "Panamá":"pa",

        "Alemanha":"de",
        "Áustria":"at",
        "Bélgica":"be",
        "Bósnia e Herzegovina":"ba",
        "Croácia":"hr",
        "Escócia":"gb-sct",
        "Espanha":"es",
        "França":"fr",
        "Holanda":"nl",
        "Inglaterra":"gb-eng",
        "Noruega":"no",
        "Portugal":"pt",
        "República Tcheca":"cz",
        "Suécia":"se",
        "Suíça":"ch",
        "Turquia":"tr",

        "África do Sul":"za",
        "Argélia":"dz",
        "Cabo Verde":"cv",
        "RD Congo":"cd",
        "Costa do Marfim":"ci",
        "Egito":"eg",
        "Gana":"gh",
        "Marrocos":"ma",
        "Senegal":"sn",
        "Tunísia":"tn",

        "Arábia Saudita":"sa",
        "Austrália":"au",
        "Coreia do Sul":"kr",
        "Iraque":"iq",
        "Irã":"ir",
        "Japão":"jp",
        "Jordânia":"jo",
        "Catar":"qa",
        "Uzbequistão":"uz",

        "Nova Zelândia":"nz"

    };

        //----------------------------------------------------------
    // Trigramas FIFA
    //----------------------------------------------------------

    Bolao.flags.data.TRIGRAMAS = {

        "Argentina":"ARG",
        "Brasil":"BRA",
        "Colômbia":"COL",
        "Equador":"ECU",
        "Paraguai":"PAR",
        "Uruguai":"URU",

        "Canadá":"CAN",
        "Curaçao":"CUW",
        "Estados Unidos":"USA",
        "Haiti":"HAI",
        "México":"MEX",
        "Panamá":"PAN",

        "Alemanha":"GER",
        "Áustria":"AUT",
        "Bélgica":"BEL",
        "Bósnia e Herzegovina":"BIH",
        "Croácia":"CRO",
        "Escócia":"SCO",
        "Espanha":"ESP",
        "França":"FRA",
        "Holanda":"NED",
        "Inglaterra":"ENG",
        "Noruega":"NOR",
        "Portugal":"POR",
        "República Tcheca":"CZE",
        "Suécia":"SWE",
        "Suíça":"SUI",
        "Turquia":"TUR",

        "África do Sul":"RSA",
        "Argélia":"ALG",
        "Cabo Verde":"CPV",
        "RD Congo":"COD",
        "Costa do Marfim":"CIV",
        "Egito":"EGY",
        "Gana":"GHA",
        "Marrocos":"MAR",
        "Senegal":"SEN",
        "Tunísia":"TUN",

        "Arábia Saudita":"KSA",
        "Austrália":"AUS",
        "Coreia do Sul":"KOR",
        "Iraque":"IRQ",
        "Irã":"IRN",
        "Japão":"JPN",
        "Jordânia":"JOR",
        "Catar":"QAT",
        "Uzbequistão":"UZB",

        "Nova Zelândia":"NZL"

    };

        //----------------------------------------------------------
    // Índice TRIGRAMA -> ISO
    //----------------------------------------------------------

    Bolao.flags.index.BANDEIRAS_TRIGRAMA = {};

    //----------------------------------------------------------
    // Índice ISO -> Nome
    //----------------------------------------------------------

    Bolao.flags.index.SELECOES_ISO = {};

    //----------------------------------------------------------
    // Índice TRIGRAMA -> Nome
    //----------------------------------------------------------

    Bolao.flags.index.TRIGRAMA_NOME = {};

    //----------------------------------------------------------
    // Construção automática
    //----------------------------------------------------------

    Object.keys(Bolao.flags.data.BANDEIRAS).forEach(nome => {

        const iso =
            Bolao.flags.data.BANDEIRAS[nome];

        const tri =
            Bolao.flags.data.TRIGRAMAS[nome];

        if (iso) {

            Bolao.flags.index.SELECOES_ISO[
                iso.toLowerCase()
            ] = nome;

        }

        if (tri) {

            Bolao.flags.index.TRIGRAMA_NOME[
                tri.toUpperCase()
            ] = nome;

        }

        if (iso && tri) {

            Bolao.flags.index.BANDEIRAS_TRIGRAMA[
                tri.toUpperCase()
            ] = iso;

        }

    });

        //----------------------------------------------------------
    // Inicialização
    //----------------------------------------------------------

    console.log(

        `✔ Flags carregadas (${Object.keys(
            Bolao.flags.data.BANDEIRAS
        ).length} seleções)`

    );

})();

    //==========================================================
    // MÉTODOS DE CONSULTA
    //==========================================================

    /**
     * Retorna o código ISO da seleção.
     *
     * Exemplo:
     * getISO("BRA") -> "br"
     */

    Bolao.flags.methods.getISO = function (trigrama) {

        if (!trigrama) return null;

        return Bolao.flags.index.BANDEIRAS_TRIGRAMA[
            String(trigrama).toUpperCase()
        ] || null;

    };


    /**
     * Retorna o trigrama FIFA de uma seleção.
     *
     * Exemplo:
     * getTrigrama("Brasil") -> BRA
     */

    Bolao.flags.methods.getTrigrama = function (nome) {

        if (!nome) return "";

        return Bolao.flags.data.TRIGRAMAS[
            String(nome).trim()
        ] || "";

    };


    /**
     * Retorna o nome da seleção
     * a partir do trigrama.
     */

    Bolao.flags.methods.getNome = function (trigrama) {

        if (!trigrama) return null;

        return Bolao.flags.index.TRIGRAMA_NOME[
            String(trigrama).toUpperCase()
        ] || null;

    };


    /**
     * Retorna a URL da bandeira.
     */

    Bolao.flags.methods.getBandeira = function (

        valor,

        largura = 80

    ) {

        const selecao =
            Bolao.flags.methods.getSelecao(valor);

        if (!selecao) return "";

        return `${Bolao.config.FLAG_CDN}/w${largura}/${selecao.iso}.png`;

    };


    /**
     * Verifica se uma seleção existe.
     */

    Bolao.flags.methods.existe = function (valor) {

        return (

            Bolao.flags.methods.getSelecao(valor)

            !== null

        );

    };


    /**
     * Lista todas as seleções.
     */

    Bolao.flags.methods.listar = function () {

        return Object.keys(

            Bolao.flags.data.BANDEIRAS

        ).sort();

    };


    /**
     * Retorna todas as informações de uma seleção.
     *
     * Pode receber:
     *
     * Nome
     * Trigrama
     * ISO
     */

    Bolao.flags.methods.getSelecao = function (valor) {

        if (!valor) return null;

        valor = String(valor).trim();

        let nome = null;

        //------------------------------------------------------
        // Nome
        //------------------------------------------------------

        if (

            Bolao.flags.data.BANDEIRAS[valor]

        ) {

            nome = valor;

        }

        //------------------------------------------------------
        // Trigrama
        //------------------------------------------------------

        if (!nome) {

            nome =

                Bolao.flags.index.TRIGRAMA_NOME[
                    valor.toUpperCase()
                ];

        }

        //------------------------------------------------------
        // ISO
        //------------------------------------------------------

        if (!nome) {

            nome =

                Bolao.flags.index.SELECOES_ISO[
                    valor.toLowerCase()
                ];

        }

        //------------------------------------------------------

        if (!nome) {

            return null;

        }

        const iso =

            Bolao.flags.data.BANDEIRAS[nome];

        const tri =

            Bolao.flags.data.TRIGRAMAS[nome];

        return {

            nome,

            iso,

            trigrama: tri,

            bandeira:

                `${Bolao.config.FLAG_CDN}/w80/${iso}.png`

        };

    };

    //==========================================================
    // MÉTODOS DE RENDERIZAÇÃO
    //==========================================================

    /**
     * Renderiza uma seleção.
     *
     * Pode receber:
     *
     * BRA
     * Brasil
     * br
     */

    Bolao.flags.methods.renderSelecao = function (

        valor,

        options = {}

    ) {

        const selecao =

            Bolao.flags.methods.getSelecao(valor);

        if (!selecao) {

            return "";

        }

        const largura =
            options.largura ?? 40;

        const mostrarNome =
            options.nome ?? false;

        const mostrarTrigrama =
            options.trigrama ?? true;

        const classe =
            options.classe ?? "";

        const style =
            options.style ?? "";

        return `

            <div class="flag-card ${classe}"
                 style="${style}">

                <img
                    src="${Bolao.config.FLAG_CDN}/w${largura}/${selecao.iso}.png"
                    alt="${selecao.nome}"
                    loading="lazy">

                ${
                    mostrarTrigrama

                    ? `<div class="flag-tri">

                            ${selecao.trigrama}

                       </div>`

                    : ""

                }

                ${
                    mostrarNome

                    ? `<div class="flag-name">

                            ${selecao.nome}

                       </div>`

                    : ""

                }

            </div>

        `;

    };



    //----------------------------------------------------------
    // Compatibilidade
    //----------------------------------------------------------

    /**
     * Mantida apenas para compatibilidade
     * com páginas antigas.
     */

    Bolao.flags.methods.timePorTrigrama = function (

        trigrama

    ) {

        return Bolao.flags.methods.renderSelecao(

            trigrama,

            {

                largura:40,

                trigrama:true,

                nome:false

            }

        );

    };



    //----------------------------------------------------------
    // Renderiza um confronto
    //----------------------------------------------------------

    Bolao.flags.methods.formatarJogo = function (

        texto,

        options = {}

    ) {

        if (!texto) {

            return "-";

        }

        const partes =

            texto
                .trim()
                .split(/\s+/);

        if (partes.length < 3) {

            return texto;

        }

        const casa = partes[0];

        const placar = partes[1];

        const fora = partes[2];

        const largura =
            options.largura ?? 40;

        return `

            <div class="match-card">

                ${

                    Bolao.flags.methods.renderSelecao(

                        casa,

                        {

                            largura,

                            nome:false,

                            trigrama:true

                        }

                    )

                }

                <div class="match-score">

                    ${placar.replace("x"," × ")}

                </div>

                ${

                    Bolao.flags.methods.renderSelecao(

                        fora,

                        {

                            largura,

                            nome:false,

                            trigrama:true

                        }

                    )

                }

            </div>

        `;

    };



    //----------------------------------------------------------
    // Renderiza apenas a bandeira
    //----------------------------------------------------------

    Bolao.flags.methods.renderBandeira = function (

        valor,

        largura = 40

    ) {

        const selecao =

            Bolao.flags.methods.getSelecao(valor);

        if (!selecao) {

            return "";

        }

        return `

            <img

                src="${Bolao.config.FLAG_CDN}/w${largura}/${selecao.iso}.png"

                alt="${selecao.nome}"

                loading="lazy"

            >

        `;

    };



    //----------------------------------------------------------
    // Renderiza apenas o trigrama
    //----------------------------------------------------------

    Bolao.flags.methods.renderTrigrama = function (

        valor

    ) {

        const selecao =

            Bolao.flags.methods.getSelecao(valor);

        if (!selecao) {

            return "";

        }

        return `

            <span class="flag-tri">

                ${selecao.trigrama}

            </span>

        `;

    };
    //==========================================================
    // UTILIDADES
    //==========================================================

    /**
     * Retorna verdadeiro se a seleção existir.
     */

    Bolao.flags.methods.isSelecao = function (valor) {

        return Bolao.flags.methods.existe(valor);

    };


    /**
     * Retorna todas as seleções cadastradas.
     */

    Bolao.flags.methods.getSelecoes = function () {

        return Bolao.flags.methods.listar();

    };


    /**
     * Quantidade de seleções cadastradas.
     */

    Bolao.flags.methods.count = function () {

        return Object.keys(

            Bolao.flags.data.BANDEIRAS

        ).length;

    };


    /**
     * Pesquisa seleções pelo nome.
     */

    Bolao.flags.methods.search = function (texto = "") {

        texto = texto
            .toLowerCase()
            .trim();

        return Object.keys(

            Bolao.flags.data.BANDEIRAS

        )

        .filter(nome =>

            nome
                .toLowerCase()
                .includes(texto)

        )

        .sort();

    };


    /**
     * Retorna uma cópia do cadastro.
     */

    Bolao.flags.methods.getData = function () {

        return structuredClone(

            Bolao.flags.data

        );

    };


 
