// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const URLS = {

    PALPITES:
        "https://script.google.com/macros/s/AKfycbw3S0FDdjMZbP0mnyQ4iMDHufuN6QTBtNXcWWpOmCkfqnPHQWiUv15Z0uxagpseoibe/exec?aba=Palpites",

    PALPITES_ELIM:
        "https://script.google.com/macros/s/AKfycbyr_jCKmx6ij0fytIqNjK4evsorDQtxdp4bcvnJ4RQMvU6TTK9zwJZZXjm__p3uyKI/exec?aba=Palpites_Elim",

    PROX_JOGOS:
        "https://script.google.com/macros/s/AKfycbyr_jCKmx6ij0fytIqNjK4evsorDQtxdp4bcvnJ4RQMvU6TTK9zwJZZXjm__p3uyKI/exec?aba=ProxJogos",

    RANKING:
        "https://script.google.com/macros/s/AKfycbztMaYq2BlP3RMu_3wplQ3E7aVbNTs00QnBK62D71Ft3MsQmfS_MUZK1g7RIBlSFEh8/exec"

};

// ============================================================================
// MAPAS
// ============================================================================
BANDEIRAS = {
  'Argentina':'ar',
  'Brasil':'br',
  'Colômbia':'co',
  'Equador':'ec',
  'Paraguai':'py',
  'Uruguai':'uy',
  'Canadá':'ca',
  'Curaçao':'cw',
  'Estados Unidos':'us',
  'Haiti':'ht',
  'México':'mx',
  'Panamá':'pa',
  'Alemanha':'de',
  'Áustria':'at',
  'Bélgica':'be',
  'Bósnia e Herzegovina':'ba',
  'Croácia':'hr',
  'Escócia':'gb-sct',
  'Espanha':'es',
  'França':'fr',
  'Holanda':'nl',
  'Inglaterra':'gb-eng',
  'Noruega':'no',
  'Portugal':'pt',
  'República Tcheca':'cz',
  'Suécia':'se',
  'Suíça':'ch',
  'Turquia':'tr',
  'África do Sul':'za',
  'Argélia':'dz',
  'Cabo Verde':'cv',
  'RD Congo':'cd',
  'Costa do Marfim':'ci',
  'Egito':'eg',
  'Gana':'gh',
  'Marrocos':'ma',
  'Senegal':'sn',
  'Tunísia':'tn',
  'Arábia Saudita':'sa',
  'Austrália':'au',
  'Coreia do Sul':'kr',
  'Iraque':'iq',
  'Irã':'ir',
  'Japão':'jp',
  'Jordânia':'jo',
  'Catar':'qa',
  'Uzbequistão':'uz',
  'Nova Zelândia':'nz',
};

const NOME_FASE = {

    Oitavas : "8as de Final",

    Quartas : "4as de Final",

    Semis : "Semis",

    Final : "Final",

    Campeao : "Campeão"

};

const PROXIMA_FASE = {
    Segundas : "Oitavas",
    Oitavas  : "Quartas",
    Quartas  : "Semis",
    Semis    : "Final",
    Final    : "Campeao"
};

const PONTOS_FASE = {

    Segundas:5,
    Oitavas:10,
    Quartas:15,
    Semis:20,
    Final:30

};

//    const destino = NOME_FASE[PROXIMA_FASE[jogo.rodada]];

// ============================================================================
// FETCH
// ============================================================================

async function fetchJSON(url){

    const response = await fetch(url);

    if(!response.ok){

        throw new Error(

            `HTTP ${response.status}`

        );

    }

    const json = await response.json();

    if(!Array.isArray(json.data)){

        throw new Error(

            "Formato inválido."

        );

    }

    return json.data;

}

// ============================================================================
// PARSER PALPITES (FASE DE GRUPOS)
// ============================================================================

