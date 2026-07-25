/**
 * ==========================================================
 * Bolão Se Joga Copa do Mundo 2026
 * Perfil - Controlador Principal
 * ==========================================================
 *
 * Responsabilidades:
 *
 * ✓ Inicializar a página
 * ✓ Carregar banco de dados
 * ✓ Inicializar pesquisa
 * ✓ Controlar participante selecionado
 * ✓ Distribuir informações para os módulos
 *
 * NÃO renderiza HTML.
 *
 * ==========================================================
 */

(function () {

    "use strict";

    //----------------------------------------------------------
    // Verificações
    //----------------------------------------------------------

    if (!window.Bolao) {

        throw new Error("core.js não carregado.");

    }

    if (!Bolao.database) {

        throw new Error("database.js não carregado.");

    }

    //----------------------------------------------------------
    // Namespace
    //----------------------------------------------------------

    Bolao.perfil = Bolao.perfil || {};

    //----------------------------------------------------------
    // Estado
    //----------------------------------------------------------

    Bolao.perfil.state = {

        participante: null,

        dados: null,

        carregado: false

    };

    //----------------------------------------------------------
    // Referências DOM
    //----------------------------------------------------------

    Bolao.perfil.dom = {};

    //----------------------------------------------------------
    // Localiza elementos da página
    //----------------------------------------------------------

    Bolao.perfil.cacheDOM = function () {

        Bolao.perfil.dom = {

            busca:

                document.getElementById("busca-input"),

            lista:

                document.getElementById("lista-scroll"),

            hero:

                document.getElementById("perfil-hero"),

            grupoIndicadores:

                document.getElementById("grupo-indicadores"),

            grupoConquistas:

                document.getElementById("grupo-conquistas"),

            grupoGraficos:

                document.getElementById("grupo-graficos"),

            eliminatorias:

                document.getElementById("perfil-eliminatorias"),

            geral:

                document.getElementById("perfil-geral")

        };

    };

    //----------------------------------------------------------
    // Carrega banco de dados
    //----------------------------------------------------------

    Bolao.perfil.carregarBanco = async function () {

        if (Bolao.config.DEBUG) {

            console.log("Carregando banco...");

        }

        Bolao.perfil.state.dados =

            await Bolao.database.carregarPerfil();

        Bolao.perfil.state.carregado = true;

    };

    //----------------------------------------------------------
    // Inicializa pesquisa
    //----------------------------------------------------------

    Bolao.perfil.inicializarPesquisa = function () {

        if (

            !Bolao.perfil.state.dados

        ) {

            return;

        }

        const onePage =

            Bolao.perfil.state.dados.OnePage || [];

        const participantes =

            onePage

                .map(x => x.Participante)

                .filter(Boolean)

                .sort();

        if (

            Bolao.perfil.components

            &&

            Bolao.perfil.components.seletor

        ) {

            Bolao.perfil.components.seletor(

                participantes,

                Bolao.perfil.selecionarParticipante

            );

        }

    };

    //----------------------------------------------------------
    // Seleciona participante
    //----------------------------------------------------------

    Bolao.perfil.selecionarParticipante = async function (

        nome

    ) {

        if (!nome) return;

        Bolao.perfil.state.participante = nome;

        if (Bolao.config.DEBUG) {

            console.group("Perfil");

            console.log("Participante:", nome);

            console.groupEnd();

        }


//------------------------------------------------------
// Dispara evento global
//------------------------------------------------------

const perfil =

    Bolao.viewModels.perfil.get(

        nome,

        Bolao.perfil.state.dados

    );

Bolao.events.emit(

    Bolao.EVENTS.PERFIL_CHANGED,

    perfil

);
console.log(perfil);
    //----------------------------------------------------------
    // Inicialização
    //----------------------------------------------------------

    Bolao.perfil.init = async function () {

        try {

            Bolao.perfil.cacheDOM();

            await Bolao.perfil.carregarBanco();

            Bolao.perfil.inicializarPesquisa();

            if (Bolao.config.DEBUG) {

                console.log(

                    "Perfil inicializado."

                );

            }

        }

        catch (erro) {

            console.error(erro);

        }

    };

    //----------------------------------------------------------
    // Inicialização automática
    //----------------------------------------------------------

    document.addEventListener(

        "DOMContentLoaded",

        Bolao.perfil.init

    );

})();
