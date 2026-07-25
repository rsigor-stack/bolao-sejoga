/**
 * perfil-busca.js
 * Filtra a lista de participantes no perfil, replicando exatamente
 * o comportamento do Palpites_OK.html (renderSeletor).
 *
 * Requer que window.PARTICIPANTES_PERFIL seja preenchido pelos scripts
 * de inicialização (perfil-core.js / perfil-init.js) antes de chamar
 * initBuscaPerfil(), OU que os scripts chamem initBuscaPerfil(participantes)
 * passando o array diretamente.
 *
 * Cada item do array deve ter pelo menos { nome: "..." }.
 */

(function () {
  'use strict';

  // ─── referências DOM ───────────────────────────────────────────
  let input, clearBtn, lista, scroll, chip, chipNome, chipTrocar;

  // array com todos os participantes { nome, ... }
  let todosParticipantes = [];

  // callback chamado quando o usuário seleciona um nome
  // (substitui o que renderTabela / renderEliminatorias fazem no Palpites_OK)
  let onSelecionar = null;

  // ─── normaliza string para comparação ──────────────────────────
  function norm(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  // ─── renderiza itens filtrados (igual ao Palpites_OK) ──────────
  function renderLista(filtro) {
    const termo = norm(filtro);
    const filtrados = todosParticipantes.filter(p =>
      !termo || norm(p.nome).includes(termo)
    );

    if (!filtrados.length) {
      scroll.innerHTML = `<div class="lista-vazia">Nenhum participante encontrado</div>`;
    } else {
      scroll.innerHTML = filtrados.map((p) => {
        const pos = todosParticipantes.indexOf(p) + 1;
        return `
          <div class="lista-item" data-nome="${p.nome}" tabindex="0">
            <span class="pos-badge">${pos}</span>
            <span class="item-nome">${p.nome}</span>
            <span class="item-seta">›</span>
          </div>`;
      }).join('');

      // eventos dos itens
      scroll.querySelectorAll('.lista-item').forEach(item => {
        item.addEventListener('click', () => selecionar(item.dataset.nome));
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter') selecionar(item.dataset.nome);
        });
      });
    }
  }

  // ─── seleciona participante ─────────────────────────────────────
  function selecionar(nome) {
    chipNome.textContent = nome;
    chip.classList.add('visivel');

    lista.classList.remove('visivel');
    input.value = '';
    clearBtn.classList.remove('visivel');
    input.blur();

    if (typeof onSelecionar === 'function') {
      onSelecionar(nome);
    }

    // compatibilidade: dispara evento customizado que perfil-init.js
    // pode escutar para renderizar o perfil
    document.dispatchEvent(
      new CustomEvent('perfilParticipanteSelecionado', { detail: { nome } })
    );
  }

  // ─── configura todos os event listeners ────────────────────────
  function configurarEventos() {
    // abre a lista ao focar
    input.addEventListener('focus', () => {
      renderLista(input.value);
      lista.classList.add('visivel');
    });

    // filtra conforme digita
    input.addEventListener('input', () => {
      clearBtn.classList.toggle('visivel', input.value.length > 0);
      renderLista(input.value);
      lista.classList.add('visivel');
    });

    // botão ✕ limpa o campo
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.remove('visivel');
      renderLista('');
      input.focus();
    });

    // chip "trocar participante"
    chipTrocar.addEventListener('click', () => {
      chip.classList.remove('visivel');
      input.value = '';
      clearBtn.classList.remove('visivel');
      renderLista('');
      lista.classList.add('visivel');
      input.focus();
    });

    // fecha ao clicar fora
    document.addEventListener('click', e => {
      if (
        !e.target.closest('.busca-wrap') &&
        !e.target.closest('.lista-participantes')
      ) {
        lista.classList.remove('visivel');
      }
    });

    // navegação por teclado ↑ ↓ Esc
    input.addEventListener('keydown', e => {
      const itens = scroll.querySelectorAll('.lista-item');
      const ativo = scroll.querySelector('.lista-item:focus');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        (ativo ? ativo.nextElementSibling : itens[0])?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        (ativo ? ativo.previousElementSibling : itens[itens.length - 1])?.focus();
      } else if (e.key === 'Escape') {
        lista.classList.remove('visivel');
        input.blur();
      }
    });
  }

  // ─── API pública ────────────────────────────────────────────────

  /**
   * Inicializa o seletor com busca.
   *
   * @param {Array}    participantes  Array de objetos { nome: "..." }
   * @param {Function} [callback]     Função chamada com o nome ao selecionar
   */
  window.initBuscaPerfil = function (participantes, callback) {
    input      = document.getElementById('busca-input');
    clearBtn   = document.getElementById('busca-clear');
    lista      = document.getElementById('lista-participantes');
    scroll     = document.getElementById('lista-scroll');
    chip       = document.getElementById('selecionado-chip');
    chipNome   = document.getElementById('chip-nome');
    chipTrocar = document.getElementById('chip-trocar');

    if (!input || !lista || !scroll) {
      console.warn('[perfil-busca] Elementos do seletor não encontrados.');
      return;
    }

    todosParticipantes = participantes || [];
    onSelecionar       = callback || null;

    configurarEventos();

    // pré-seleciona via ?participante=Nome na URL
    const params    = new URLSearchParams(window.location.search);
    const nomeParam = params.get('participante');
    if (nomeParam) {
      const encontrado = todosParticipantes.find(p =>
        p.nome === nomeParam ||
        norm(p.nome) === norm(nomeParam)
      );
      if (encontrado) {
        chipNome.textContent = encontrado.nome;
        chip.classList.add('visivel');
        if (typeof onSelecionar === 'function') {
          onSelecionar(encontrado.nome);
        }
      }
    }
  };

})();