function parsearPalpites(rows){

    if(!rows.length){

        return{

            participantes:[],

            jogos:[]

        };

    }

    const colunas = Object.keys(rows[0]);

    const participantes = colunas
        .filter(c=>c.endsWith("_pal1"))
        .map(c=>c.replace("_pal1",""));

    const valor = v =>

        (v==="" || v===null || v===undefined || v==="-" )

            ? null

            : v;

    const jogos = rows.map(row=>{

        const time1 = String(row.Time1 || "").trim();
        const time2 = String(row.Time2 || "").trim();

        if(!time1 && !time2)
            return null;

        return{

            chave:
                chaveJogo(time1,time2),

            data:
                String(row.Data || "").trim(),

            horario:
                String(row.Hora || "").trim(),

            time1,

            time2,

            gols1Real:
                valor(row.Real1),

            gols2Real:
                valor(row.Real2),

            palpites:

                participantes.map(nome=>({

                    nome,

                    gols1:
                        valor(row[`${nome}_pal1`]),

                    gols2:
                        valor(row[`${nome}_pal2`]),

                    pontos:
                        valor(row[`${nome}_pts`])

                }))

        };

    }).filter(Boolean);

    return{

        participantes,

        jogos

    };

}

// ============================================================================
// PARSER PALPITES ELIMINATÓRIOS
// ============================================================================

function parsearPalpitesElim(rows){

    if(!rows.length)
        return {};

    const colunas = Object.keys(rows[0]);

    const participantes = colunas.filter(h =>
    
        h &&
        h !== "Fase" &&
        h !== "Real"
    
    );

    const resultado = {};

    participantes.forEach(nome=>{

        resultado[nome]={};

    });

    rows.forEach(row=>{

        const fase =

            String(row.Fase || "").trim();

        if(!fase)
            return;

        participantes.forEach(nome=>{

            if(!resultado[nome][fase]){

                resultado[nome][fase] = new Set();

            }

            const selecao =

                String(row[nome] || "").trim();

            if(selecao){

                resultado[nome][fase]
                    .add(selecao);

            }

        });

    });

    return resultado;

}

// ============================================================================
// PARSER RANKING
// ============================================================================

function parsearRanking(rows){

    const ranking = new Map();

    rows.forEach(row=>{

        const nome = String(
            row.Aposta ??
            row.Nome ??
            ""
        ).trim();

        const posicao = Number(
            row.Pos ??
            row.Posicao ??
            row.Ranking
        );

        if(nome){

            ranking.set(

                normalizarNome(nome),

                Number.isNaN(posicao)

                    ? null

                    : posicao

            );

        }

    });

    return ranking;

}

// ============================================================================
// PARSER PRÓXIMOS JOGOS
// ============================================================================

function parsearProxJogos(rows){

    const valor = v =>

        v === "" ||
        v === null ||
        v === undefined ||
        v === "-"

            ? null

            : Number(v);

    return rows

        .map(row=>{

            const time1 = String(
                row.time1 || ""
            ).trim();

            const time2 = String(
                row.time2 || ""
            ).trim();

            if(!time1 || !time2){

                return null;

            }

            return{

                data:
                    String(row.data || "").trim(),

                horario:
                    String(row.horario || "").trim(),

                grupo:
                    String(row.grupo || "").trim(),

                rodada:
                    String(row.rodada || "").trim(),

                time1,

                time2,

                gols1:
                    valor(row.gols1),

                gols2:
                    valor(row.gols2),

                classificado:
                    String(
                        row.classificado || ""
                    ).trim(),

                chave:
                    chaveJogo(time1,time2)

            };

        })

        .filter(Boolean);

}


// ============================================================================
// HELPERS
// ============================================================================

