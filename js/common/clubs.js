/**
 * ==========================================================
 * Bolão Libertadores 2026
 * Módulo de Clubes (Escudos)
 * ==========================================================
 *
 * Espelha a estrutura de js/common/flags.js, mas para os
 * clubes da Libertadores em vez de seleções nacionais.
 *
 * Diferença principal: bandeiras vêm de um CDN externo
 * (flagcdn.com); escudos vêm de arquivos já hospedados no
 * próprio repositório, em /imagens/Escudos-Times/.
 *
 * Dependências:
 * core.js
 * config.js
 *
 * ==========================================================
 */

(function () {

    "use strict";

    if (!window.Bolao) {
        throw new Error("core.js deve ser carregado antes de clubs.js");
    }
    if (!Bolao.config) {
        throw new Error("config.js deve ser carregado antes de clubs.js");
    }

    Bolao.clubs = {};
    Bolao.clubs.data = {};

    //----------------------------------------------------------
    // Caminho absoluto da pasta de escudos (evita o bug de
    // caminho relativo que existia no header.html)
    //----------------------------------------------------------

    const PASTA_ESCUDOS = "/imagens/Escudos-Times/";

    //----------------------------------------------------------
    // Cadastro: trigrama -> nome, país, arquivo
    //----------------------------------------------------------
    // "arquivo" é o nome exato do PNG como está no GitHub
    // (mantido com acentos/espaços; a URL é montada com
    // encodeURIComponent, então não precisa renomear nada).

    Bolao.clubs.data.CLUBES = {

        "CER": { nome: "Cerro Porteño",            pais: "Paraguai",  arquivo: "Cerro Porteño.png" },
        "COQ": { nome: "Coquimbo Unido",           pais: "Chile",     arquivo: "Coquimbo Unido.png" },
        "COR": { nome: "Corinthians",              pais: "Brasil",    arquivo: "Corinthians.png" },
        "FLA": { nome: "Flamengo",                 pais: "Brasil",    arquivo: "Flamengo.png" },
        "IDV": { nome: "Independiente del Valle",  pais: "Equador",   arquivo: "Independiente del Valle.png" },
        "INR": { nome: "Independiente Rivadavia",  pais: "Argentina", arquivo: "Independiente Rivadavia.png" },
        "LDU": { nome: "LDU Quito",                pais: "Equador",   arquivo: "LDU.png", aliases: ["LDU"] },
        "UCA": { nome: "Universidad Católica",     pais: "Chile",     arquivo: "Universidad Católica.png" },

        "CRU": { nome: "Cruzeiro",                 pais: "Brasil",    arquivo: "Cruzeiro.png" },
        "EST": { nome: "Estudiantes de La Plata",  pais: "Argentina", arquivo: "Estudiantes de La Plata.png", aliases: ["Estudiantes"] },
        "FLU": { nome: "Fluminense",               pais: "Brasil",    arquivo: "Fluminense.png" },
        "MIR": { nome: "Mirassol",                 pais: "Brasil",    arquivo: "Mirassol.png" },
        "PAL": { nome: "Palmeiras",                pais: "Brasil",    arquivo: "Palmeiras.png" },
        "PLA": { nome: "Platense",                 pais: "Argentina", arquivo: "Platense.png" },
        "ROS": { nome: "Rosario Central",          pais: "Argentina", arquivo: "Rosario Central.png" },
        "TOL": { nome: "Deportes Tolima",          pais: "Colômbia",  arquivo: "Tolima.png", aliases: ["Tolima"] }

    };

    //----------------------------------------------------------
    // Índices (nome -> trigrama, busca case-insensitive)
    //----------------------------------------------------------

    Bolao.clubs.index = {};
    Bolao.clubs.index.NOME_TRIGRAMA = {};

    Object.keys(Bolao.clubs.data.CLUBES).forEach(tri => {
        const info = Bolao.clubs.data.CLUBES[tri];
        Bolao.clubs.index.NOME_TRIGRAMA[info.nome.toLowerCase()] = tri;

        (info.aliases || []).forEach(alias => {
            Bolao.clubs.index.NOME_TRIGRAMA[alias.toLowerCase()] = tri;
        });
    });

    console.log(`✔ Clubes carregados (${Object.keys(Bolao.clubs.data.CLUBES).length} escudos)`);

    //==========================================================
    // MÉTODOS DE CONSULTA
    //==========================================================

    Bolao.clubs.methods = {};

    /**
     * Retorna { trigrama, nome, pais, escudo } a partir de:
     * trigrama ("COR"), ou nome ("Corinthians")
     */
    Bolao.clubs.methods.getClube = function (valor) {
        if (!valor) return null;

        valor = String(valor).trim();
        let tri = null;

        if (Bolao.clubs.data.CLUBES[valor.toUpperCase()]) {
            tri = valor.toUpperCase();
        } else if (Bolao.clubs.index.NOME_TRIGRAMA[valor.toLowerCase()]) {
            tri = Bolao.clubs.index.NOME_TRIGRAMA[valor.toLowerCase()];
        }

        if (!tri) return null;

        const info = Bolao.clubs.data.CLUBES[tri];

        return {
            trigrama: tri,
            nome: info.nome,
            pais: info.pais,
            escudo: PASTA_ESCUDOS + encodeURIComponent(info.arquivo)
        };
    };

    /**
     * Retorna só a URL do escudo.
     * Uso: Bolao.clubs.methods.getEscudo("COR") ou "Corinthians"
     */
    Bolao.clubs.methods.getEscudo = function (valor) {
        const clube = Bolao.clubs.methods.getClube(valor);
        return clube ? clube.escudo : "";
    };

    Bolao.clubs.methods.getTrigrama = function (nome) {
        const clube = Bolao.clubs.methods.getClube(nome);
        return clube ? clube.trigrama : "";
    };

    Bolao.clubs.methods.existe = function (valor) {
        return Bolao.clubs.methods.getClube(valor) !== null;
    };

    Bolao.clubs.methods.listar = function () {
        return Object.values(Bolao.clubs.data.CLUBES)
            .map(c => c.nome)
            .sort();
    };

    //==========================================================
    // MÉTODOS DE RENDERIZAÇÃO (mesmo padrão do flags.js)
    //==========================================================

    /**
     * Renderiza um card com escudo + trigrama/nome opcionais.
     * Uso: Bolao.clubs.methods.renderClube("COR", { nome: true })
     */
    Bolao.clubs.methods.renderClube = function (valor, options = {}) {
        const clube = Bolao.clubs.methods.getClube(valor);
        if (!clube) return "";

        const largura = options.largura ?? 40;
        const mostrarNome = options.nome ?? false;
        const mostrarTrigrama = options.trigrama ?? true;
        const classe = options.classe ?? "";
        const style = options.style ?? "";

        return `
            <div class="club-card ${classe}" style="${style}">
                <img
                    src="${clube.escudo}"
                    alt="${clube.nome}"
                    loading="lazy"
                    style="width:${largura}px;height:${largura}px;object-fit:contain;">
                ${mostrarTrigrama ? `<div class="club-tri">${clube.trigrama}</div>` : ""}
                ${mostrarNome ? `<div class="club-name">${clube.nome}</div>` : ""}
            </div>
        `;
    };

    Bolao.clubs.methods.renderEscudo = function (valor, largura = 40) {
        const clube = Bolao.clubs.methods.getClube(valor);
        if (!clube) return "";

        return `
            <img
                src="${clube.escudo}"
                alt="${clube.nome}"
                loading="lazy"
                style="width:${largura}px;height:${largura}px;object-fit:contain;">
        `;
    };

    /**
     * Renderiza um confronto entre dois clubes.
     * texto no formato: "COR 2 x 1 FLA"
     */
    Bolao.clubs.methods.formatarConfronto = function (texto, options = {}) {
        if (!texto) return "-";

        const partes = texto.trim().split(/\s+/);
        if (partes.length < 3) return texto;

        const casa = partes[0];
        const placar = partes[1];
        const fora = partes[2];
        const largura = options.largura ?? 40;

        return `
            <div class="match-card">
                ${Bolao.clubs.methods.renderClube(casa, { largura, nome: false, trigrama: true })}
                <div class="match-score">${placar.replace("x", " × ")}</div>
                ${Bolao.clubs.methods.renderClube(fora, { largura, nome: false, trigrama: true })}
            </div>
        `;
    };

})();
