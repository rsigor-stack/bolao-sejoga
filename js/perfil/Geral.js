Bolao.events.on(

    "perfil:changed",

    ({ participante, dados }) => {

        Bolao.perfil.geral.render(

            participante,

            dados

        );

    }

);
