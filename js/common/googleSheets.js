/**
 * ==========================================================
 * Bolão Se Joga Copa do Mundo 2026
 * Serviço Google Sheets
 * ==========================================================
 *
 * Responsável por:
 *
 * • Comunicação com Google Apps Script
 * • Cache das abas
 * • Carregamento de uma ou várias abas
 * * Normalização do retorno
 * • Controle de atualização
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
            "core.js deve ser carregado antes de googleSheets.js."
        );

    }

    if (!Bolao.config) {

        throw new Error(
            "config.js deve ser carregado antes de googleSheets.js."
        );

    }

    if (!Bolao.services) {

        Bolao.services = {};

    }

    //----------------------------------------------------------
    // Namespace
    //----------------------------------------------------------

    Bolao.services.googleSheets = {};

    //----------------------------------------------------------
    // Configurações
    //----------------------------------------------------------

    Bolao.services.googleSheets.config = {

        timeout:

            Bolao.config.FETCH_TIMEOUT,

        usarCache:

            Bolao.config.CACHE_ENABLED,

        debug:

            Bolao.config.DEBUG

    };

//----------------------------------------------------------
// Modelo de cache de uma aba
//----------------------------------------------------------

function criarCacheAba() {

    return {

        dados: [],

        atualizado: null,

        url: null,

        origem: null,

        carregando: false,

        erro: null

    };

}

  
    //----------------------------------------------------------
    // Cache
    //----------------------------------------------------------

    Bolao.services.googleSheets.cache = {

        abas: {},

    };

    //----------------------------------------------------------
    // Estado
    //----------------------------------------------------------

    Bolao.services.googleSheets.state = {

        carregando: false,

        ultimaAtualizacao: null,

        ultimaURL: null,

        ultimaResposta: null

    };

    //----------------------------------------------------------
    // Métodos públicos
    //----------------------------------------------------------

    Bolao.services.googleSheets.methods = {};

      //----------------------------------------------------------
    // URLs cadastradas
    //----------------------------------------------------------

    Bolao.services.googleSheets.urls = {

        DEFAULT:

            Bolao.config.URLS?.DEFAULT ||

            Bolao.config.GOOGLE_SCRIPT ||

            ""

    };

      //----------------------------------------------------------
    // Estatísticas
    //----------------------------------------------------------

    Bolao.services.googleSheets.stats = {

        requests: 0,

        cacheHits: 0,

        cacheMiss: 0,

        erros: 0

    };

      //==========================================================
    // CARREGAMENTO
    //==========================================================

    /**
     * Carrega um Apps Script.
     *
     * Nunca utilizar diretamente nas páginas.
     */

    Bolao.services.googleSheets.methods.fetch = async function (

        url = Bolao.services.googleSheets.urls.DEFAULT

    ) {

        const service = Bolao.services.googleSheets;

        service.stats.requests++;

        service.state.carregando = true;

        service.state.ultimaURL = url;

        try {

            const controller = new AbortController();

            const timer = setTimeout(

                () => controller.abort(),

                service.config.timeout

            );

            const response = await fetch(

                url,

                {

                    signal: controller.signal,

                    cache: "no-store"

                }

            );

            clearTimeout(timer);

            if (!response.ok) {

                throw new Error(

                    `HTTP ${response.status}`

                );

            }

            const json = await response.json();

            service.state.ultimaResposta = json;

            service.state.ultimaAtualizacao = new Date();

            service.state.carregando = false;

            return json;

        }

        catch (erro) {

            service.stats.erros++;

            service.state.carregando = false;

            throw erro;

        }

    };

      //----------------------------------------------------------
    // Carrega uma aba
    //----------------------------------------------------------

    Bolao.services.googleSheets.methods.load = async function (

        aba,

        options = {}

    ) {

        const service =

            Bolao.services.googleSheets;

        const usarCache =

            options.cache ??

            service.config.usarCache;

        //------------------------------------------------------

        if (

            usarCache &&

            service.cache.abas[aba]

        ) {

            const cache =

                service.cache.abas[aba];

            const expirado =

                cache.atualizado

                &&

                (

                    Date.now()

                    -

                    cache.atualizado.getTime()

                )

                >

                cache.ttl;

            if (

                !expirado

            ) {

                service.stats.cacheHits++;

                return cache.dados;

            }

        }

        service.stats.cacheMiss++;

        //------------------------------------------------------

        const url =

            options.url ||

            service.urls.DEFAULT;

        const json =

            await service.methods.fetch(url);

        //------------------------------------------------------

        let dados = [];

        if (

            json[aba]

        ) {

            dados = json[aba];

        }

        else if (

            json.data

        ) {

            dados = json.data;

        }

        else {

            throw new Error(

                `A aba '${aba}' não existe.`

            );

        }

        //------------------------------------------------------

        const cache = criarCacheAba();

        cache.dados = dados;

        cache.url = url;

        cache.origem = "network";

        cache.atualizado = new Date();

        cache.ttl =

            options.ttl ??

            300000;

        service.cache.abas[aba] = cache;

        return dados;

    };

      //----------------------------------------------------------
    // API pública
    //----------------------------------------------------------

    Bolao.services.googleSheets.methods.getAba =

    async function (

        aba,

        options = {}

    ) {

        return

        await

        Bolao.services.googleSheets

        .methods

        .load(

            aba,

            options

        );

    };

      //----------------------------------------------------------
    // Carrega várias abas
    //----------------------------------------------------------

    Bolao.services.googleSheets.methods.getAbas =

    async function (

        abas,

        options = {}

    ) {

        const resultado = {};

        for (

            const aba

            of

            abas

        ) {

            resultado[aba] =

                await

                Bolao.services

                .googleSheets

                .methods

                .getAba(

                    aba,

                    options

                );

        }

        return resultado;

    };

      //==========================================================
    // CACHE
    //==========================================================

    /**
     * Obtém o cache de uma aba.
     */

    Bolao.services.googleSheets.methods.getCache = function (aba) {

        return Bolao.services.googleSheets.cache.abas[aba] || null;

    };


    /**
     * Verifica se o cache está expirado.
     */

    Bolao.services.googleSheets.methods.cacheExpirado = function (cache) {

        if (!cache) return true;

        if (!cache.atualizado) return true;

        if (!cache.ttl) return true;

        return (

            Date.now()

            -

            cache.atualizado.getTime()

        )

        >

        cache.ttl;

    };


    /**
     * Salva uma aba no cache.
     */

    Bolao.services.googleSheets.methods.saveCache = function (

        aba,

        dados,

        options = {}

    ) {

        const cache = criarCacheAba();

        cache.dados = dados;

        cache.url =

            options.url ||

            null;

        cache.origem =

            options.origem ||

            "network";

        cache.atualizado =

            new Date();

        cache.ttl =

            options.ttl ||

            300000;

        Bolao.services.googleSheets

            .cache

            .abas[aba] = cache;

        return cache;

    };


    /**
     * Remove uma aba do cache.
     */

    Bolao.services.googleSheets.methods.invalidate = function (

        aba

    ) {

        delete

        Bolao.services.googleSheets

            .cache

            .abas[aba];

    };


    /**
     * Limpa todo o cache.
     */

    Bolao.services.googleSheets.methods.clearCache = function () {

        Bolao.services.googleSheets

            .cache

            .abas = {};

    };

      //==========================================================
    // NORMALIZAÇÃO
    //==========================================================

    Bolao.services.googleSheets.methods.parse = function (

        json,

        aba

    ) {

        if (!json) {

            return [];

        }

        if (

            json[aba]

        ) {

            return json[aba];

        }

        if (

            json.data

        ) {

            return json.data;

        }

        if (

            Array.isArray(json)

        ) {

            return json;

        }

        return [];

    };

  const dados =