function normalizarNome(nome) {

    return String(nome)
        .trim()
        .replace(/\s+/g, " ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

}

function chaveJogo(time1,time2){

    return `${time1}|${time2}`;

}

// ----------------------------------------------------------------------------

function ehEliminatoria(jogo){

    return jogo.grupo === "-" &&
           PROXIMA_FASE.hasOwnProperty(jogo.rodada);

}

// ----------------------------------------------------------------------------

function faseSeguinte(rodada){

    return PROXIMA_FASE[rodada] || null;

}

// ----------------------------------------------------------------------------

function pontosDaFase(rodada){

    return PONTOS_FASE[rodada] || 0;

}

// ----------------------------------------------------------------------------

function jogoRealizado(jogo){

    return jogo.gols1 !== null &&
           jogo.gols2 !== null;

}

// ----------------------------------------------------------------------------

function vencedorDoJogo(jogo){

    if(!jogoRealizado(jogo))
        return null;

    if(jogo.gols1 > jogo.gols2)
        return jogo.time1;

    if(jogo.gols2 > jogo.gols1)
        return jogo.time2;

    return jogo.classificado || null;

}

// ----------------------------------------------------------------------------

function statusSelecao(
    jogo,
    palpitesElim,
    participante,
    selecao
){

    const fase = faseSeguinte(jogo.rodada);

    if(!fase){

        return{

            estado:"fora",

            indicou:false,

            acertou:false

        };

    }

    const indicou =

        palpitesElim?.[participante]?.[fase]?.has(selecao) || false;

    if(!indicou){

        return{

            estado:"fora",

            indicou:false,

            acertou:false

        };

    }

    if(!jogoRealizado(jogo)){

        return{

            estado:"pendente",

            indicou:true,

            acertou:false

        };

    }

    const acertou =
        vencedorDoJogo(jogo) === selecao;

    return{

        estado:
            acertou ? "acertou" : "errou",

        indicou:true,

        acertou

    };

}

// ----------------------------------------------------------------------------

function simboloStatus(status){

    switch(status.estado){

        case "pendente":

            return "⏳";

        case "acertou":

            return "✅";

        default:

            return "❌";

    }

}

// ----------------------------------------------------------------------------

function ptsClasse(pts){

    pts = Number(pts) || 0;

    if(pts >= 12) return "pts12";
    if(pts >= 6)  return "pts6";
    if(pts >= 5)  return "pts5";
    if(pts >= 3)  return "pts3";
    if(pts >= 2)  return "pts2";

    return "";

}

// ----------------------------------------------------------------------------

function posClasse(pos){

    pos = Number(pos);

    if(pos === 1) return "ouro";
    if(pos === 2) return "prata";
    if(pos === 3) return "bronze";

    return "";

}

// ----------------------------------------------------------------------------

function flagUrl(selecao,tamanho=40){

    const codigo = BANDEIRAS[selecao];

    if(!codigo)
        return "";

    return `https://flagcdn.com/w${tamanho}/${codigo}.png`;

}

// ----------------------------------------------------------------------------

function flagImg(selecao,tamanho=40){

    const url = flagUrl(selecao,tamanho);

    if(!url){

        return "";

    }

    return `<img
                src="${url}"
                alt="${selecao}"
                loading="lazy"
                width="${tamanho}"
                height="${Math.round(tamanho*0.75)}">`;

}

// ============================================================================
// RENDER - CABEÇALHOS
// ============================================================================

function renderCabecalhoGrupo(){

    document.getElementById("tabela-confronto")
        .dataset.modo = "grupo";

    document.getElementById("tabela-head-row").innerHTML = `

        <th class="col-part">
            Participante
        </th>

        <th>
            Palpite
        </th>

        <th>
            Pontos
        </th>

    `;

}

// ----------------------------------------------------------------------------

function renderCabecalhoEliminatoria(jogo){

    document.getElementById("tabela-confronto")
        .dataset.modo = "eliminatoria";

    document.getElementById("tabela-head-row").innerHTML = `

        <th class="col-part">
            Participante
        </th>

        <th>
            ${flagImg(jogo.time1,28)}
            <br>
            ${jogo.time1}
        </th>

        <th>
            ${flagImg(jogo.time2,28)}
            <br>
            ${jogo.time2}
        </th>

        <th>
            Pontos
        </th>

    `;

}

function mostrarLegendaStatus(mostrar){

    document.getElementById("legenda-status")
        .hidden = !mostrar;

}

function flagUrl(pais, w = 40) {
  const cod = BANDEIRAS[pais];
  return cod ? `https://flagcdn.com/w${w}/${cod}.png` : null;
}


function flagImg(pais, w, h, r = 3) {
  const url = flagUrl(pais, 40);
  return url
    ? `<img src="${url}" style="width:${w}px;height:${h}px;border-radius:${r}px;object-fit:cover;" alt="${pais}">`
    : '';
}


// ============================================================================
// RENDER - CARD DO JOGO
// ============================================================================

function renderCardHTML(jogo){

    const realizado = jogoRealizado(jogo);

    const placar = realizado
        ? `${jogo.gols1} × ${jogo.gols2}`
        : "×";

    const badge = realizado
        ? "✅ Encerrado"
        : "🕒 A jogar";

    return `
    <div class="jogo-destaque-inner">
      <div class="jogo-dest-time">
        ${flagImg(jogo.time1, 56, 42, 6)}
        <span class="jogo-dest-nome">${jogo.time1}</span>
      </div>
      <div>
        <div class="jogo-dest-placar${realizado ? '' : ' pendente'}">
          ${realizado ? `${jogo.gols1} × ${jogo.gols2}` : '? × ?'}
        </div>
        <div class="jogo-dest-meta">
          ${jogo.grupo || jogo.rodada || ''} · ${jogo.data} · ${jogo.horario}
        </div>
      </div>
      <div class="jogo-dest-time">
        ${flagImg(jogo.time2, 56, 42, 6)}
        <span class="jogo-dest-nome">${jogo.time2}</span>
      </div>
    </div>

    `;

/*------------------------------
    <div class="jogo-card">

        <div class="jogo-card-header">

            <span class="jogo-fase">

                ${jogo.grupo === "-"
                    ? jogo.rodada
                    : "Grupo " + jogo.grupo}

            </span>

            <span class="jogo-status">

                ${badge}

            </span>

        </div>

        <div class="jogo-times">

            <div class="time">

                ${flagImg(jogo.time1)}

                <span>

                    ${jogo.time1}

                </span>

            </div>

            <div class="placar">

                ${placar}

            </div>

            <div class="time">

                ${flagImg(jogo.time2)}

                <span>

                    ${jogo.time2}

                </span>

            </div>

        </div>

        <div class="jogo-meta">

            📅 ${jogo.data}

            •

            🕒 ${jogo.horario}

        </div>

    </div>

    `;
*/
}
// ----------------------------------------------------------------------------

function renderCardJogo(jogo){

    document
        .getElementById("card-jogo-dest")
        .style.display = "block";

    document
        .getElementById("dest-titulo")
        .textContent =
        `${jogo.time1} × ${jogo.time2}`;

    document
        .getElementById("dest-badge")
        .textContent =
        ehEliminatoria(jogo)

            ? jogo.rodada

            : `Grupo ${jogo.grupo}`;

    document
        .getElementById("jogo-destaque")
        .innerHTML =
        renderCardHTML(jogo);

}


//-------------------------------------------------------------
function atualizarTituloTabela(jogo){

    const titulo = document.getElementById("header-label");
    
    console.log("atualizarTituloTabela invocada");
    if(!titulo) return;

    if(!ehEliminatoria(jogo)){

        titulo.textContent =
            "Palpites dos Participantes - Placar do jogo";

        return;

    }

    const destino = NOME_FASE[PROXIMA_FASE[jogo.rodada]];

    titulo.textContent =
        destino === "Campeão"
            ? "Palpites dos Participantes - Palpite para o Campeão"
            : `Palpites dos Participantes - Quem avança para ${destino}`;

}

// ============================================================================
// RENDER - LINHA (FASE DE GRUPOS)
// ============================================================================

function renderLinhaGrupo(
    palpite,
    rankingMap
){

    const participante =
        palpite.nome;

    const posicao =
        rankingMap.get(participante);

    const pontos = Number(palpite.pontos || 0);

    const gols1 =
        palpite.gols1 ?? "-";

    const gols2 =
        palpite.gols2 ?? "-";

    return `

    <tr>

        <td>

            <div class="part-info">

                <span class="rank-badge ${posClasse(posicao)}">

                    ${posicao || "-"}

                </span>

                <span class="part-nome">

                    ${participante}

                </span>

            </div>

        </td>

        <td class="palpite-col">

            ${gols1}

            <span class="placar-x">

                ×

            </span>

            ${gols2}

        </td>

        <td>

            <span class="pts-badge ${ptsClasse(pontos)}">

                ${pontos}

            </span>

        </td>

    </tr>

    `;

}

// ============================================================================
// RENDER - TABELA (FASE DE GRUPOS)
// ============================================================================

function renderTabelaGrupo(
    jogo,
    palpites,
    rankingMap
){
    
    renderCabecalhoGrupo();

    const chave = chaveJogo(
        jogo.time1,
        jogo.time2
    );


    const jogoPalpite =

        palpites.jogos.find(

            j => j.chave === chave

        );


    if(!jogoPalpite){

        document.getElementById("tabela-body").innerHTML =

            `<tr>
                <td colspan="3">
                    Palpites não encontrados.
                </td>
            </tr>`;

        return;

    }

    


    const linhas =

        [...jogoPalpite.palpites]

        .sort((a,b)=>{

            const pa =
                rankingMap.get(a.nome) || 999;

            const pb =
                rankingMap.get(b.nome) || 999;

            return pa-pb;

        })

        .map(p=>{

            return renderLinhaGrupo(

                p,

                rankingMap

            );

        })

        .join("");


    document.getElementById("tabela-body")
        .innerHTML = linhas;

    document.getElementById("badge-tabela")
        .textContent =
        `${jogoPalpite.palpites.length} participantes`;

    mostrarLegendaStatus(false);

}

// ============================================================================
// RENDER - LINHA (ELIMINATÓRIA)
// ============================================================================

function renderLinhaEliminatoria(
    participante,
    jogo,
    palpitesElim,
    rankingMap
){

    const posicao =
        rankingMap.get(normalizarNome(participante)) || "";

    const statusTime1 =
        statusSelecao(
            jogo,
            palpitesElim,
            participante,
            jogo.time1
        );

    const statusTime2 =
        statusSelecao(
            jogo,
            palpitesElim,
            participante,
            jogo.time2
        );

    const pontos =

        (statusTime1.acertou || statusTime2.acertou)

            ? pontosDaFase(jogo.rodada)

            : 0;

    return `

        <tr>

            <td>

                <div class="part-info">

                    <span class="rank-badge ${posClasse(posicao)}">

                        ${posicao || "-"}

                    </span>

                    <span class="part-nome">

                        ${participante}

                    </span>

                </div>

            </td>

            <td class="status-col">

                ${simboloStatus(statusTime1)}

            </td>

            <td class="status-col">

                ${simboloStatus(statusTime2)}

            </td>

            <td>

                <span class="pts-badge ${ptsClasse(pontos)}">

                    ${pontos}

                </span>

            </td>

        </tr>

    `;

}

// ============================================================================
// RENDER - TABELA (ELIMINATÓRIA)
// ============================================================================

function renderTabelaEliminatoria(
    jogo,
    palpitesElim,
    rankingMap
){

    renderCabecalhoEliminatoria(jogo);

    const participantes =

        Object.keys(palpitesElim)

        .sort((a,b)=>{

            const pa = rankingMap.get(normalizarNome(a));
            const pb = rankingMap.get(normalizarNome(b));

            // Participantes sem posição ficam no final
            if (pa == null && pb == null) return a.localeCompare(b);
            if (pa == null) return 1;
            if (pb == null) return -1;

            return pa-pb;

        });

    const linhas =

        participantes

            .map(participante=>

                renderLinhaEliminatoria(

                    participante,

                    jogo,

                    palpitesElim,

                    rankingMap

                )

            )

            .join("");

    document.getElementById("tabela-body").innerHTML =
        linhas;

    document.getElementById("badge-tabela").textContent =
        `${participantes.length} participantes`;

    mostrarLegendaStatus(true);

}

// ============================================================================
// RENDER - CONFRONTO
// ============================================================================

function renderConfronto(
    jogo,
    palpites,
    palpitesElim,
    rankingMap
){

//Log temporário
console.log("=================================");
console.log("Rodada:", jogo.rodada);
console.log("Grupo:", jogo.grupo);
console.log("É eliminatória?", ehEliminatoria(jogo));


    // Exibe o card do jogo
    renderCardJogo(jogo);
    
    //Atualiza título da tabela
    atualizarTituloTabela(jogo);

    // Escolhe o tipo de tabela
    const eliminatoria = ehEliminatoria(jogo);

    if(eliminatoria){

    //if(ehEliminatoria(jogo)){


    console.log(">>> Chamando renderTabelaEliminatoria");

        renderTabelaEliminatoria(
            jogo,
            palpitesElim,
            rankingMap
        );

    }else{

    console.log(">>> Chamando renderTabelaGrupo");

        renderTabelaGrupo(
            jogo,
            palpites,
            rankingMap
        );

    }

    // Exibe o card da tabela
    document.getElementById("tabela-card")
        .classList.add("visivel");

    document.getElementById("tabela-card")
        .scrollIntoView({

            behavior:"smooth",

            block:"start"

        }
    );

}

// ============================================================================
// RENDER - LISTA DE JOGOS
// ============================================================================

function renderJogos(
    jogos,
    palpites,
    palpitesElim,
    rankingMap
){

    const lista =
        document.getElementById("jogos-lista");

    lista.innerHTML = "";

    jogos.forEach((jogo,index)=>{

        const realizado =
            jogoRealizado(jogo);

        const botao =
            document.createElement("button");

        botao.className = "jogo-btn";

        const placarHtml = realizado
           ? `<span class="jogo-btn-placar">${jogo.gols1} × ${jogo.gols2}</span>`
           : '';

        botao.innerHTML = `
        <span class="jogo-tag">${jogo.grupo || jogo.rodada || '—'}</span>
        <div class="jogo-btn-times">
          <div class="jogo-btn-time">
            ${flagImg(jogo.time1, 28, 21)}
            <span class="jogo-btn-nome">${jogo.time1}</span>
          </div>
          <span class="jogo-btn-sep">×</span>
          <div class="jogo-btn-time">
            ${flagImg(jogo.time2, 28, 21)}
            <span class="jogo-btn-nome">${jogo.time2}</span>
          </div>
        </div>
        ${placarHtml}
        <div class="jogo-btn-meta">${jogo.data}<br>${jogo.horario}</div>
        `
       ;

    botao.onclick = () => {

            abrirJogo(

                index,

                jogos,

                palpites,

                palpitesElim,

                rankingMap

            );

        };

        lista.appendChild(botao);

    });

    document.getElementById("badge-jogos")
        .textContent =
        `${jogos.length} jogos`;

}

// ============================================================================
// ABRIR JOGO
// ============================================================================

function abrirJogo(
    indice,
    jogos,
    palpites,
    palpitesElim,
    rankingMap
){

    const botoes =
        document.querySelectorAll(".jogo-btn");

    botoes.forEach(btn=>{

        btn.classList.remove("ativo");

    });

    if(botoes[indice]){

        botoes[indice]
            .classList.add("ativo");

    }

    renderConfronto(

        jogos[indice],

        palpites,

        palpitesElim,

        rankingMap

    );

}

// ============================================================================
// INIT
// ============================================================================

async function init(){

    try{

        const [

            rawPalpites,

            rawElim,

            rawJogos,

            rawRanking

        ] = await Promise.all([

            fetchJSON(URLS.PALPITES),

            fetchJSON(URLS.PALPITES_ELIM),

            fetchJSON(URLS.PROX_JOGOS),

            fetchJSON(URLS.RANKING)

        ]);

        const palpites =
            parsearPalpites(rawPalpites);


        console.log("Palpites:", palpites);
        console.log("Participantes:", palpites.participantes.length);
        console.log("Jogos:", palpites.jogos.length);

        if (palpites.jogos.length) {
            console.log("Primeiro jogo:", palpites.jogos[0]);
        }

        const palpitesElim =
            parsearPalpitesElim(rawElim);

        const rankingMap =
            parsearRanking(rawRanking);

        const jogos =
            parsearProxJogos(rawJogos);

        renderJogos(

            jogos,

            palpites,

            palpitesElim,

            rankingMap

        );

        const params =
            new URLSearchParams(
                window.location.search
            );

        let indice =
            Number(params.get("jogo"));

        if(Number.isNaN(indice)){

            indice =
                jogos.findIndex(

                    j=>!jogoRealizado(j)

                );

            if(indice<0){

                indice=0;

            }

        }


        abrirJogo(

            indice,

            jogos,

            palpites,

            palpitesElim,

            rankingMap

        );

        document
            .getElementById("loading-state")
            .style.display="none";

        document
            .getElementById("conteudo")
            .style.display="block";

    }

    catch(erro){

        console.error(erro);

        document
            .getElementById("page-message")
            .hidden = false;

        document
            .getElementById("page-message")
            .textContent =

            "Erro ao carregar os dados.";

    }

}

document.addEventListener(

    "DOMContentLoaded",

    init

);
