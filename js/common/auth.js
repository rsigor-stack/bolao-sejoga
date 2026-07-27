/**
 * ==========================================================
 * Bolão Se Joga Copa do Mundo 2026
 * Módulo de Autenticação (PIN fixo por participante)
 * ==========================================================
 *
 * Dependências:
 * core.js
 * config.js
 * googleSheets.js (usa a mesma URL do Apps Script)
 *
 * ==========================================================
 */

(function () {

    "use strict";

    if (!window.Bolao) {
        throw new Error("core.js deve ser carregado antes de auth.js");
    }
    if (!Bolao.config) {
        throw new Error("config.js deve ser carregado antes de auth.js");
    }

    Bolao.auth = {};

    const STORAGE_KEY = "bolao_sessao";

    //----------------------------------------------------------
    // Sessão local (localStorage)
    //----------------------------------------------------------

    function lerSessao() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function salvarSessao(nome, token) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ nome, token, criadoEm: Date.now() })
        );
    }

    function limparSessao() {
        localStorage.removeItem(STORAGE_KEY);
    }

    //----------------------------------------------------------
    // API pública
    //----------------------------------------------------------

    /**
     * Retorna { nome, token } se houver sessão local, ou null.
     * Não garante que o token ainda é válido no servidor —
     * isso só é confirmado quando uma escrita é tentada.
     */
    Bolao.auth.getUsuario = function () {
        return lerSessao();
    };

    Bolao.auth.estaLogado = function () {
        return Bolao.auth.getUsuario() !== null;
    };

    /**
     * Faz login contra o Apps Script.
     * Retorna { sucesso, nome, token } ou { erro }.
     */
    Bolao.auth.login = async function (nome, pin) {
        try {
            const res = await fetch(Bolao.config.GOOGLE_SCRIPT, {
                method: "POST",
                headers: { "Content-Type": "text/plain" }, // evita preflight CORS
                body: JSON.stringify({ acao: "login", nome, pin })
            });

            const json = await res.json();

            if (json.erro) {
                return { erro: json.erro };
            }

            salvarSessao(json.nome, json.token);
            return { sucesso: true, nome: json.nome, token: json.token };

        } catch (erro) {
            return { erro: "Não foi possível conectar. Tente novamente." };
        }
    };

    Bolao.auth.logout = function () {
        limparSessao();
    };

    /**
     * Solicita cadastro (fica "Pendente" até aprovação manual na planilha).
     * Retorna { sucesso, mensagem } ou { erro }.
     * Não cria sessão — o usuário só loga depois de aprovado.
     */
    Bolao.auth.solicitarCadastro = async function (nome, pin) {
        try {
            const res = await fetch(Bolao.config.GOOGLE_SCRIPT, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({ acao: "solicitarCadastro", nome, pin })
            });

            const json = await res.json();

            if (json.erro) {
                return { erro: json.erro };
            }

            return { sucesso: true, mensagem: json.mensagem };

        } catch (erro) {
            return { erro: "Não foi possível conectar. Tente novamente." };
        }
    };

    /**
     * Anexa o token da sessão atual a um corpo de requisição.
     * Uso: fetch(URL, { body: JSON.stringify(Bolao.auth.comToken({ acao: 'salvarPalpite', ... })) })
     */
    Bolao.auth.comToken = function (body) {
        const sessao = lerSessao();
        return Object.assign({}, body, { token: sessao ? sessao.token : null });
    };

})();