service.methods.parse(

    json,

    aba

);

      //==========================================================
    // REFRESH
    //==========================================================

    Bolao.services.googleSheets.methods.refresh =

    async function (

        aba,

        options = {}

    ) {

        Bolao.services.googleSheets

            .methods

            .invalidate(

                aba

            );

        return await

        Bolao.services.googleSheets

            .methods

            .load(

                aba,

                options

            );

    };

      //----------------------------------------------------------
    // Data da última atualização
    //----------------------------------------------------------

    Bolao.services.googleSheets.methods.getLastUpdate =

    function (

        aba

    ) {

        const cache =

            Bolao.services.googleSheets

            .methods

            .getCache(

                aba

            );

        if (

            !cache

        ) {

            return null;

        }

        return cache.atualizado;

    };

      //==========================================================
    // REQUISIÇÕES PENDENTES
    //==========================================================

    /**
     * Promises de carregamentos em andamento.
     * Evita múltiplos fetches simultâneos da mesma aba.
     */

    Bolao.services.googleSheets.pending = {};

    //----------------------------------------------------------
    // Wrapper para carregamento inteligente
    //----------------------------------------------------------

    Bolao.services.googleSheets.methods.loadSafe = async function (

        aba,

        options = {}

    ) {

        const service = Bolao.services.googleSheets;

        //------------------------------------------------------
        // Já existe uma requisição em andamento?
        //------------------------------------------------------

        if (service.pending[aba]) {

            if (service.config.debug) {

                console.log(

                    `[GoogleSheets] Reutilizando requisição da aba "${aba}".`

                );

            }

            return await service.pending[aba];

        }

        //------------------------------------------------------
        // Cria a Promise
        //------------------------------------------------------

        service.pending[aba] =

            service.methods.load(

                aba,

                options

            );

        try {

            const dados =

                await service.pending[aba];

            return dados;

        }

        finally {

            delete service.pending[aba];

        }

    };

      //==========================================================
    // API PÚBLICA
    //==========================================================

    Bolao.services.googleSheets.getAba =

        Bolao.services.googleSheets.methods.loadSafe;

    Bolao.services.googleSheets.getAbas =

        Bolao.services.googleSheets.methods.getAbas;

    Bolao.services.googleSheets.refresh =

        Bolao.services.googleSheets.methods.refresh;

    Bolao.services.googleSheets.clearCache =

        Bolao.services.googleSheets.methods.clearCache;

    Bolao.services.googleSheets.invalidate =

        Bolao.services.googleSheets.methods.invalidate;

    Bolao.services.googleSheets.getCache =

        Bolao.services.googleSheets.methods.getCache;

    Bolao.services.googleSheets.getLastUpdate =

        Bolao.services.googleSheets.methods.getLastUpdate;

      //==========================================================
    // INICIALIZAÇÃO
    //==========================================================

    Bolao.services.googleSheets.init = function () {

        if (!Bolao.config.DEBUG) {

            return;

        }

        console.group(

            "📄 Google Sheets"

        );

        console.log(

            "URL padrão:",

            Bolao.services.googleSheets.urls.DEFAULT

        );

        console.log(

            "Cache:",

            Bolao.services.googleSheets.config.usarCache

        );

        console.log(

            "Timeout:",

            Bolao.services.googleSheets.config.timeout,

            "ms"

        );

        console.groupEnd();

    };

      //----------------------------------------------------------
    // Inicialização
    //----------------------------------------------------------

    Bolao.services.googleSheets.init();

})();


  
  
  
  
  
  
  
