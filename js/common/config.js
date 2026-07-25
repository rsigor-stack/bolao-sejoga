/**
 * ==========================================================
 * Bolão Se Joga Copa do Mundo 2026
 * Configurações Globais
 * ==========================================================
 */

(function () {

    "use strict";

    // Garante que o Core foi carregado
    if (!window.Bolao) {

        throw new Error(
            "core.js deve ser carregado antes de config.js"
        );

    }

    Bolao.config = {

        //--------------------------------------------------
        // Aplicação
        //--------------------------------------------------

        APP_NAME: "Bolão Se Joga Copa do Mundo 2026",

        VERSION: "1.0.0",

        DEBUG: true,

        //--------------------------------------------------
        // Google Apps Script
        //--------------------------------------------------

        GOOGLE_SCRIPT:

            "https://script.google.com/macros/s/AKfycbyr_jCKmx6ij0fytIqNjK4evsorDQtxdp4bcvnJ4RQMvU6TTK9zwJZZXjm__p3uyKI/exec",

        //--------------------------------------------------
        // Recursos
        //--------------------------------------------------

        FLAG_CDN:

            "https://flagcdn.com",

        IMAGE_PATH:

            "../imagens/",

        //--------------------------------------------------
        // Comportamento
        //--------------------------------------------------

        FETCH_TIMEOUT: 15000,

        CACHE_ENABLED: true,

        DEFAULT_LANGUAGE: "pt-BR",

        DEFAULT_TIMEZONE: "America/Sao_Paulo"

    };

    if (Bolao.config.DEBUG) {

        console.log(
            "Configurações carregadas."
        );

    }

})();
