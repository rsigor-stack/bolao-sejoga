/**
 * ==========================================================
 * Bolão Se Joga Copa do Mundo 2026
 * Camada de Dados
 * ==========================================================
 *
 * Esta camada conhece:
 *
 * • estrutura do banco
 * • nomes das abas
 * • relacionamentos
 *
 * Ela NÃO conhece HTML.
 * Ela NÃO conhece páginas.
 *
 * ==========================================================
 */

(function () {

    "use strict";

    if (!window.Bolao) {

        throw new Error(
            "core.js deve ser carregado antes de database.js."
        );

    }

    if (!Bolao.services?.googleSheets) {

        throw new Error(
            "googleSheets.js deve ser carregado antes de database.js."
        );

    }

    //----------------------------------------------------------
    // Namespace
    //----------------------------------------------------------

    Bolao.database = {};

    Bolao.database.cache = {};

    Bolao.database.methods = {};

      //----------------------------------------------------------
    // Abas do banco
    //----------------------------------------------------------

    Bolao.database.ABAS = {

        ONEPAGE: "OnePage",

        HISTORICO: "Historico",

        CONQUISTAS: "Conquistas",

        RANKING: "Ranking",

        PALPITES: "Palpites",

        ELIMINATORIAS: "Palpites_Elim"

    };

      //----------------------------------------------------------
    // Carrega uma aba
    //----------------------------------------------------------

    Bolao.database.methods.carregar =

    async function (

        aba

    ) {

        return await

        Bolao.services.googleSheets.getAba(

            aba

        );

    };

      //----------------------------------------------------------
    // Carrega várias abas
    //----------------------------------------------------------

    Bolao.database.methods.carregarAbas =

    async function (

        abas

    ) {

        return await

        Bolao.services.googleSheets.getAbas(

            abas

        );

    };

      //----------------------------------------------------------
    // Carrega todas as informações do Perfil
    //----------------------------------------------------------

    Bolao.database.methods.carregarPerfil =

    async function () {

        return await

        Bolao.database.methods.carregarAbas(

            [

                Bolao.database.ABAS.ONEPAGE,

                Bolao.database.ABAS.HISTORICO,

                Bolao.database.ABAS.CONQUISTAS

            ]

        );

    };

      //----------------------------------------------------------
    // Carrega dados dos palpites
    //----------------------------------------------------------

    Bolao.database.methods.carregarPalpites =

    async function () {

        return await

        Bolao.database.methods.carregarAbas(

            [

                Bolao.database.ABAS.PALPITES,

                Bolao.database.ABAS.ELIMINATORIAS

            ]

        );

    };

      //----------------------------------------------------------
    // API Pública
    //----------------------------------------------------------

    Bolao.database.carregar =

        Bolao.database.methods.carregar;

    Bolao.database.carregarAbas =

        Bolao.database.methods.carregarAbas;

    Bolao.database.carregarPerfil =

        Bolao.database.methods.carregarPerfil;

    Bolao.database.carregarPalpites =

        Bolao.database.methods.carregarPalpites;

      //----------------------------------------------------------
    // Inicialização
    //----------------------------------------------------------

    Bolao.database.init = function () {

        if (Bolao.config.DEBUG) {

            console.group("🗄️ Database");

            console.log(

                "Abas cadastradas:",

                Object.keys(Bolao.database.ABAS).length

            );

            console.groupEnd();

        }

    };

    Bolao.database.init();

})();



  

  

  
  

  
  
