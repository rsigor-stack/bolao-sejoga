/**
 * ==========================================================
 * Bolão Se Joga Copa do Mundo 2026
 * Layout — injeta o cabeçalho comum e o estado de login
 * ==========================================================
 *
 * Substitui o antigo padrão repetido em cada página:
 *
 *   <script>
 *     fetch('header.html').then(r => r.text()).then(html => ...);
 *   </script>
 *
 * Agora cada página só precisa chamar:
 *
 *   Bolao.layout.montarHeader();
 *
 * Dependências:
 * core.js, config.js, auth.js
 *
 * ==========================================================
 */

(function () {

    "use strict";

    if (!window.Bolao) {
        throw new Error("core.js deve ser carregado antes de layout.js");
    }
    if (!Bolao.auth) {
        throw new Error("auth.js deve ser carregado antes de layout.js");
    }

    Bolao.layout = {};

    //----------------------------------------------------------
    // CSS da área de login/modal (injetado uma única vez)
    //----------------------------------------------------------

    function injetarEstilos() {
        if (document.getElementById("bolao-auth-style")) return;

        const style = document.createElement("style");
        style.id = "bolao-auth-style";
        style.textContent = `
            .auth-area {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .auth-nome {
                color: #fff;
                font-weight: 600;
                font-size: .9rem;
            }
            .auth-btn {
                border: none;
                cursor: pointer;
                padding: 10px 18px;
                border-radius: 999px;
                font-weight: 700;
                background: linear-gradient(135deg, #00d4ff, #08f7a1);
                color: #04142d;
            }
            .modal-login-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .modal-login-caixa {
                background: #0a2d62;
                border: 1px solid rgba(255,255,255,.15);
                border-radius: 16px;
                padding: 28px;
                width: 90%;
                max-width: 360px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .modal-login-caixa h3 {
                color: #fff;
                margin-bottom: 4px;
            }
            .modal-login-caixa input {
                padding: 12px 14px;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,.2);
                background: rgba(255,255,255,.08);
                color: #fff;
                font-size: 1rem;
            }
            .modal-login-erro {
                color: #ff6b6b;
                font-size: .85rem;
                min-height: 18px;
            }
            .modal-login-rodape {
                text-align: center;
                color: rgba(255,255,255,.7);
                font-size: .85rem;
                margin-top: 4px;
            }
            .modal-login-rodape a {
                color: #08f7a1;
                font-weight: 600;
                text-decoration: none;
            }
            .modal-login-botoes {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .modal-login-botoes button {
                border: none;
                cursor: pointer;
                padding: 10px 16px;
                border-radius: 999px;
                font-weight: 600;
            }
            #login-cancelar {
                background: rgba(255,255,255,.1);
                color: #fff;
            }
            #login-confirmar {
                background: linear-gradient(135deg, #00d4ff, #08f7a1);
                color: #04142d;
            }
            
            /* ===================== ACEITE DO REGULAMENTO ===================== */
            .form-group.aceite-regulamento {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              margin-bottom: 24px;
              font-size: 0.9rem;
              opacity: 0.9;
            }
            
            .form-group.aceite-regulamento input[type="checkbox"] {
              width: 20px;
              height: 20px;
              margin-top: 2px;
              accent-color: var(--accent-2); /* Aplica a cor verde/neon ao checkbox */
              cursor: pointer;
              flex-shrink: 0;
            }
            
            .form-group.aceite-regulamento label {
              cursor: pointer;
              line-height: 1.4;
            }
            
            .form-group.aceite-regulamento a {
              color: var(--accent);
              text-decoration: underline;
              text-underline-offset: 3px;
              font-weight: 600;
            }
            .form-group.aceite-regulamento a:hover {
              color: var(--accent-2);
            }
            
            /* Estado desabilitado do botão primário */
            .btn--primary:disabled {
              background: rgba(255,255,255,0.1);
              color: rgba(255,255,255,0.4);
              cursor: not-allowed;
              box-shadow: none;
              transform: none;
            }
            .btn--primary:disabled:hover {
              transform: none;
              box-shadow: none;
            }
            
        `;
        document.head.appendChild(style);
    }

    //----------------------------------------------------------
    // Injeta header.html e depois renderiza o estado de login
    //----------------------------------------------------------

    Bolao.layout.montarHeader = function () {
        injetarEstilos();

        const placeholder = document.getElementById("header-placeholder");
        if (!placeholder) return;

        // Caminho absoluto a partir da raiz do domínio: funciona tanto
        // para o index.html (raiz) quanto para páginas dentro de /Paginas,
        // /Paginas/Subpasta, etc. — sem depender de onde a página está.
        fetch("/Paginas/header.html")
            .then(r => r.text())
            .then(html => {
                placeholder.innerHTML = html;
                Bolao.layout.renderAuthArea();
            });
    };

    //----------------------------------------------------------
    // Renderiza "Olá, Fulano [Sair]" ou botão "Entrar"
    //----------------------------------------------------------

    Bolao.layout.renderAuthArea = function () {
        const area = document.getElementById("auth-area");
        if (!area) return;

        const usuario = Bolao.auth.getUsuario();

        if (usuario) {
            area.innerHTML = `
                <span class="auth-nome">👋 ${usuario.nome}</span>
                <button type="button" class="auth-btn" id="btn-sair">Sair</button>
            `;
            document.getElementById("btn-sair").addEventListener("click", () => {
                Bolao.auth.logout();
                Bolao.layout.renderAuthArea();
            });
        } else {
            area.innerHTML = `
                <button type="button" class="auth-btn" id="btn-entrar">Entrar</button>
            `;
            document.getElementById("btn-entrar").addEventListener("click", () => {
                Bolao.layout.abrirModalLogin();
            });
        }
    };

    //----------------------------------------------------------
    // Modal simples de login (nome + PIN)
    //----------------------------------------------------------

    Bolao.layout.abrirModalLogin = function () {
        if (document.getElementById("modal-login")) return; // já aberto

        const modal = document.createElement("div");
        modal.id = "modal-login";
        modal.className = "modal-login-overlay";
        modal.innerHTML = `
            <div class="modal-login-caixa">
                <h3>Entrar</h3>
                <input type="text" id="login-nome" placeholder="Seu nome" autocomplete="name" />
                <input type="password" id="login-pin" placeholder="Seu PIN" inputmode="numeric" maxlength="6" />
                <div class="modal-login-erro" id="login-erro"></div>
                <div class="modal-login-botoes">
                    <button type="button" id="login-cancelar">Cancelar</button>
                    <button type="button" id="login-confirmar">Entrar</button>
                </div>
                <div class="modal-login-rodape">
                    Ainda não tem conta?
                    <a href="#" id="link-cadastro">Cadastre-se</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("login-cancelar").addEventListener("click", () => {
            modal.remove();
        });

        document.getElementById("login-confirmar").addEventListener("click", async () => {
            const nome = document.getElementById("login-nome").value.trim();
            const pin = document.getElementById("login-pin").value.trim();
            const erroEl = document.getElementById("login-erro");

            if (!nome || !pin) {
                erroEl.textContent = "Preencha nome e PIN.";
                return;
            }

            erroEl.textContent = "Entrando...";
            const resultado = await Bolao.auth.login(nome, pin);

            if (resultado.erro) {
                erroEl.textContent = resultado.erro;
                return;
            }

            modal.remove();
            Bolao.layout.renderAuthArea();
        });

        document.getElementById("link-cadastro").addEventListener("click", (e) => {
            e.preventDefault();
            modal.remove();
            Bolao.layout.abrirModalCadastro();
        });
    };

    //----------------------------------------------------------
    // Modal de solicitação de cadastro (fica Pendente até aprovação)
    //----------------------------------------------------------

Bolao.layout.abrirModalCadastro = function () {
    if (document.getElementById("modal-login")) return;

    const modal = document.createElement("div");
    modal.id = "modal-login";
    modal.className = "modal-login-overlay";
    modal.innerHTML = `
        <div class="modal-login-caixa">
            <h3>Solicitar cadastro</h3>
            <input type="text" id="cad-nome" placeholder="Defina seu nome de usuário" autocomplete="name" />
            <input type="password" id="cad-pin" placeholder="Escolha um PIN (4-6 dígitos)" inputmode="numeric" maxlength="6" />
            <input type="password" id="cad-pin2" placeholder="Confirme o PIN" inputmode="numeric" maxlength="6" />
            <div class="cad-regulamento">
                <input type="checkbox" id="cad-regulamento" />
                <label for="cad-regulamento">Li e concordo com o <a href="/Files/Regulamento Bolao Se Joga na Copa Libertadores 2026.pdf" target="_blank">Regulamento</a></label>
            </div>
            <div class="modal-login-erro" id="cad-erro"></div>
            <div class="modal-login-botoes">
                <button type="button" id="cad-cancelar">Cancelar</button>
                <button type="button" id="cad-confirmar" disabled>Enviar</button>
            </div>
            <div class="modal-login-rodape">
                Já tem conta?
                <a href="#" id="link-login">Entrar</a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("cad-cancelar").addEventListener("click", () => {
        modal.remove();
    });

    document.getElementById("link-login").addEventListener("click", (e) => {
        e.preventDefault();
        modal.remove();
        Bolao.layout.abrirModalLogin();
    });

    // Habilita o botão de envio somente quando o usuário marcar o checkbox
    const checkbox = document.getElementById("cad-regulamento");
    const btnEnviar = document.getElementById("cad-confirmar");
    if (checkbox && btnEnviar) {
        checkbox.addEventListener("change", (e) => {
            btnEnviar.disabled = !e.target.checked;
        });
    }

    document.getElementById("cad-confirmar").addEventListener("click", async () => {
        const nome = document.getElementById("cad-nome").value.trim();
        const pin = document.getElementById("cad-pin").value.trim();
        const pin2 = document.getElementById("cad-pin2").value.trim();
        const regulamento = document.getElementById("cad-regulamento").checked;
        const erroEl = document.getElementById("cad-erro");

        if (!nome || !pin || !pin2) {
            erroEl.textContent = "Preencha todos os campos.";
            return;
        }
        if (pin.length < 4) {
            erroEl.textContent = "O PIN deve ter pelo menos 4 dígitos.";
            return;
        }
        if (pin !== pin2) {
            erroEl.textContent = "Os PINs não coincidem.";
            return;
        }
        if (!regulamento) {
            // Proteção extra: o botão já deve estar desabilitado, mas checamos de qualquer forma.
            erroEl.textContent = "Você precisa concordar com o Regulamento.";
            return;
        }

        erroEl.textContent = "Enviando...";
        const resultado = await Bolao.auth.solicitarCadastro(nome, pin);

        if (resultado.erro) {
            erroEl.textContent = resultado.erro;
            return;
        }

        modal.querySelector(".modal-login-caixa").innerHTML = `
            <h3>Cadastro enviado! ✅</h3>
            <p>Assim que o organizador aprovar, você já pode entrar com o nome e PIN escolhidos.</p>
            <div class="modal-login-botoes">
                <button type="button" id="cad-fechar">Fechar</button>
            </div>
        `;
        document.getElementById("cad-fechar").addEventListener("click", () => modal.remove());
    });
};
})();
