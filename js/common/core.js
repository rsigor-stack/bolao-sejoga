/**
 * ==========================================================
 *  BOLÃO SE JOGA COPA DO MUNDO 2026
 *  Core da aplicação
 * ==========================================================
 *
 * Este arquivo deve ser SEMPRE o primeiro JavaScript
 * carregado pela aplicação.
 *
 * Nenhum outro arquivo deve criar o objeto Bolao.
 * Todos os módulos utilizam este objeto.
 *
 * ==========================================================
 */

(function (window) {

    "use strict";

    // Evita recriação caso o arquivo seja carregado novamente
    if (window.Bolao) {
        console.warn("Bolao Core já inicializado.");
        return;
    }

    window.Bolao = {

        //------------------------------------------------------
        // Informações da aplicação
        //------------------------------------------------------

        app: {

            nome: "Bolão Se Joga Copa do Mundo 2026",

            versao: "1.0.0",

            ambiente: "production"

        },

        //------------------------------------------------------
        // Configurações
        //------------------------------------------------------

        config: {},

        //------------------------------------------------------
        // Cache
        //------------------------------------------------------

        cache: {

            abas: {},

            participantes: {}

        },

        //------------------------------------------------------
        // Banco de dados carregado
        //------------------------------------------------------

        dados: {

            onePage: [],

            historico: [],

            conquistas: [],

            ranking: [],

            palpites: [],

            eliminatorias: []

        },

        //------------------------------------------------------
        // Índices para acesso rápido
        //------------------------------------------------------

        indice: {

            participantes: {},

            historico: {},

            conquistas: {}

        },

        //------------------------------------------------------
        // Objetos reutilizáveis
        //------------------------------------------------------

        flags: {},

        utils: {},

        //------------------------------------------------------
        // Sistema de Eventos
        //------------------------------------------------------

        events: {

            listeners: {}

        },

        googleSheets: {},

        charts: {},

        //------------------------------------------------------
        // Módulos das páginas
        //------------------------------------------------------

        perfil: {},

        ranking: {},

        palpites: {},

        estatisticas: {},

        confronto: {},

        contador: {},

        //------------------------------------------------------
        // Estado da aplicação
        //------------------------------------------------------

        state: {

            participanteSelecionado: null,

            abaAtual: "grupo"

        }

    };





//------------------------------------------------------
// Event Bus
//------------------------------------------------------

Bolao.events = {

    on(evento, callback) {

        if (!Bolao.events.listeners[evento]) {

            Bolao.events.listeners[evento] = [];

        }

        Bolao.events.listeners[evento].push(callback);

    },

    off(evento, callback) {

        if (!Bolao.events.listeners[evento]) {

            return;

        }

        Bolao.events.listeners[evento] =

            Bolao.events.listeners[evento]

                .filter(cb => cb !== callback);

    },

    emit(evento, payload) {

        if (!Bolao.events.listeners[evento]) {

            return;

        }

        Bolao.events.listeners[evento]

            .forEach(callback => callback(payload));

    }

};

Bolao.events.listeners = {};



    

    
    console.log(
        `%c${Bolao.app.nome} v${Bolao.app.versao}`,
        "color:#00d4ff;font-weight:bold;"
    );


})(window);
